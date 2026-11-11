from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Offre_Emploi, Candidature
from .serializers import OffreEmploiSerializer, OffreEmploiListSerializer, CandidatureSerializer
from django.db.models import Q
# import de Blocage pour filtrer les offres des devs bloqués
from Accounts.models import Blocage
# import de creer_notif pour notifier le dev en cas de refus IA
from Accounts.utils import creer_notif

class CreerOffreEmploiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # vérifie que le dev n'est pas banni
        if request.user.banne:
            return Response(
                {'erreur': 'Votre compte est banni.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OffreEmploiSerializer(data=request.data)
        if serializer.is_valid():
            offre = serializer.save(developper=request.user)

            # appel direct au service agent
            try:
                from Agents.services.verification_services import verifier_offre
                resultat = verifier_offre(
                    nom_poste=offre.nom_poste,
                    description=offre.description,
                    localisation=offre.localisation,
                    competences=offre.competence_requise
                )
                if resultat["approuve"]:
                    offre.feu_vert = True
                    offre.save()
                    return Response({
                        'message': 'Offre créée et validée avec succès.',
                        'offre': OffreEmploiSerializer(offre).data
                    }, status=status.HTTP_201_CREATED)
                else:
                    raison = resultat["raison"] or "Contenu non conforme aux règles de la plateforme."
                    creer_notif(
                        offre.developper,
                        'post_refuse',
                        f'Votre offre a été refusée : {raison}'
                    )
                    # l'offre reste en base avec feu_vert=False
                    # le dev peut la modifier et la resoumettre
                    return Response({
                        'message': 'Votre offre a été refusée par l\'IA. Vous pouvez la modifier.',
                        'raison': raison,
                        'feu_vert': False,
                        'offre': OffreEmploiSerializer(offre).data
                    }, status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                return Response({
                    'message': 'Offre créée avec succès. En attente de validation.',
                    'offre': OffreEmploiSerializer(offre).data
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListeOffreEmploiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ne retourne que les offres validées par l'IA
        # triées par deadline la plus proche en premier
        # exclut les offres des devs bloqués par le dev connecté
        devs_bloques = Blocage.objects.filter(
            bloqueur=request.user
        ).values_list('bloque', flat=True)

        offres = Offre_Emploi.objects.filter(
            feu_vert=True
        ).exclude(
            developper__in=devs_bloques
        ).order_by('deadline')
        serializer = OffreEmploiListSerializer(offres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DetailOffreEmploiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_publication):
        try:
            offre = Offre_Emploi.objects.get(
                id_publication=id_publication,
                feu_vert=True
            )
        except Offre_Emploi.DoesNotExist:
            return Response(
                {'erreur': 'Offre introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OffreEmploiSerializer(offre)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, id_publication):
        try:
            # seul le créateur peut modifier son offre
            offre = Offre_Emploi.objects.get(
                id_publication=id_publication,
                developper=request.user
            )
        except Offre_Emploi.DoesNotExist:
            return Response(
                {'erreur': 'Offre introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OffreEmploiSerializer(offre, data=request.data, partial=True)
        if serializer.is_valid():
            offre = serializer.save(feu_vert=False)

            # rappel direct au service agent pour revalider
            try:
                from Agents.services.verification_services import verifier_offre
                resultat = verifier_offre(
                    nom_poste=offre.nom_poste,
                    description=offre.description,
                    localisation=offre.localisation,
                    competences=offre.competence_requise
                )
                if resultat["approuve"]:
                    offre.feu_vert = True
                    offre.save()
                    message_retour = 'Offre modifiée et revalidée avec succès.'
                else:
                    creer_notif(
                        offre.developper,
                        'post_refuse',
                        f'Votre offre modifiée a été refusée : {resultat["raison"]}'
                    )
                    message_retour = f'Offre modifiée mais refusée par l\'IA : {resultat["raison"]}'
            except Exception:
                message_retour = 'Offre modifiée avec succès. En attente de revalidation.'

            return Response({
                'message': message_retour,
                'offre': OffreEmploiSerializer(offre).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupprimerOffreEmploiView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_publication):
        try:
            # seul le créateur peut supprimer son offre
            offre = Offre_Emploi.objects.get(
                id_publication=id_publication,
                developper=request.user
            )
        except Offre_Emploi.DoesNotExist:
            return Response(
                {'erreur': 'Offre introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        offre.delete()
        return Response(
            {'message': 'Offre supprimée avec succès.'},
            status=status.HTTP_200_OK
        )

class PostulerOffreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_publication):
        # vérifie que le dev n'est pas banni
        if request.user.banne:
            return Response(
                {'erreur': 'Votre compte est banni.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            offre = Offre_Emploi.objects.get(
                id_publication=id_publication,
                feu_vert=True
            )
        except Offre_Emploi.DoesNotExist:
            return Response(
                {'erreur': 'Offre introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # vérifie que le dev n'a pas déjà postulé
        if Candidature.objects.filter(
            developpeur=request.user,
            offre_emploi=offre
        ).exists():
            return Response(
                {'erreur': 'Vous avez déjà postulé à cette offre.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CandidatureSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                developpeur=request.user,
                offre_emploi=offre
            )
            # notifie le recruteur qu'il a reçu une candidature
            creer_notif(
                offre.developper,
                'candidature',
                f'{request.user.pseudo} a postulé à votre offre "{offre.nom_poste}".'
            )
            return Response({
                'message': 'Candidature envoyée avec succès.'
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class RechercheOffreEmploiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')

        if not query:
            return Response(
                {'erreur': 'Veuillez fournir un mot clé de recherche.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # cherche dans nom_poste, localisation et competence_requise
        offres = Offre_Emploi.objects.filter(
            Q(nom_poste__icontains=query) |
            Q(localisation__icontains=query) |
            Q(competence_requise__icontains=query),
            feu_vert=True
        ).order_by('deadline')

        serializer = OffreEmploiListSerializer(offres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MesCandidaturesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # filtre optionnel par état : ?etat=accepte, ?etat=refuse, ?etat=en_attente
        etat = request.query_params.get('etat', None)

        candidatures = Candidature.objects.filter(
            developpeur=request.user
        ).order_by('-date_postule')

        if etat:
            # vérifie que l'état demandé est valide
            if etat not in ['accepte', 'refuse', 'en_attente']:
                return Response(
                    {'erreur': 'État invalide. Utilisez "accepte", "refuse" ou "en_attente".'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            candidatures = candidatures.filter(etat=etat)

        serializer = CandidatureSerializer(candidatures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GererCandidaturesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_publication):
        try:
            offre = Offre_Emploi.objects.get(
                id_publication=id_publication,
                developper=request.user
            )
        except Offre_Emploi.DoesNotExist:
            return Response(
                {'erreur': 'Offre introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        etat = request.query_params.get('etat', None)

        candidatures = Candidature.objects.filter(
            offre_emploi=offre
        ).order_by('-date_postule')

        if etat:
            if etat not in ['accepte', 'refuse', 'en_attente']:
                return Response(
                    {'erreur': 'État invalide. Utilisez "accepte", "refuse" ou "en_attente".'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            candidatures = candidatures.filter(etat=etat)

        serializer = CandidatureSerializer(candidatures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def put(self, request, id_publication, id_candidature):
        try:
            offre = Offre_Emploi.objects.get(
                id_publication=id_publication,
                developper=request.user
            )
        except Offre_Emploi.DoesNotExist:
            return Response(
                {'erreur': 'Offre introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            candidature = Candidature.objects.get(
                id=id_candidature,
                offre_emploi=offre
            )
        except Candidature.DoesNotExist:
            return Response(
                {'erreur': 'Candidature introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # seuls les états valides sont acceptes ou refuse
        nouvel_etat = request.data.get('etat')
        if nouvel_etat not in ['accepte', 'refuse']:
            return Response(
                {'erreur': 'État invalide. Utilisez "accepte" ou "refuse".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        candidature.etat = nouvel_etat
        candidature.save()

        # notifier le candidat par email
        from django.core.mail import send_mail
        message = 'Félicitations, votre candidature a été acceptée !' if nouvel_etat == 'accepte' else 'Votre candidature a été refusée.'
        send_mail(
            subject=f'Réponse à votre candidature — {offre.nom_poste}',
            message=message,
            from_email='noreply@cadev.com',
            recipient_list=[candidature.developpeur.email],
        )

        # notifie le candidat via le système de notifications
        creer_notif(
            candidature.developpeur,
            'candidature_reponse',
            f'Votre candidature pour "{offre.nom_poste}" a été {"acceptée" if nouvel_etat == "accepte" else "refusée"}.'
        )

        return Response({
            'message': f'Candidature {nouvel_etat} avec succès.'
        }, status=status.HTTP_200_OK)


class MesOffresView(APIView):
    """Retourne toutes les offres du dev connecté (validées ou non)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        offres = Offre_Emploi.objects.filter(
            developper=request.user
        ).order_by('-date_publication')
        
        serializer = OffreEmploiListSerializer(offres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.db import IntegrityError, transaction
from uuid import UUID
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.fields import UUIDField
from .serializers import (
    InscriptionSerializer, ConnexionSerializer, DevelopperSerializer, NotifSerializer,
    ProfilInfosSerializer, ProfilMembreSerializer, ModifierIdentifiantsSerializer,
    RafraichirConnexionSerializer, ProfilPersonnelSerializer, ExperienceSerializer,
    PossessionSerializer,
)
from Groups.models import Group
from Learning.models import Competence
from .models import Developper, Blocage, Sourdine, Notif, Experience, Possession
import os
from django.db.models import Q
from django.views import View
from django.shortcuts import redirect as django_redirect
from django.middleware.csrf import get_token
from django.http import JsonResponse


class CsrfView(View):
    def get(self, request):
        # génère et envoie le cookie CSRF
        get_token(request)
        return JsonResponse({'detail': 'CSRF cookie set'})

class InscriptionView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='5/h', method='POST', block=True))
    def post(self, request):
        serializer = InscriptionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            dev = serializer.save()
            refresh = RefreshToken.for_user(dev)
            return Response({
                'message': 'Compte créé avec succès.',
                'identifiant': str(dev.identifiant),
                'email': dev.email,
                'nom': dev.nom,
                'prenom': dev.prenom,
                'pseudo': dev.pseudo,
                'age': dev.age,
                'pays': dev.pays,
                'sexe': dev.sexe,
                'lien_portfolio': dev.lien_portfolio,
                'lien_github': dev.lien_github,
                'point_penalite': dev.point_penalite,
                # Le frontend récupère les identifiants des expériences dès l'inscription.
                'profil': ProfilPersonnelSerializer(dev, context={'request': request}).data,
                'tokens':{
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConnexionView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='10/h', method='POST', block=True))
    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)
        if serializer.is_valid():
            # email = serializer.validated_data['email']
            # password = serializer.validated_data['mot_de_passe']
            dev=serializer.validated_data['dev']
            refresh = RefreshToken.for_user(dev)
            return Response({
                'message': 'Connexion reussie.',
                'email':dev.email,                   
                
                'tokens':{
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RafraichirConnexionView(TokenRefreshView):
    serializer_class = RafraichirConnexionSerializer


class DeconnexionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Déconnexion réussie.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'erreur': 'Token invalide.'}, status=status.HTTP_400_BAD_REQUEST)

class ProfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfilPersonnelSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def put(self, request):
        # L'ancienne route respecte aussi la vérification du mot de passe pour le pseudo.
        serializer = ProfilInfosSerializer(
            request.user, data=request.data, partial=True, context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfilMembreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        membre = request.query_params.get('membre', '').strip()
        if not membre:
            return Response({'erreur': 'Indiquez un membre.'}, status=status.HTTP_400_BAD_REQUEST)

        # Accepte les liens déjà utilisés par la communauté et les liens partagés à UUID stable.
        comptes = Developper.objects.filter(banne=False, is_active=True).prefetch_related(
            'possessions__competence', 'experiences',
        )
        try:
            identifiant = UUID(membre)
        except ValueError:
            identifiant = None
        profil = comptes.filter(identifiant=identifiant).first() if identifiant else None
        if profil is None:
            profil = comptes.filter(Q(email=membre) | Q(pseudo=membre)).first()
        if profil is None and membre.startswith('dev-') and '@' in membre:
            profil = comptes.filter(email=membre[4:]).first()
        if profil is None:
            return Response({'erreur': 'Membre introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProfilMembreSerializer(profil, context={'request': request}).data)


class MotDePasseOublieView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='3/h', method='POST', block=True))
    def post(self, request):
        email = request.data.get('email')
        try:
            dev = Developper.objects.get(email=email)
            token = default_token_generator.make_token(dev)
            uid = urlsafe_base64_encode(force_bytes(dev.pk))
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
            reset_link = f"{frontend_url}/#reset?uid={uid}&token={token}"


            # lien que le frontend utilisera pour réinitialiser le mot de passe
            #reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            send_mail(
                subject='Réinitialisation de votre mot de passe',
                message=f'Cliquez sur ce lien pour réinitialiser votre mot de passe : {reset_link}',
                from_email='noreply@cadev.com',
                recipient_list=[email],
            )
        except Developper.DoesNotExist:
            pass  # on ne révèle pas si l'email existe ou non
        return Response({'message': 'Si cet email existe, un lien a été envoyé.'}, status=status.HTTP_200_OK)



class ReinitialisationMotDePasseView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            dev = Developper.objects.get(pk=uid)
        except (Developper.DoesNotExist, ValueError):
            return Response({'erreur': 'Lien invalide.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(dev, token):
            return Response({'erreur': 'Lien expiré ou invalide.'}, status=status.HTTP_400_BAD_REQUEST)

        password = request.data.get('password')
        if not password or len(password) < 8:
            return Response({'erreur': 'Le mot de passe doit contenir au moins 8 caractères.'}, status=status.HTTP_400_BAD_REQUEST)

        dev.set_password(password)
        dev.save()
        return Response({'message': 'Mot de passe réinitialisé avec succès.'}, status=status.HTTP_200_OK)


class SupprimerCompteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        dev = request.user
        
        # ── vérification du mot de passe (obligatoire pour la sécurité) ────────
        password = request.data.get('password')
        
        if not password:
            return Response(
                {'erreur': 'Le mot de passe est requis pour supprimer votre compte.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # vérifie que le mot de passe est correct
        if not dev.check_password(password):
            return Response(
                {'erreur': 'Mot de passe incorrect.'},
                status=status.HTTP_403_FORBIDDEN
            )
        # ────────────────────────────────────────────────────────────────────────
        
        # on déconnecte le dev en invalidant son refresh token s'il est fourni
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass  # on continue la suppression même si le token est invalide

        # la suppression du dev déclenchera automatiquement le signal post_delete
        # qui supprimera la photo de profil du disque
        email = dev.email  # Sauvegarde pour le log
        dev.delete()
        
        return Response({
            'message': 'Compte supprimé avec succès.',
            'email': email
        }, status=status.HTTP_200_OK)

class RechercheDeveloppeurView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')

        if not query:
            return Response(
                {'erreur': 'Veuillez fournir un mot clé de recherche.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # cherche dans pseudo, nom et prenom
        devs = Developper.objects.filter(
            Q(pseudo__icontains=query) |
            Q(nom__icontains=query) |
            Q(prenom__icontains=query),
            banne=False
        )

        serializer = DevelopperSerializer(devs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BlocageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, email):
        # bloquer un dev
        try:
            dev_a_bloquer = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if dev_a_bloquer == request.user:
            return Response({'erreur': 'Vous ne pouvez pas vous bloquer vous-même.'}, status=status.HTTP_400_BAD_REQUEST)

        if Blocage.objects.filter(bloqueur=request.user, bloque=dev_a_bloquer).exists():
            return Response({'erreur': 'Ce développeur est déjà bloqué.'}, status=status.HTTP_400_BAD_REQUEST)

        Blocage.objects.create(bloqueur=request.user, bloque=dev_a_bloquer)
        return Response({'message': f'{dev_a_bloquer.pseudo} est bloqué.'}, status=status.HTTP_201_CREATED)

    def delete(self, request, email):
        # débloquer un dev
        try:
            dev_a_debloquer = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            blocage = Blocage.objects.get(bloqueur=request.user, bloque=dev_a_debloquer)
            blocage.delete()
            return Response({'message': f'{dev_a_debloquer.pseudo} est débloqué.'}, status=status.HTTP_200_OK)
        except Blocage.DoesNotExist:
            return Response({'erreur': 'Ce développeur n\'est pas bloqué.'}, status=status.HTTP_404_NOT_FOUND)

class SourdineView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # mettre en sourdine une personne ou un groupe
        email = request.data.get('email')
        id_group = request.data.get('id_group')

        if not email and not id_group:
            return Response(
                {'erreur': 'Fournissez un email ou un id_group.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if email:
            try:
                dev = Developper.objects.get(email=email)
            except Developper.DoesNotExist:
                return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

            if Sourdine.objects.filter(dev=request.user, dev_sourdine=dev).exists():
                return Response({'erreur': 'Ce développeur est déjà en sourdine.'}, status=status.HTTP_400_BAD_REQUEST)

            Sourdine.objects.create(dev=request.user, dev_sourdine=dev)
            return Response({'message': f'{dev.pseudo} mis en sourdine.'}, status=status.HTTP_201_CREATED)

        if id_group:
            try:
                groupe = Group.objects.get(id_group=id_group)
            except Group.DoesNotExist:
                return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

            if Sourdine.objects.filter(dev=request.user, groupe_sourdine=groupe).exists():
                return Response({'erreur': 'Ce groupe est déjà en sourdine.'}, status=status.HTTP_400_BAD_REQUEST)

            Sourdine.objects.create(dev=request.user, groupe_sourdine=groupe)
            return Response({'message': f'Groupe {groupe.nom} mis en sourdine.'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        # désactiver la sourdine
        email = request.data.get('email')
        id_group = request.data.get('id_group')

        if email:
            try:
                dev = Developper.objects.get(email=email)
                sourdine = Sourdine.objects.get(dev=request.user, dev_sourdine=dev)
                sourdine.delete()
                return Response({'message': f'{dev.pseudo} retiré de la sourdine.'}, status=status.HTTP_200_OK)
            except (Developper.DoesNotExist, Sourdine.DoesNotExist):
                return Response({'erreur': 'Sourdine introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if id_group:
            try:
                groupe = Group.objects.get(id_group=id_group)
                sourdine = Sourdine.objects.get(dev=request.user, groupe_sourdine=groupe)
                sourdine.delete()
                return Response({'message': f'Groupe {groupe.nom} retiré de la sourdine.'}, status=status.HTTP_200_OK)
            except (Group.DoesNotExist, Sourdine.DoesNotExist):
                return Response({'erreur': 'Sourdine introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'erreur': 'Fournissez un email ou un id_group.'}, status=status.HTTP_400_BAD_REQUEST)
    




class NotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # retourne toutes les notifications du dev connecté
        notifs = Notif.objects.filter(destinataire=request.user)
        result = []
        for notif in notifs:
            result.append({
                'id': notif.id,
                'type': notif.type,
                'message': notif.message,
                'lu': notif.lu,
                'date': notif.date,
            })
        return Response(result, status=status.HTTP_200_OK)

class LireNotifView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id_notif):
        # marquer une notification comme lue
        try:
            notif = Notif.objects.get(id=id_notif, destinataire=request.user)
        except Notif.DoesNotExist:
            return Response({'erreur': 'Notification introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        notif.lu = True
        notif.save()
        return Response({'message': 'Notification marquée comme lue.'}, status=status.HTTP_200_OK)

class LireToutesNotifsView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # marquer toutes les notifications comme lues
        Notif.objects.filter(destinataire=request.user, lu=False).update(lu=True)
        return Response({'message': 'Toutes les notifications marquées comme lues.'}, status=status.HTTP_200_OK)

class SupprimerNotifView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_notif):
        try:
            notif = Notif.objects.get(id=id_notif, destinataire=request.user)
        except Notif.DoesNotExist:
            return Response({'erreur': 'Notification introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        notif.delete()
        return Response({'message': 'Notification supprimée.'}, status=status.HTTP_200_OK)



class OAuthTokenView(View):
    """
    Vue appelée après le succès OAuth par social_django.
    Génère les tokens JWT et redirige vers le frontend.
    Cette vue accepte GET et POST car social_django peut utiliser les deux.
    """
    def get(self, request):
        return self._handle(request)

    def post(self, request):
        return self._handle(request)

    def _handle(self, request):
        if not request.user.is_authenticated:
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
            return django_redirect(f"{frontend_url}/#login?error=auth_failed")

        refresh = RefreshToken.for_user(request.user)
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
        redirect_url = (
            f"{frontend_url}/#oauth-callback"
            f"?access={str(refresh.access_token)}"
            f"&refresh={str(refresh)}"
            f"&email={request.user.email}"
        )
        return django_redirect(redirect_url)

class ModifierInfosView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ProfilInfosSerializer(
            request.user, data=request.data, partial=True, context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Profil mis à jour.',
            'profil': serializer.data,
            'experiences_enregistrees': serializer.experiences_enregistrees,
        })


class ModifierEmailPseudoView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ModifierIdentifiantsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        valeurs = serializer.validated_data
        try:
            with transaction.atomic():
                dev = Developper.objects.select_for_update().get(identifiant=request.user.identifiant)
                if not dev.check_password(valeurs['mot_de_passe']):
                    return Response({'erreur': 'Mot de passe incorrect.'}, status=status.HTTP_403_FORBIDDEN)

                email = valeurs.get('email', dev.email)
                pseudo = valeurs.get('pseudo', dev.pseudo)
                autres = Developper.objects.exclude(pk=dev.pk)
                if autres.filter(email=email).exists():
                    return Response({'erreur': 'Cet email est déjà utilisé.'}, status=status.HTTP_400_BAD_REQUEST)
                if autres.filter(pseudo=pseudo).exists():
                    return Response({'erreur': 'Ce pseudo est déjà pris.'}, status=status.HTTP_400_BAD_REQUEST)

                # L'email est la clé primaire historique. save() tenterait une insertion.
                # Django crée des FK différées sur PostgreSQL : réaffecter les références
                # dans la même transaction conserve les messages, offres et autres relations.
                Developper.objects.filter(pk=dev.pk).update(email=email, pseudo=pseudo)
                if email != dev.email:
                    for relation in Developper._meta.get_fields(include_hidden=True):
                        if (relation.auto_created and not relation.concrete and
                            (relation.one_to_many or relation.one_to_one) and
                            relation.field.target_field.primary_key):
                            champ = relation.field.attname
                            relation.related_model._base_manager.filter(**{champ: dev.email}).update(**{champ: email})
        except IntegrityError:
            return Response({'erreur': 'Cet email ou ce pseudo est déjà utilisé.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Email/pseudo mis à jour.', 'email': email, 'pseudo': pseudo})


class ChangerMotDePasseView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # changer le mot de passe — ancien mot de passe requis
        ancien_mdp = request.data.get('ancien_mot_de_passe')
        nouveau_mdp = request.data.get('nouveau_mot_de_passe')
        confirmation = request.data.get('confirmation')

        if not ancien_mdp or not nouveau_mdp or not confirmation:
            return Response(
                {'erreur': 'Tous les champs sont obligatoires.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # vérifie l'ancien mot de passe
        if not request.user.check_password(ancien_mdp):
            return Response(
                {'erreur': 'Ancien mot de passe incorrect.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if nouveau_mdp != confirmation:
            return Response(
                {'erreur': 'Les nouveaux mots de passe ne correspondent pas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(nouveau_mdp) < 8:
            return Response(
                {'erreur': 'Le mot de passe doit contenir au moins 8 caractères.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(nouveau_mdp)
        request.user.save()

        # invalide les tokens existants pour forcer la reconnexion
        # le frontend devra se reconnecter avec le nouveau mot de passe
        return Response({
            'message': 'Mot de passe modifié. Veuillez vous reconnecter.'
        }, status=status.HTTP_200_OK)


class RechercherDevsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        if not query:
            return Response(
                {'erreur': 'Paramètre "q" requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Recherche par pseudo (insensible à la casse, contient le terme)
        devs = Developper.objects.filter(
            pseudo__icontains=query,
            banne=False  # Exclure les devs bannis
        ).values('pseudo', 'email')[:10]  # Limiter à 10 résultats
        
        return Response(list(devs), status=status.HTTP_200_OK)


class MesNotifsView(APIView):
    """Retourne toutes les notifications du dev connecté"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notif.objects.filter(destinataire=request.user)
        serializer = NotifSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MarquerNotifLueView(APIView):
    """Marquer une notification comme lue"""
    permission_classes = [IsAuthenticated]

    def put(self, request, notif_id):
        try:
            notif = Notif.objects.get(
                id=notif_id,
                destinataire=request.user
            )
        except Notif.DoesNotExist:
            return Response(
                {'erreur': 'Notification introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        notif.lu = True
        notif.save()
        return Response({'message': 'Notification marquée comme lue.'}, status=status.HTTP_200_OK)


class MarquerToutesNotifsLuesView(APIView):
    """Marquer toutes les notifications comme lues"""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        Notif.objects.filter(
            destinataire=request.user,
            lu=False
        ).update(lu=True)
        return Response({'message': 'Toutes les notifications ont été marquées comme lues.'}, status=status.HTTP_200_OK)


class CompterNotifsNonLuesView(APIView):
    """Compter les notifications non lues"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notif.objects.filter(
            destinataire=request.user,
            lu=False
        ).count()
        return Response({'count': count}, status=status.HTTP_200_OK)


class ExperienceListCreateView(APIView):
    """
    GET  /api/auth/experiences/       → liste toutes les expériences du dev connecté
    POST /api/auth/experiences/       → ajoute une nouvelle expérience
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        experiences = Experience.objects.filter(developper=request.user)
        serializer = ExperienceSerializer(
            experiences, many=True, context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ExperienceSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(developper=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExperienceDetailView(APIView):
    """
    PUT    /api/auth/experiences/<id>/  → modifie une expérience
    DELETE /api/auth/experiences/<id>/  → supprime une expérience
    """
    permission_classes = [IsAuthenticated]

    def _get_experience(self, pk, user):
        """Retourne l'expérience ou None si elle n'appartient pas au dev."""
        try:
            return Experience.objects.get(pk=pk, developper=user)
        except Experience.DoesNotExist:
            return None

    def put(self, request, pk):
        experience = self._get_experience(pk, request.user)
        if not experience:
            return Response(
                {'erreur': 'Expérience introuvable ou non autorisée.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ExperienceSerializer(
            experience, data=request.data, partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        experience = self._get_experience(pk, request.user)
        if not experience:
            return Response(
                {'erreur': 'Expérience introuvable ou non autorisée.'},
                status=status.HTTP_404_NOT_FOUND
            )
        experience.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PossessionListCreateView(APIView):
    """
    GET  /api/auth/competences/        → liste les compétences du dev connecté
    POST /api/auth/competences/        → ajoute une compétence au profil
         body : { "competence": "<uuid>" }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        possessions = Possession.objects.filter(
            developper=request.user
        ).select_related('competence')
        serializer = PossessionSerializer(possessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        competence_id = request.data.get('competence')
        if not competence_id:
            return Response(
                {'erreur': 'Le champ "competence" (UUID) est requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        competence_id = UUIDField().run_validation(competence_id)
        # Vérifie que la compétence existe avant de créer une possession.
        try:
            competence = Competence.objects.get(id_competence=competence_id)
        except Competence.DoesNotExist:
            return Response(
                {'erreur': 'Compétence introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )
        possession, created = Possession.objects.get_or_create(
            developper=request.user, competence=competence
        )
        if not created:
            return Response(
                {'erreur': 'Tu possèdes déjà cette compétence.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = PossessionSerializer(possession)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PossessionDeleteView(APIView):
    """
    DELETE /api/auth/competences/<id>/  → retire une compétence du profil
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            possession = Possession.objects.get(pk=pk, developper=request.user)
        except Possession.DoesNotExist:
            return Response(
                {'erreur': 'Compétence introuvable ou non autorisée.'},
                status=status.HTTP_404_NOT_FOUND
            )
        possession.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

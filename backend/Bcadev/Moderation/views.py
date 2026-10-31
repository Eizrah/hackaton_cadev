from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from .models import Signalement_Individuel, SignalementPost, SignalementOffre, SignalementGroupe
from Accounts.models import Developper
from Accounts.utils import creer_notif
from Forum.models import Forum_post
from Jobs.models import Offre_Emploi
from Groups.models import Group

# ─── seuils de pénalité ──────────────────────────────────────────────────────
SEUIL_BAN_DEV = 10
SEUIL_SUPPRESSION_CONTENU = 7

def appliquer_penalite_dev(dev):
    """
    Ajoute 1 point de pénalité au dev.
    Si le seuil est atteint → bannissement + email + notif.
    """
    dev.point_penalite += 1
    if dev.point_penalite >= SEUIL_BAN_DEV:
        dev.banne = True
        dev.save()
        # email de bannissement
        send_mail(
            subject='Votre compte a été banni',
            message='Votre compte a été banni suite à un nombre trop élevé de signalements.',
            from_email='noreply@cadev.com',
            recipient_list=[dev.email],
        )
        # notif de bannissement
        creer_notif(dev, 'bannissement', 'Votre compte a été banni.')
    else:
        dev.save()
        # notif de point de pénalité
        creer_notif(
            dev,
            'point_penalite',
            f'Vous avez reçu un point de pénalité. Total : {dev.point_penalite}/{SEUIL_BAN_DEV}.'
        )

def appliquer_penalite_contenu(contenu, createur, type_contenu):
    """
    Ajoute 1 point de pénalité à un post ou une offre.
    Si le seuil est atteint → suppression + email + notif au créateur.
    """
    contenu.point_penalite_obtenu += 1
    if contenu.point_penalite_obtenu >= SEUIL_SUPPRESSION_CONTENU:
        contenu.feu_vert = False
        contenu.save()
        # email au créateur
        send_mail(
            subject=f'Votre {type_contenu} a été supprimé',
            message=f'Votre {type_contenu} a été supprimé suite à trop de signalements.',
            from_email='noreply@cadev.com',
            recipient_list=[createur.email],
        )
        # notif au créateur
        creer_notif(
            createur,
            'post_supprime',
            f'Votre {type_contenu} a été supprimé suite à trop de signalements.'
        )
        # le créateur reçoit aussi 1 point de pénalité
        appliquer_penalite_dev(createur)
    else:
        contenu.save()

def appliquer_penalite_groupe(groupe):
    """
    Ajoute 1 point de pénalité au groupe.
    Si le seuil est atteint → désactivation + email + notif à tous les membres.
    """
    groupe.point_penalite += 1
    if groupe.point_penalite >= SEUIL_SUPPRESSION_CONTENU:
        groupe.actif = False
        from django.utils import timezone
        groupe.date_suppression = timezone.now().date()
        groupe.motif_suppression = 'Groupe dissous suite à trop de signalements.'
        groupe.save()

        # notifie et pénalise tous les membres
        from Groups.models import Membre
        membres = Membre.objects.filter(id_groupe=groupe)
        for membre in membres:
            dev = membre.id_personne
            creer_notif(
                dev,
                'groupe_supprime',
                f'Le groupe "{groupe.nom}" a été dissous suite à trop de signalements.'
            )
            # chaque membre reçoit 1 point de pénalité
            appliquer_penalite_dev(dev)
    else:
        groupe.save()

# ─── Vues de signalement ──────────────────────────────────────────────────────

class SignalerDevView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, email):
        # un dev ne peut pas se signaler lui-même
        if request.user.email == email:
            return Response(
                {'erreur': 'Vous ne pouvez pas vous signaler vous-même.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            dev_signale = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # vérifie qu'il n'a pas déjà signalé ce dev
        if Signalement_Individuel.objects.filter(
            id_signaleur=request.user,
            id_personne_signale=dev_signale
        ).exists():
            return Response(
                {'erreur': 'Vous avez déjà signalé ce développeur.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        motif = request.data.get('motif', '')
        if not motif:
            return Response({'erreur': 'Le motif est obligatoire.'}, status=status.HTTP_400_BAD_REQUEST)

        Signalement_Individuel.objects.create(
            id_signaleur=request.user,
            id_personne_signale=dev_signale,
            motif=motif,
            traite=True
        )

        # applique la pénalité au dev signalé
        appliquer_penalite_dev(dev_signale)

        return Response({'message': 'Signalement envoyé.'}, status=status.HTTP_201_CREATED)

class SignalerPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_publication):
        try:
            post = Forum_post.objects.get(id_publication=id_publication, feu_vert=True)
        except Forum_post.DoesNotExist:
            return Response({'erreur': 'Post introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # un dev ne peut pas signaler son propre post
        if post.developper == request.user:
            return Response(
                {'erreur': 'Vous ne pouvez pas signaler votre propre post.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if SignalementPost.objects.filter(
            id_signaleur=request.user,
            id_post=post
        ).exists():
            return Response(
                {'erreur': 'Vous avez déjà signalé ce post.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        motif = request.data.get('motif', '')
        if not motif:
            return Response({'erreur': 'Le motif est obligatoire.'}, status=status.HTTP_400_BAD_REQUEST)

        SignalementPost.objects.create(
            id_signaleur=request.user,
            id_post=post,
            motif=motif,
            traite=True
        )

        # applique la pénalité au post
        appliquer_penalite_contenu(post, post.developper, 'post')

        return Response({'message': 'Signalement envoyé.'}, status=status.HTTP_201_CREATED)

class SignalerOffreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_publication):
        try:
            offre = Offre_Emploi.objects.get(id_publication=id_publication, feu_vert=True)
        except Offre_Emploi.DoesNotExist:
            return Response({'erreur': 'Offre introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if offre.developper == request.user:
            return Response(
                {'erreur': 'Vous ne pouvez pas signaler votre propre offre.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if SignalementOffre.objects.filter(
            id_signaleur=request.user,
            id_offre=offre
        ).exists():
            return Response(
                {'erreur': 'Vous avez déjà signalé cette offre.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        motif = request.data.get('motif', '')
        if not motif:
            return Response({'erreur': 'Le motif est obligatoire.'}, status=status.HTTP_400_BAD_REQUEST)

        SignalementOffre.objects.create(
            id_signaleur=request.user,
            id_offre=offre,
            motif=motif,
            traite=True
        )

        # applique la pénalité à l'offre
        appliquer_penalite_contenu(offre, offre.developper, 'offre')

        return Response({'message': 'Signalement envoyé.'}, status=status.HTTP_201_CREATED)

class SignalerGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_group):
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if SignalementGroupe.objects.filter(
            id_signaleur=request.user,
            id_groupe=groupe
        ).exists():
            return Response(
                {'erreur': 'Vous avez déjà signalé ce groupe.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        motif = request.data.get('motif', '')
        if not motif:
            return Response({'erreur': 'Le motif est obligatoire.'}, status=status.HTTP_400_BAD_REQUEST)

        SignalementGroupe.objects.create(
            id_signaleur=request.user,
            id_groupe=groupe,
            motif=motif,
            traite=True
        )

        # applique la pénalité au groupe
        appliquer_penalite_groupe(groupe)

        return Response({'message': 'Signalement envoyé.'}, status=status.HTTP_201_CREATED)

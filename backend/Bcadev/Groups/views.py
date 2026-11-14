from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from .models import Group, Membre, InvitationGroupe
from .serializers import GroupSerializer, GroupListSerializer, MembreSerializer, InvitationSerializer
from Accounts.models import Developper
from Accounts.utils import creer_notif
from Messaging.models import Message
from Messaging.serializers import MessageSerializer, AudioSerializer, FichierSerializer

# ─── utilitaire pour vérifier le rôle d'un membre ────────────────────────────

def get_membre(dev, groupe):
    """Retourne le Membre ou None si le dev n'est pas dans le groupe"""
    try:
        return Membre.objects.get(id_personne=dev, id_groupe=groupe)
    except Membre.DoesNotExist:
        return None

def est_admin(dev, groupe):
    m = get_membre(dev, groupe)
    return m and m.type == 'A'

def est_admin_ou_moderateur(dev, groupe):
    m = get_membre(dev, groupe)
    return m and m.type in ['A', 'M']

# ─── Gestion du groupe ────────────────────────────────────────────────────────

class CreerGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.banne:
            return Response({'erreur': 'Votre compte est banni.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = GroupSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            groupe = serializer.save()
            # le créateur devient automatiquement Admin
            Membre.objects.create(
                id_groupe=groupe,
                id_personne=request.user,
                type='A'
            )
            # Re-sérialiser avec le contexte pour avoir l'URL complète
            result_serializer = GroupSerializer(groupe, context={'request': request})
            return Response({
                'message': 'Groupe créé avec succès.',
                'groupe': result_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListeGroupesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # retourne les groupes actifs dont le dev est membre
        groupes = Group.objects.filter(
            membre__id_personne=request.user,
            actif=True
        )
        serializer = GroupListSerializer(groupes, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class DetailGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_group):
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # vérifie que le dev est membre
        if not get_membre(request.user, groupe):
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = GroupSerializer(groupe, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id_group):
        # modifier nom et photo — admin ou modérateur
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not est_admin_ou_moderateur(request.user, groupe):
            return Response({'erreur': 'Permission insuffisante.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = GroupSerializer(groupe, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            # Re-sérialiser avec le contexte pour avoir l'URL complète
            result_serializer = GroupSerializer(groupe, context={'request': request})
            return Response({
                'message': 'Groupe modifié.',
                'groupe': result_serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_group):
        # supprimer — admin uniquement
        try:
            groupe = Group.objects.get(id_group=id_group)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not est_admin(request.user, groupe):
            return Response({'erreur': 'Seul l\'admin peut supprimer le groupe.'}, status=status.HTTP_403_FORBIDDEN)

        motif = request.data.get('motif_suppression', '')
        groupe.actif = False
        groupe.motif_suppression = motif
        from django.utils import timezone
        groupe.date_suppression = timezone.now().date()
        groupe.save()

        return Response({'message': 'Groupe désactivé avec succès.'}, status=status.HTTP_200_OK)

# ─── Gestion des membres ─────────────────────────────────────────────────────

class MembreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_group):
        # liste des membres
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not get_membre(request.user, groupe):
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

        membres = Membre.objects.filter(id_groupe=groupe)
        serializer = MembreSerializer(membres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request, id_group):
        # Une invitation et sa notification sont créées ensemble.
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not est_admin_ou_moderateur(request.user, groupe):
            return Response({'erreur': 'Permission insuffisante.'}, status=status.HTTP_403_FORBIDDEN)

        email = request.data.get('email')
        try:
            dev = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # Vérifier si déjà membre
        if get_membre(dev, groupe):
            return Response({'erreur': 'Ce dev est déjà membre du groupe.'}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si invitation en attente
        invitation_existante = InvitationGroupe.objects.filter(
            groupe=groupe,
            invite=dev,
            statut='P'
        ).first()

        if invitation_existante:
            return Response({'erreur': 'Une invitation est déjà en attente pour ce développeur.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Supprimer les anciennes invitations (acceptées ou refusées)
        InvitationGroupe.objects.filter(
            groupe=groupe,
            invite=dev,
            statut__in=['A', 'R']
        ).delete()

        # Créer l'invitation
        invitation = InvitationGroupe.objects.create(
            groupe=groupe,
            inviteur=request.user,
            invite=dev
        )

        # Créer notification pour l'invité
        creer_notif(
            dev,
            'groupe_invitation',
            f'{request.user.pseudo} vous invite à rejoindre le groupe {groupe.nom}.',
            groupe_id=groupe.id_group,
            envoyeur=request.user
        )

        return Response({
            'message': f'Invitation envoyée à {dev.pseudo}.',
            'invitation': InvitationSerializer(invitation, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)

class GererMembreView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_group, email):
        # retirer un membre — admin ou modérateur
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not est_admin_ou_moderateur(request.user, groupe):
            return Response({'erreur': 'Permission insuffisante.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            dev = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # on ne peut pas retirer l'admin
        membre = get_membre(dev, groupe)
        if not membre:
            return Response({'erreur': 'Ce dev n\'est pas membre du groupe.'}, status=status.HTTP_404_NOT_FOUND)

        if membre.type == 'A':
            return Response({'erreur': 'Impossible de retirer l\'admin du groupe.'}, status=status.HTTP_403_FORBIDDEN)

        membre.delete()
        return Response({'message': f'{dev.pseudo} retiré du groupe.'}, status=status.HTTP_200_OK)

    def put(self, request, id_group, email):
        # promouvoir/rétrograder un membre — admin uniquement
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not est_admin(request.user, groupe):
            return Response({'erreur': 'Seul l\'admin peut changer les rôles.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            dev = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response({'erreur': 'Développeur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        membre = get_membre(dev, groupe)
        if not membre:
            return Response({'erreur': 'Ce dev n\'est pas membre du groupe.'}, status=status.HTTP_404_NOT_FOUND)

        nouveau_type = request.data.get('type')
        if nouveau_type not in ['M', 'MB']:
            return Response({'erreur': 'Type invalide. Utilisez "M" (Modérateur) ou "MB" (Membre).'}, status=status.HTTP_400_BAD_REQUEST)

        membre.type = nouveau_type
        membre.save()
        return Response({'message': f'Rôle de {dev.pseudo} mis à jour.'}, status=status.HTTP_200_OK)

class QuitterGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_group):
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        membre = get_membre(request.user, groupe)
        if not membre:
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_404_NOT_FOUND)

        # l'admin ne peut pas quitter sans transférer son rôle
        if membre.type == 'A':
            return Response(
                {'erreur': 'Vous êtes admin. Transférez votre rôle avant de quitter.'},
                status=status.HTTP_403_FORBIDDEN
            )

        membre.delete()
        return Response({'message': 'Vous avez quitté le groupe.'}, status=status.HTTP_200_OK)

# ─── Messagerie de groupe ─────────────────────────────────────────────────────

class MessagesGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_group):
        # voir les messages du groupe
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not get_membre(request.user, groupe):
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

        # Même historique pour le texte, les vocaux et les pièces jointes.
        messages = Message.objects.filter(groupe=groupe).select_related(
            'audio', 'envoyeur', 'message_parent__envoyeur',
        ).prefetch_related('fichiers').order_by('date_envoie')
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, id_group):
        # envoyer un message texte dans le groupe
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not get_membre(request.user, groupe):
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(
                envoyeur=request.user,
                groupe=groupe,
                etat='envoye'
            )
            return Response({
                'message': 'Message envoyé.',
                'data': MessageSerializer(message).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnvoyerAudioGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_group):
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not get_membre(request.user, groupe):
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = AudioSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            audio = serializer.save(
                envoyeur=request.user,
                groupe=groupe,
                etat='envoye'
            )
            return Response({
                'message': 'Audio envoyé.',
                'data': AudioSerializer(audio, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnvoyerFichierGroupeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_group):
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not get_membre(request.user, groupe):
            return Response({'erreur': 'Vous n\'êtes pas membre de ce groupe.'}, status=status.HTTP_403_FORBIDDEN)

        message = Message.objects.create(
            envoyeur=request.user,
            groupe=groupe,
            # Le texte et la pièce jointe appartiennent au même message.
            contenu=request.data.get('contenu') or None,
            etat='envoye',
            message_parent_id=request.data.get('message_parent', None)
        )

        serializer = FichierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                message=message,
                taille=round(request.data['fichier'].size / 1024 / 1024, 2)
            )
            return Response({
                'message': 'Fichier envoyé.',
                'data': MessageSerializer(message).data
            }, status=status.HTTP_201_CREATED)

        message.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── Invitations de groupe ───────────────────────────────────────────────────

class MesInvitationsView(APIView):
    """Liste des invitations reçues en attente"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        invitations = InvitationGroupe.objects.filter(
            invite=request.user,
            statut='P',
            groupe__actif=True
        ).select_related('groupe', 'inviteur', 'invite').order_by('-date_invitation')

        serializer = InvitationSerializer(invitations, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AccepterInvitationView(APIView):
    """Accepter une invitation et rejoindre le groupe"""
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, id_invitation):
        try:
            invitation = InvitationGroupe.objects.select_for_update().get(
                id_invitation=id_invitation,
                invite=request.user,
                statut='P'
            )
        except InvitationGroupe.DoesNotExist:
            return Response({'erreur': 'Invitation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # Vérifier que le groupe est toujours actif
        if not invitation.groupe.actif:
            return Response({'erreur': 'Ce groupe n\'existe plus.'}, status=status.HTTP_400_BAD_REQUEST)

        # Marquer l'invitation comme acceptée
        invitation.statut = 'A'
        invitation.date_reponse = timezone.now()
        invitation.save()

        # Crée l'adhésion dans la même transaction que l'acceptation.
        Membre.objects.get_or_create(
            id_groupe=invitation.groupe, id_personne=request.user,
            defaults={'type': 'MB'},
        )

        # Notifier l'inviteur
        creer_notif(
            invitation.inviteur,
            'groupe_acceptation',
            f'{request.user.pseudo} a accepté votre invitation au groupe {invitation.groupe.nom}.',
            groupe_id=invitation.groupe.id_group,
            envoyeur=request.user
        )

        return Response({
            'message': f'Vous avez rejoint le groupe {invitation.groupe.nom}.',
            'groupe': GroupSerializer(invitation.groupe).data
        }, status=status.HTTP_200_OK)


class RefuserInvitationView(APIView):
    """Refuser une invitation"""
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, id_invitation):
        try:
            invitation = InvitationGroupe.objects.select_for_update().get(
                id_invitation=id_invitation,
                invite=request.user,
                statut='P'
            )
        except InvitationGroupe.DoesNotExist:
            return Response({'erreur': 'Invitation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # Marquer l'invitation comme refusée
        invitation.statut = 'R'
        invitation.date_reponse = timezone.now()
        invitation.save()

        # Optionnel : Notifier l'inviteur
        creer_notif(
            invitation.inviteur,
            'groupe_refus',
            f'{request.user.pseudo} a refusé votre invitation au groupe {invitation.groupe.nom}.',
            groupe_id=invitation.groupe.id_group,
            envoyeur=request.user
        )

        return Response({
            'message': 'Invitation refusée.'
        }, status=status.HTTP_200_OK)

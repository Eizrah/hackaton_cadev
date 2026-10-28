from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Group, Membre
from .serializers import GroupSerializer, GroupListSerializer, MembreSerializer
from Accounts.models import Developper
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

        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            groupe = serializer.save()
            # le créateur devient automatiquement Admin
            Membre.objects.create(
                id_groupe=groupe,
                id_personne=request.user,
                type='A'
            )
            return Response({
                'message': 'Groupe créé avec succès.',
                'groupe': GroupSerializer(groupe).data
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
        serializer = GroupListSerializer(groupes, many=True)
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

        serializer = GroupSerializer(groupe)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id_group):
        # modifier nom et photo — admin ou modérateur
        try:
            groupe = Group.objects.get(id_group=id_group, actif=True)
        except Group.DoesNotExist:
            return Response({'erreur': 'Groupe introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if not est_admin_ou_moderateur(request.user, groupe):
            return Response({'erreur': 'Permission insuffisante.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = GroupSerializer(groupe, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Groupe modifié.',
                'groupe': serializer.data
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

    def post(self, request, id_group):
        # ajouter un membre — admin ou modérateur
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

        if get_membre(dev, groupe):
            return Response({'erreur': 'Ce dev est déjà membre du groupe.'}, status=status.HTTP_400_BAD_REQUEST)

        Membre.objects.create(id_groupe=groupe, id_personne=dev, type='MB')
        return Response({'message': f'{dev.pseudo} ajouté au groupe.'}, status=status.HTTP_201_CREATED)

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

        messages = Message.objects.filter(groupe=groupe).order_by('date_envoie')
        serializer = MessageSerializer(messages, many=True)
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

        serializer = AudioSerializer(data=request.data)
        if serializer.is_valid():
            audio = serializer.save(
                envoyeur=request.user,
                groupe=groupe,
                etat='envoye'
            )
            return Response({
                'message': 'Audio envoyé.',
                'data': AudioSerializer(audio).data
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

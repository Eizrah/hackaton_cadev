from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Message, Audio, Fichier
from .serializers import MessageSerializer, AudioSerializer, FichierSerializer
# import de Blocage pour vérifier si l'envoyeur est bloqué par le destinataire
from Accounts.models import Developper, Blocage
from Accounts.models import Blocage
class EnvoyerMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # récupère le destinataire par son email
        email_destinataire = request.data.get('destinataire')
        

        
        if not email_destinataire:
            return Response(
                {'erreur': 'Le destinataire est obligatoire.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            destinataire = Developper.objects.get(email=email_destinataire)
        except Developper.DoesNotExist:
            return Response(
                {'erreur': 'Destinataire introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # on ne peut pas s'envoyer un message à soi-même
        if destinataire == request.user:
            return Response(
                {'erreur': 'Vous ne pouvez pas vous envoyer un message.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # vérifie que l'envoyeur n'est pas bloqué par le destinataire
        if Blocage.objects.filter(bloqueur=destinataire, bloque=request.user).exists():
            return Response(
                {'erreur': 'Vous ne pouvez pas envoyer de message à ce développeur.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(
                envoyeur=request.user,
                destinataire=destinataire,
                etat='envoye'
            )
            return Response({
                'message': 'Message envoyé.',
                'data': MessageSerializer(message).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnvoyerAudioView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email_destinataire = request.data.get('destinataire')
        if not email_destinataire:
            return Response(
                {'erreur': 'Le destinataire est obligatoire.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            destinataire = Developper.objects.get(email=email_destinataire)
        except Developper.DoesNotExist:
            return Response(
                {'erreur': 'Destinataire introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if destinataire == request.user:
            return Response(
                {'erreur': 'Vous ne pouvez pas vous envoyer un message.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AudioSerializer(data=request.data)
        if serializer.is_valid():
            audio = serializer.save(
                envoyeur=request.user,
                destinataire=destinataire,
                etat='envoye'
            )
            return Response({
                'message': 'Audio envoyé.',
                'data': AudioSerializer(audio).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EnvoyerFichierView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email_destinataire = request.data.get('destinataire')
        if not email_destinataire:
            return Response(
                {'erreur': 'Le destinataire est obligatoire.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            destinataire = Developper.objects.get(email=email_destinataire)
        except Developper.DoesNotExist:
            return Response(
                {'erreur': 'Destinataire introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if destinataire == request.user:
            return Response(
                {'erreur': 'Vous ne pouvez pas vous envoyer un message.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # crée d'abord le message vide qui contiendra le fichier
        message = Message.objects.create(
            envoyeur=request.user,
            destinataire=destinataire,
            etat='envoye',
            message_parent_id=request.data.get('message_parent', None)
        )

        serializer = FichierSerializer(data=request.data)
        if serializer.is_valid():
            fichier = serializer.save(
                message=message,
                taille=round(request.data['fichier'].size / 1024 / 1024, 2)
            )
            return Response({
                'message': 'Fichier envoyé.',
                'data': MessageSerializer(message).data
            }, status=status.HTTP_201_CREATED)

        # si le fichier est invalide on supprime le message créé
        message.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        try:
            autre_dev = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response(
                {'erreur': 'Développeur introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # récupère tous les messages entre les deux devs dans les deux sens
        messages = Message.objects.filter(
            Q(envoyeur=request.user, destinataire=autre_dev) |
            Q(envoyeur=autre_dev, destinataire=request.user)
        ).order_by('date_envoie')

        # marque les messages reçus comme lus
        messages.filter(
            destinataire=request.user,
            etat='envoye'
        ).update(etat='lu')

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListeConversationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # récupère le dernier message de chaque conversation
        from django.db.models import Max

        # trouve tous les devs avec qui on a échangé
        conversations = Message.objects.filter(
            Q(envoyeur=request.user) | Q(destinataire=request.user),
            groupe__isnull=True  # seulement les messages privés
        ).values(
            'envoyeur', 'destinataire'
        ).annotate(
            dernier_message=Max('date_envoie')
        ).order_by('-dernier_message')

        # construit la liste des conversations
        result = []
        devs_vus = set()

        for conv in conversations:
            autre_email = conv['destinataire'] if conv['envoyeur'] == request.user.email else conv['envoyeur']
            if autre_email not in devs_vus:
                devs_vus.add(autre_email)
                try:
                    autre_dev = Developper.objects.get(email=autre_email)
                    # dernier message de cette conversation
                    dernier = Message.objects.filter(
                        Q(envoyeur=request.user, destinataire=autre_dev) |
                        Q(envoyeur=autre_dev, destinataire=request.user)
                    ).order_by('-date_envoie').first()

                    # nombre de messages non lus
                    non_lus = Message.objects.filter(
                        envoyeur=autre_dev,
                        destinataire=request.user,
                        etat='envoye'
                    ).count()

                    result.append({
                        'dev': {
                            'email': autre_dev.email,
                            'pseudo': autre_dev.pseudo,
                            'photoprofil': request.build_absolute_uri(autre_dev.photoprofil.url) if autre_dev.photoprofil else None
                        },
                        'dernier_message': MessageSerializer(dernier).data,
                        'non_lus': non_lus
                    })
                except Developper.DoesNotExist:
                    pass

        return Response(result, status=status.HTTP_200_OK)

class SupprimerMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_message):
        try:
            # seul l'envoyeur peut supprimer son message
            message = Message.objects.get(
                id_message=id_message,
                envoyeur=request.user
            )
        except Message.DoesNotExist:
            return Response(
                {'erreur': 'Message introuvable ou vous n\'êtes pas l\'envoyeur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # on ne supprime pas physiquement — on marque comme supprimé
        # le contenu et les fichiers sont effacés mais le message reste
        # pour afficher "Message supprimé" côté front
        message.supprime = True
        message.contenu = None  # efface le contenu
        message.save()

        # supprime les fichiers physiques liés au message
        for fichier in message.fichiers.all():
            import os
            if fichier.fichier and os.path.isfile(fichier.fichier.path):
                os.remove(fichier.fichier.path)
            fichier.delete()

        return Response({
            'message': 'Message supprimé.',
            'id_message': str(id_message)
        }, status=status.HTTP_200_OK)


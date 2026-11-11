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

        # vérifie que l'envoyeur n'est pas bloqué par le destinataire
        if Blocage.objects.filter(bloqueur=destinataire, bloque=request.user).exists():
            return Response(
                {'erreur': 'Vous ne pouvez pas envoyer de message à ce développeur.'},
                status=status.HTTP_403_FORBIDDEN
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

        # vérifie que l'envoyeur n'est pas bloqué par le destinataire
        if Blocage.objects.filter(bloqueur=destinataire, bloque=request.user).exists():
            return Response(
                {'erreur': 'Vous ne pouvez pas envoyer de message à ce développeur.'},
                status=status.HTTP_403_FORBIDDEN
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

        # Vérifier si l'utilisateur a supprimé cette conversation
        from .models import ConversationSupprimee
        conversation_supprimee = ConversationSupprimee.objects.filter(
            dev=request.user,
            autre_dev=autre_dev
        ).first()

        # récupère tous les messages entre les deux devs dans les deux sens
        messages_query = Message.objects.filter(
            Q(envoyeur=request.user, destinataire=autre_dev) |
            Q(envoyeur=autre_dev, destinataire=request.user)
        )

        # Si la conversation a été supprimée, ne montrer que les messages après la suppression
        if conversation_supprimee:
            messages_query = messages_query.filter(
                date_envoie__gt=conversation_supprimee.date_suppression
            )

        messages = messages_query.order_by('date_envoie')

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
        from .models import ConversationSupprimee

        # Récupérer les conversations supprimées par l'utilisateur avec leur date
        conversations_supprimees_dict = {}
        for conv_supp in ConversationSupprimee.objects.filter(dev=request.user):
            conversations_supprimees_dict[conv_supp.autre_dev.email] = conv_supp.date_suppression

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
                    
                    # Vérifier si la conversation a été supprimée
                    date_suppression = conversations_supprimees_dict.get(autre_email)
                    
                    # Dernier message de cette conversation
                    dernier_query = Message.objects.filter(
                        Q(envoyeur=request.user, destinataire=autre_dev) |
                        Q(envoyeur=autre_dev, destinataire=request.user)
                    )
                    
                    # Si supprimée, ne considérer que les messages après la suppression
                    if date_suppression:
                        dernier_query = dernier_query.filter(date_envoie__gt=date_suppression)
                    
                    dernier = dernier_query.order_by('-date_envoie').first()
                    
                    # Si aucun message après suppression, ignorer cette conversation
                    if not dernier:
                        continue

                    # nombre de messages non lus (après suppression si applicable)
                    non_lus_query = Message.objects.filter(
                        envoyeur=autre_dev,
                        destinataire=request.user,
                        etat='envoye'
                    )
                    if date_suppression:
                        non_lus_query = non_lus_query.filter(date_envoie__gt=date_suppression)
                    
                    non_lus = non_lus_query.count()

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


# ─── Sessions avec l'agent IA ─────────────────────────────────────────────────

class SessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Liste toutes les sessions du dev — épinglées en premier."""
        from .models import Session
        from .serializers import SessionSerializer
        sessions = Session.objects.filter(developper=request.user)
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Crée une nouvelle session de discussion avec l'agent."""
        from .models import Session
        from .serializers import SessionSerializer
        titre = request.data.get('titre', None)
        session = Session.objects.create(
            developper=request.user,
            titre=titre
        )
        return Response({
            'message': 'Session créée.',
            'session': SessionSerializer(session).data
        }, status=status.HTTP_201_CREATED)

class DetailSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_session):
        """Voir tous les messages d'une session."""
        from .models import Session, Message
        from .serializers import SessionSerializer, MessageSerializer
        try:
            session = Session.objects.get(
                id_session=id_session,
                developper=request.user
            )
        except Session.DoesNotExist:
            return Response({'erreur': 'Session introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        messages = Message.objects.filter(
            session=session
        ).order_by('date_envoie')

        return Response({
            'session': SessionSerializer(session).data,
            'messages': MessageSerializer(messages, many=True).data
        }, status=status.HTTP_200_OK)

    def put(self, request, id_session):
        """Modifier le titre ou épingler/désépingler une session."""
        from .models import Session
        from .serializers import SessionSerializer
        try:
            session = Session.objects.get(
                id_session=id_session,
                developper=request.user
            )
        except Session.DoesNotExist:
            return Response({'erreur': 'Session introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        # modification du titre
        if 'titre' in request.data:
            session.titre = request.data['titre']

        # épinglage / désépinglage (toggle)
        if 'epingle' in request.data:
            session.epingle = request.data['epingle']

        session.save()
        return Response({
            'message': 'Session mise à jour.',
            'session': SessionSerializer(session).data
        }, status=status.HTTP_200_OK)

    def delete(self, request, id_session):
        """Supprimer une session et tous ses messages."""
        from .models import Session
        try:
            session = Session.objects.get(
                id_session=id_session,
                developper=request.user
            )
        except Session.DoesNotExist:
            return Response({'erreur': 'Session introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        session.delete()  # CASCADE supprime aussi tous les messages de la session
        return Response({'message': 'Session supprimée.'}, status=status.HTTP_200_OK)

class DiscuterAgentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_session):
        """Envoyer un message à l'agent dans une session."""
        from .models import Session
        try:
            session = Session.objects.get(
                id_session=id_session,
                developper=request.user
            )
        except Session.DoesNotExist:
            return Response({'erreur': 'Session introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        message = request.data.get('message')
        if not message:
            return Response(
                {'erreur': 'Le message est obligatoire.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # appel au service agent de session
        from Agents.services.session_service import discuter
        reponse = discuter(
            session=session,
            dev=request.user,
            message_user=message
        )

        return Response({
            'reponse': reponse
        }, status=status.HTTP_200_OK)


class SupprimerConversationView(APIView):
    """Supprimer une conversation privée (soft delete - seulement pour l'utilisateur)"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, email):
        try:
            autre_dev = Developper.objects.get(email=email)
        except Developper.DoesNotExist:
            return Response(
                {'erreur': 'Développeur introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Créer ou récupérer la marque de suppression
        from .models import ConversationSupprimee
        ConversationSupprimee.objects.get_or_create(
            dev=request.user,
            autre_dev=autre_dev
        )

        return Response({
            'message': 'Conversation supprimée.'
        }, status=status.HTTP_200_OK)

"""
Agents/views.py

Endpoints API pour l'agent d'apprentissage interactif (FloatingTutor).
Utilisé par le frontend pour les discussions contextuelles pendant les cours.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services.assistant_services import repondre_question
import logging

logger = logging.getLogger(__name__)


class ChatAgentView(APIView):
    """
    POST /api/agents/learning/chat/
    
    Endpoint unifié pour discuter avec l'agent d'apprentissage.
    Supporte les conversations contextuelles (leçon ou code).
    
    Requête :
    {
        "messages": [
            {"role": "user", "content": "Qu'est-ce qu'une variable ?"},
            {"role": "assistant", "content": "Une variable..."},
            {"role": "user", "content": "Donne un exemple"}
        ],
        "language": "fr",  # ou "en"
        "context": {  # Optionnel
            "courseTitle": "Python",
            "lessonTitle": "Les variables",
            "lessonContent": "...",
            "file": "example.py",  # Pour mode code
            "code": "x = 5",       # Pour mode code
            "language": "python"   # Pour mode code
        }
    }
    
    Réponse :
    {
        "answer": "Voici un exemple de variable en Python : ..."
    }
    """
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Extraction des données
            messages = request.data.get('messages', [])
            language = request.data.get('language', 'fr')
            context = request.data.get('context')
            
            # Validation
            if not messages:
                return Response(
                    {'error': 'Le champ "messages" est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Extraire la dernière question de l'utilisateur
            last_user_message = next(
                (msg['content'] for msg in reversed(messages) 
                 if msg.get('role') == 'user'),
                None
            )
            
            if not last_user_message:
                return Response(
                    {'error': 'Aucune question utilisateur trouvée dans les messages'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Déterminer la technologie depuis le contexte
            technologie = self._extraire_technologie(context)
            
            # Récupérer l'email du développeur authentifié
            email_dev = request.user.email if request.user.is_authenticated else ""
            
            # Appeler le service IA
            logger.info(f"Question de {email_dev} sur {technologie}: {last_user_message[:100]}")
            
            answer = repondre_question(
                question=last_user_message,
                technologie=technologie,
                niveau="I",  # Par défaut intermédiaire, sera affiné par le profil
                email_dev=email_dev
            )
            
            logger.info(f"Réponse générée ({len(answer)} caractères)")
            
            return Response(
                {'answer': answer},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Erreur dans ChatAgentView : {str(e)}", exc_info=True)
            return Response(
                {
                    'error': 'Erreur interne de l\'agent',
                    'detail': str(e) if request.user.is_staff else 'L\'agent est temporairement indisponible'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _extraire_technologie(self, context):
        """
        Extrait la technologie depuis le contexte de la leçon.
        
        Exemples :
        - "Python : Les variables" → "python"
        - "React : Hooks" → "react"
        - "Django : ORM" → "django"
        """
        if not context:
            return "python"  # Par défaut
        
        # Essayer d'extraire depuis courseTitle
        course_title = context.get('courseTitle', '').lower()
        
        # Map des technologies reconnues
        tech_map = {
            'python': 'python',
            'javascript': 'javascript',
            'js': 'javascript',
            'typescript': 'typescript',
            'ts': 'typescript',
            'react': 'react',
            'vue': 'vue',
            'vuejs': 'vue',
            'django': 'django',
            'laravel': 'laravel',
            'spring': 'spring',
            'springboot': 'spring',
            'express': 'express',
            'node': 'node',
            'nodejs': 'node',
            'c++': 'cpp',
            'cpp': 'cpp',
            'c': 'c',
            'java': 'java',
            'php': 'php',
        }
        
        # Chercher une correspondance
        for key, value in tech_map.items():
            if key in course_title:
                return value
        
        # Si mode code, essayer d'extraire depuis le langage du code
        if 'code' in context:
            lang = context.get('language', '').lower()
            if lang in tech_map:
                return tech_map[lang]
        
        return "python"  # Fallback par défaut

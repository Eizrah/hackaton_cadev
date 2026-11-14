"""API de l'assistant et de l'aide contextuelle pendant les cours."""

import logging
import re

from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


logger = logging.getLogger(__name__)

TECHNOLOGIES = {
    'react native': 'react-native',
    'jetpack compose': 'kotlin',
    'html': 'html-css',
    'css': 'html-css',
    'typescript': 'typescript',
    'ts': 'typescript',
    'javascript': 'javascript',
    'js': 'javascript',
    'node.js': 'nodejs',
    'nodejs': 'nodejs',
    'node': 'nodejs',
    'spring boot': 'spring',
    'spring': 'spring',
    'vue.js': 'vue',
    'vuejs': 'vue',
    'vue': 'vue',
    'angular': 'angular',
    'express': 'express',
    'django': 'django',
    'laravel': 'laravel',
    'python': 'python',
    'react': 'react',
    'kotlin': 'kotlin',
    'swift': 'swift',
    'flutter': 'flutter',
    'c++': 'cpp',
    'cpp': 'cpp',
    'c': 'c',
    'java': 'java',
    'php': 'php',
    'sql': 'sql',
}


class ChatMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=('user', 'assistant'))
    content = serializers.CharField(trim_whitespace=False)


class ChatContextSerializer(serializers.Serializer):
    courseId = serializers.CharField(required=False, allow_blank=True)
    courseTitle = serializers.CharField(required=False, allow_blank=True)
    lessonTitle = serializers.CharField(required=False, allow_blank=True)
    lessonContent = serializers.CharField(required=False, allow_blank=True)
    explanation = serializers.CharField(required=False, allow_blank=True)
    file = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(required=False, allow_blank=True, trim_whitespace=False)
    language = serializers.CharField(required=False, allow_blank=True)


class ChatRequestSerializer(serializers.Serializer):
    messages = ChatMessageSerializer(many=True, allow_empty=False)
    language = serializers.ChoiceField(choices=('fr', 'en'), default='fr')
    context = ChatContextSerializer(required=False, allow_null=True)


class ChatAgentView(APIView):
    """POST /api/agents/learning/chat/"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        messages = serializer.validated_data['messages']
        dernier_tour = next(
            (i for i in range(len(messages) - 1, -1, -1)
             if messages[i]['role'] == 'user' and messages[i]['content'].strip()),
            None,
        )
        if dernier_tour is None:
            return Response(
                {'error': 'Aucune question utilisateur trouvée dans les messages.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        langue = serializer.validated_data['language']
        contexte = serializer.validated_data.get('context') or {}
        question = messages[dernier_tour]['content'].strip()[:8000]
        # Les deux écrans partagent une route. Les clients existants peuvent
        # transmettre le texte de la leçon sous lessonContent ou explanation.
        texte_lecon = (contexte.get('lessonContent') or contexte.get('explanation') or '')[:4000]
        contexte_cours = None
        if contexte.get('courseTitle') or contexte.get('lessonTitle') or texte_lecon:
            contexte_cours = {
                'courseTitle': contexte.get('courseTitle', '')[:200],
                'lessonTitle': contexte.get('lessonTitle', '')[:200],
                'lessonContent': texte_lecon,
            }
        code = contexte.get('code', '')[:3000]
        if code.strip():
            fichier = contexte.get('file', '')[:200]
            question = f"Fichier : {fichier}\n\n```\n{code}\n```\n\nQuestion : {question}"

        # Les premiers tours restent dans l'historique de l'interface. Le modèle
        # reçoit les derniers échanges pour pouvoir répondre aux questions de suivi.
        historique = [
            {'role': tour['role'], 'content': tour['content'][:2000]}
            for tour in messages[max(0, dernier_tour - 12):dernier_tour]
            if tour['content'].strip()
        ]
        try:
            # Le reste de Django peut démarrer même si le fournisseur IA est indisponible.
            from .services.assistant_services import AssistantUnavailable, repondre_question
        except (ImportError, RuntimeError):
            logger.exception("Le service d'assistance Django ne peut pas être chargé.")
            return self._indisponible(langue)

        try:
            reponse = repondre_question(
                question=question,
                technologie=self._extraire_technologie(contexte),
                niveau=request.user.niveau,
                email_dev=request.user.email,
                contexte_cours=contexte_cours,
                historique=historique,
                langue=langue,
                signaler_indisponibilite=True,
            )
        except AssistantUnavailable:
            return self._indisponible(langue)
        return Response({'answer': reponse})

    @staticmethod
    def _indisponible(langue):
        message = ("The assistant is temporarily unavailable." if langue == 'en'
                   else "L'assistant est temporairement indisponible.")
        return Response({'error': message}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    @staticmethod
    def _extraire_technologie(contexte):
        langue_du_code = contexte.get('language', '').lower()
        if langue_du_code in TECHNOLOGIES:
            return TECHNOLOGIES[langue_du_code]

        # Les identifiants de cours et les mots entiers évitent de lire React
        # comme « C » ou NestJS comme une occurrence de « js ».
        titre = ' '.join((contexte.get('courseTitle', ''), contexte.get('courseId', ''))).lower()
        for terme, technologie in TECHNOLOGIES.items():
            if re.search(rf"(?<!\w){re.escape(terme)}(?!\w)", titre):
                return technologie
        return None

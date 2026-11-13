"""
Agents/urls.py

Routes API pour les agents IA.
"""

from django.urls import path
from .views import ChatAgentView

urlpatterns = [
    # Chat agent d'apprentissage (FloatingTutor)
    path('learning/chat/', ChatAgentView.as_view(), name='agent-learning-chat'),
]

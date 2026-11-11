from django.urls import path
from .views import *

urlpatterns = [
    # compétences
    path('competences/', ListeCompetencesView.as_view(), name='liste-competences'),
    path('competences/<uuid:id_competence>/', DetailCompetenceView.as_view(), name='detail-competence'),

    # apprentissages
    path('apprentissages/', ApprentissageView.as_view(), name='apprentissages'),
    path('apprentissages/<int:pk>/', DetailApprentissageView.as_view(), name='detail-apprentissage'),

    # agent assistant
    path('assistant/question/', AssistantQuestionView.as_view(), name='assistant-question'),
    path('assistant/exercice/', AssistantExerciceView.as_view(), name='assistant-exercice'),
    path('assistant/corriger/', AssistantCorrigerView.as_view(), name='assistant-corriger'),
    path('assistant/recommander/', AssistantRecommenderView.as_view(), name='assistant-recommander'),
]

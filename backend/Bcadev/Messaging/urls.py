from django.urls import path
from .views import *

urlpatterns = [
    path('conversations/', ListeConversationsView.as_view(), name='liste-conversations'),
    path('envoyer/', EnvoyerMessageView.as_view(), name='envoyer-message'),
    path('envoyer-audio/', EnvoyerAudioView.as_view(), name='envoyer-audio'),
    path('envoyer-fichier/', EnvoyerFichierView.as_view(), name='envoyer-fichier'),
    path('sessions/', SessionView.as_view(), name='sessions'),
path('sessions/<uuid:id_session>/', DetailSessionView.as_view(), name='detail-session'),
path('sessions/<uuid:id_session>/discuter/', DiscuterAgentView.as_view(), name='discuter-agent'),
    path('conversation/<str:email>/', ConversationView.as_view(), name='conversation'),
    path('<uuid:id_message>/supprimer/', SupprimerMessageView.as_view(), name='supprimer-message'),
]

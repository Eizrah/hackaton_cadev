from django.urls import path
from .views import (
    CreerGroupeView,
    ListeGroupesView,
    DetailGroupeView,
    MembreView,
    GererMembreView,
    QuitterGroupeView,
    MessagesGroupeView,
    EnvoyerAudioGroupeView,
    EnvoyerFichierGroupeView,
)

urlpatterns = [
    # gestion du groupe
    path('', ListeGroupesView.as_view(), name='liste-groupes'),
    path('creer/', CreerGroupeView.as_view(), name='creer-groupe'),
    path('<uuid:id_group>/', DetailGroupeView.as_view(), name='detail-groupe'),
    path('<uuid:id_group>/quitter/', QuitterGroupeView.as_view(), name='quitter-groupe'),

    # gestion des membres
    path('<uuid:id_group>/membres/', MembreView.as_view(), name='membres'),
    path('<uuid:id_group>/membres/<str:email>/', GererMembreView.as_view(), name='gerer-membre'),

    # messagerie de groupe
    path('<uuid:id_group>/messages/', MessagesGroupeView.as_view(), name='messages-groupe'),
    path('<uuid:id_group>/messages/audio/', EnvoyerAudioGroupeView.as_view(), name='audio-groupe'),
    path('<uuid:id_group>/messages/fichier/', EnvoyerFichierGroupeView.as_view(), name='fichier-groupe'),
]

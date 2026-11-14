from django.urls import path
from .views import (
    CreerOffreEmploiView,
    ListeOffreEmploiView,
    MesOffresView,
    DetailOffreEmploiView,
    SupprimerOffreEmploiView,
    RechercheOffreEmploiView,
    PostulerOffreView,
    MesCandidaturesView,
    RetirerMaCandidatureView,
    GererCandidaturesView
)

urlpatterns = [
    path('offres/', ListeOffreEmploiView.as_view(), name='liste-offres'),
    path('mes-offres/', MesOffresView.as_view(), name='mes-offres'),
    path('offres/creer/', CreerOffreEmploiView.as_view(), name='creer-offre'),
    path('offres/recherche/', RechercheOffreEmploiView.as_view(), name='recherche-offres'),
    path('mes-candidatures/', MesCandidaturesView.as_view(), name='mes-candidatures'),
    path('mes-candidatures/<int:id_candidature>/', RetirerMaCandidatureView.as_view(), name='retirer-ma-candidature'),
    path('offres/<uuid:id_publication>/candidatures/', GererCandidaturesView.as_view(), name='candidatures'),
    path('offres/<uuid:id_publication>/candidatures/<int:id_candidature>/', GererCandidaturesView.as_view(), name='gerer-candidature'),

    path('offres/<uuid:id_publication>/', DetailOffreEmploiView.as_view(), name='detail-offre'),
    path('offres/<uuid:id_publication>/supprimer/', SupprimerOffreEmploiView.as_view(), name='supprimer-offre'),
    path('offres/<uuid:id_publication>/postuler/', PostulerOffreView.as_view(), name='postuler-offre'),
]

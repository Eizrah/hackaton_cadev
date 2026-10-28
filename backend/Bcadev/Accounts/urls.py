from django.urls import path
from .views import *

urlpatterns = [
    path('inscription/', InscriptionView.as_view(), name='inscription'),
    path('connexion/', ConnexionView.as_view(), name='connexion'),
    path('deconnexion/', DeconnexionView.as_view(), name='deconnexion'),
    path('profil/', ProfilView.as_view(), name='profil'),
    path('supprimer-compte/', SupprimerCompteView.as_view(), name='supprimer-compte'),
    path('mot-de-passe-oublie/', MotDePasseOublieView.as_view(), name='mot-de-passe-oublie'),
    path('recherche/', RechercheDeveloppeurView.as_view(), name='recherche-devs'),
    path('bloquer/<str:email>/', BlocageView.as_view(), name='bloquer'),
    path('sourdine/', SourdineView.as_view(), name='sourdine'),

    path('reinitialisation-mot-de-passe/<str:uidb64>/<str:token>/', ReinitialisationMotDePasseView.as_view(), name='reinitialisation-mot-de-passe'),
]
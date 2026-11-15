from django.urls import path
from .views import *
from .views import OAuthTokenView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('inscription/', InscriptionView.as_view(), name='inscription'),
    path('connexion/', ConnexionView.as_view(), name='connexion'),
    path('connexion/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('deconnexion/', DeconnexionView.as_view(), name='deconnexion'),

    # URLs profil — les plus spécifiques AVANT profil/ général
    path('profil/infos/', ModifierInfosView.as_view(), name='modifier-infos'),
    path('profil/email-pseudo/', ModifierEmailPseudoView.as_view(), name='modifier-email-pseudo'),
    path('profil/mot-de-passe/', ChangerMotDePasseView.as_view(), name='changer-mot-de-passe'),
    path('profil/', ProfilView.as_view(), name='profil'),
    path('profil/membre/<str:membre>/', ProfilMembreView.as_view(), name='profil-membre'),

    path('supprimer-compte/', SupprimerCompteView.as_view(), name='supprimer-compte'),
    path('mot-de-passe-oublie/', MotDePasseOublieView.as_view(), name='mot-de-passe-oublie'),
    path('recherche/', RechercheDeveloppeurView.as_view(), name='recherche-devs'),
    path('rechercher/', RechercherDevsView.as_view(), name='rechercher-devs-simple'),

    # Notifications
    path('notifications/', MesNotifsView.as_view(), name='mes-notifications'),
    path('notifications/count/', CompterNotifsNonLuesView.as_view(), name='compter-notifications'),
    path('notifications/marquer-toutes/', MarquerToutesNotifsLuesView.as_view(), name='marquer-toutes-notifications'),
    path('notifications/<int:notif_id>/marquer/', MarquerNotifLueView.as_view(), name='marquer-notification'),
    # Anciennes routes notifications (à garder pour compatibilité)
    path('notifications/lire-tout/', LireToutesNotifsView.as_view(), name='lire-tout-notifs'),
    path('notifications/<int:id_notif>/', LireNotifView.as_view(), name='lire-notif'),
    path('notifications/<int:id_notif>/supprimer/', SupprimerNotifView.as_view(), name='supprimer-notif'),

    # OAuth & CSRF
    path('oauth/token/', OAuthTokenView.as_view(), name='oauth-token'),
    path('csrf/', CsrfView.as_view(), name='csrf'),

    # Blocage & sourdine
    path('bloquer/<str:email>/', BlocageView.as_view(), name='bloquer'),
    path('sourdine/', SourdineView.as_view(), name='sourdine'),

    path('reinitialisation-mot-de-passe/<str:uidb64>/<str:token>/', ReinitialisationMotDePasseView.as_view(), name='reinitialisation-mot-de-passe'),

    # Expériences
    path('experiences/', ExperienceListCreateView.as_view(), name='experiences-list'),
    path('experiences/<int:pk>/', ExperienceDetailView.as_view(), name='experiences-detail'),

    # Compétences du profil (possessions)
    path('competences/', PossessionListCreateView.as_view(), name='competences-list'),
    path('competences/<int:pk>/', PossessionDeleteView.as_view(), name='competences-delete'),
]

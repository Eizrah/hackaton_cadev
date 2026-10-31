from django.urls import path
from .views import *

urlpatterns = [
    path('signaler/dev/<str:email>/', SignalerDevView.as_view(), name='signaler-dev'),
    path('signaler/post/<uuid:id_publication>/', SignalerPostView.as_view(), name='signaler-post'),
    path('signaler/offre/<uuid:id_publication>/', SignalerOffreView.as_view(), name='signaler-offre'),
    path('signaler/groupe/<uuid:id_group>/', SignalerGroupeView.as_view(), name='signaler-groupe'),
]

from django.urls import path
from .views import (
    CreerForumPostView,
    ListeForumPostView,
    DetailForumPostView,
    SupprimerForumPostView,
    RechercheForumPostView,
    CommentaireView,
    NoteView,
    DetailCommentaireView
)

urlpatterns = [
    path('posts/', ListeForumPostView.as_view(), name='liste-posts'),
    path('posts/creer/', CreerForumPostView.as_view(), name='creer-post'),
    path('posts/recherche/', RechercheForumPostView.as_view(), name='recherche-posts'),  # ← avant
    path('posts/<uuid:id_publication>/', DetailForumPostView.as_view(), name='detail-post'),
    path('posts/<uuid:id_publication>/commentaires/', CommentaireView.as_view(), name='commentaires'),
path('posts/<uuid:id_publication>/commentaires/<uuid:id_commentaire>/', DetailCommentaireView.as_view(), name='detail-commentaire'),
path('posts/<uuid:id_publication>/noter/', NoteView.as_view(), name='noter'),

    path('posts/<uuid:id_publication>/supprimer/', SupprimerForumPostView.as_view(), name='supprimer-post'),
]


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Forum_post,Commentaire, Note,Enregistrement
from .serializers import ForumPostSerializer, ForumPostListSerializer, CommentaireSerializer
from django.db.models import Q
# import de Blocage pour filtrer les posts des devs bloqués
from Accounts.models import Blocage
# import de creer_notif pour créer des notifications automatiques
from Accounts.utils import creer_notif
from Jobs.models import Offre_Emploi

class CreerForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # vérifie que le dev n'est pas banni
        if request.user.banne:
            return Response(
                {'erreur': 'Votre compte est banni.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ForumPostSerializer(data=request.data)
        if serializer.is_valid():
            # on sauvegarde le post en associant le dev connecté
            # feu_vert reste False par défaut — l'IA doit valider
            post = serializer.save(developper=request.user)

            # TODO: appeler l'agent IA pour vérifier le contenu
            # si l'IA approuve → post.feu_vert = True, post.save()
            # si l'IA refuse → envoyer un email au dev + ajouter point_penalite

            return Response({
                'message': 'Post créé avec succès. En attente de validation.',
                'post': ForumPostSerializer(post).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListeForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ne retourne que les posts validés par l'IA (feu_vert=True)
        # triés du plus récent au plus ancien
        # exclut les posts des devs bloqués par le dev connecté
        devs_bloques = Blocage.objects.filter(
            bloqueur=request.user
        ).values_list('bloque', flat=True)

        posts = Forum_post.objects.filter(
            feu_vert=True
        ).exclude(
            developper__in=devs_bloques
        ).order_by('-date_publication')
        serializer = ForumPostListSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DetailForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_publication):
        try:
            # récupère le post uniquement s'il est validé
            post = Forum_post.objects.get(
                id_publication=id_publication,
                feu_vert=True
            )
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ForumPostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, id_publication):
        try:
            # seul le créateur peut modifier son post
            post = Forum_post.objects.get(
                id_publication=id_publication,
                developper=request.user
            )
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ForumPostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            # quand le post est modifié, feu_vert repasse à False
            # l'IA doit revalider le contenu modifié
            post = serializer.save(feu_vert=False)

            # TODO: rappeler l'agent IA pour revalider le contenu modifié

            return Response({
                'message': 'Post modifié avec succès. En attente de revalidation.',
                'post': ForumPostSerializer(post).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupprimerForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_publication):
        try:
            # seul le créateur du post peut le supprimer
            post = Forum_post.objects.get(
                id_publication=id_publication,
                developper=request.user
            )
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        post.delete()
        return Response(
            {'message': 'Post supprimé avec succès.'},
            status=status.HTTP_200_OK
        )

class RechercheForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # récupère le mot clé envoyé par le frontend (?q=python)
        query = request.query_params.get('q', '')

        if not query:
            return Response(
                {'erreur': 'Veuillez fournir un mot clé de recherche.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Q permet de faire un OU entre plusieurs conditions
        # icontains = contient le mot, insensible à la casse
        posts = Forum_post.objects.filter(
            Q(description__icontains=query),
            feu_vert=True
        ).order_by('-date_publication')

        serializer = ForumPostListSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class CommentaireView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, id_publication):
        # vérifie que le dev n'est pas banni
        if request.user.banne:
            return Response(
                {'erreur': 'Votre compte est banni.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            # vérifie que le post existe et est validé
            post = Forum_post.objects.get(
                id_publication=id_publication,
                feu_vert=True
            )
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommentaireSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                developper=request.user,
                forum_post=post
            )
            # notifie le créateur du post qu'il a reçu un commentaire
            # on ne notifie pas si le dev commente son propre post
            if post.developper != request.user:
                creer_notif(
                    post.developper,
                    'commentaire',
                    f'{request.user.pseudo} a commenté votre post.'
                )

            # notifie l'auteur du commentaire parent s'il y a une réponse
            commentaire_parent_id = request.data.get('commentaire_parent')
            if commentaire_parent_id:
                try:
                    parent = Commentaire.objects.get(id_commentaire=commentaire_parent_id)
                    # on ne notifie pas si le dev répond à son propre commentaire
                    if parent.developper != request.user:
                        creer_notif(
                            parent.developper,
                            'commentaire',
                            f'{request.user.pseudo} a répondu à votre commentaire.'
                        )
                except Commentaire.DoesNotExist:
                    pass

            return Response({
                'message': 'Commentaire ajouté avec succès.',
                'commentaire': serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id_publication):
        try:
            post = Forum_post.objects.get(
                id_publication=id_publication,
                feu_vert=True
            )
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # récupère tous les commentaires du post triés du plus récent au plus ancien
        commentaires = Commentaire.objects.filter(
            forum_post=post
        ).order_by('-date_commentaire')

        serializer = CommentaireSerializer(commentaires, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DetailCommentaireView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id_publication, id_commentaire):
        try:
            # seul le créateur peut modifier son commentaire
            commentaire = Commentaire.objects.get(
                id_commentaire=id_commentaire,
                forum_post__id_publication=id_publication,
                developper=request.user
            )
        except Commentaire.DoesNotExist:
            return Response(
                {'erreur': 'Commentaire introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommentaireSerializer(commentaire, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Commentaire modifié avec succès.',
                'commentaire': serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_publication, id_commentaire):
        try:
            commentaire = Commentaire.objects.get(
                id_commentaire=id_commentaire,
                forum_post__id_publication=id_publication,
                developper=request.user
            )
        except Commentaire.DoesNotExist:
            return Response(
                {'erreur': 'Commentaire introuvable ou vous n\'êtes pas le créateur.'},
                status=status.HTTP_404_NOT_FOUND
            )

        commentaire.delete()
        return Response(
            {'message': 'Commentaire supprimé avec succès.'},
            status=status.HTTP_200_OK
        )

class NoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id_publication):
        try:
            post = Forum_post.objects.get(
                id_publication=id_publication,
                feu_vert=True
            )
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # toggle — si la note existe on la supprime, sinon on la crée
        note_existante = Note.objects.filter(
            developper=request.user,
            forum_post=post
        ).first()

        if note_existante:
            # unlike — retire la note
            note_existante.delete()
            return Response({
                'message': 'Note retirée.',
                'nombre_notes': post.note_set.count()
            }, status=status.HTTP_200_OK)
        else:
            # like — ajoute la note
            Note.objects.create(
                developper=request.user,
                forum_post=post
            )
            # notifie le créateur du post qu'il a reçu un like
            # on ne notifie pas si le dev like son propre post
            if post.developper != request.user:
                creer_notif(
                    post.developper,
                    'commentaire',
                    f'{request.user.pseudo} a aimé votre post.'
                )
            return Response({
                'message': 'Note ajoutée.',
                'nombre_notes': post.note_set.count()
            }, status=status.HTTP_201_CREATED)
    




class EnregistrementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # retourne tous les enregistrements du dev connecté
        enregistrements = Enregistrement.objects.filter(dev=request.user)
        result = []
        for e in enregistrements:
            if e.forum_post:
                result.append({
                    'id': e.id,
                    'type': 'forum_post',
                    'date_enregistrement': e.date_enregistrement,
                    'publication': {
                        'id': str(e.forum_post.id_publication),
                        'description': e.forum_post.description,
                        'date': e.forum_post.date_publication,
                        'auteur': e.forum_post.developper.pseudo,
                    }
                })
            elif e.offre_emploi:
                result.append({
                    'id': e.id,
                    'type': 'offre_emploi',
                    'date_enregistrement': e.date_enregistrement,
                    'publication': {
                        'id': str(e.offre_emploi.id_publication),
                        'nom_poste': e.offre_emploi.nom_poste,
                        'localisation': e.offre_emploi.localisation,
                        'date': e.offre_emploi.date_publication,
                        'auteur': e.offre_emploi.developper.pseudo,
                    }
                })
        return Response(result, status=status.HTTP_200_OK)

    def post(self, request):
        # enregistrer un post ou une offre
        type_pub = request.data.get('type_publication')
        id_pub = request.data.get('id_publication')

        if not type_pub or not id_pub:
            return Response(
                {'erreur': 'type_publication et id_publication sont obligatoires.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if type_pub == 'forum_post':
            try:
                post = Forum_post.objects.get(id_publication=id_pub, feu_vert=True)
            except Forum_post.DoesNotExist:
                return Response({'erreur': 'Post introuvable.'}, status=status.HTTP_404_NOT_FOUND)

            if Enregistrement.objects.filter(dev=request.user, forum_post=post).exists():
                return Response({'erreur': 'Publication déjà enregistrée.'}, status=status.HTTP_400_BAD_REQUEST)

            Enregistrement.objects.create(
                dev=request.user,
                forum_post=post,
                type_publication='forum_post'
            )

        elif type_pub == 'offre_emploi':
            try:
                offre = Offre_Emploi.objects.get(id_publication=id_pub, feu_vert=True)
            except Offre_Emploi.DoesNotExist:
                return Response({'erreur': 'Offre introuvable.'}, status=status.HTTP_404_NOT_FOUND)

            if Enregistrement.objects.filter(dev=request.user, offre_emploi=offre).exists():
                return Response({'erreur': 'Publication déjà enregistrée.'}, status=status.HTTP_400_BAD_REQUEST)

            Enregistrement.objects.create(
                dev=request.user,
                offre_emploi=offre,
                type_publication='offre_emploi'
            )
        else:
            return Response(
                {'erreur': 'type_publication invalide. Utilisez "forum_post" ou "offre_emploi".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({'message': 'Publication enregistrée.'}, status=status.HTTP_201_CREATED)

class SupprimerEnregistrementView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id_enregistrement):
        try:
            enregistrement = Enregistrement.objects.get(
                id=id_enregistrement,
                dev=request.user
            )
        except Enregistrement.DoesNotExist:
            return Response({'erreur': 'Enregistrement introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        enregistrement.delete()
        return Response({'message': 'Enregistrement supprimé.'}, status=status.HTTP_200_OK)
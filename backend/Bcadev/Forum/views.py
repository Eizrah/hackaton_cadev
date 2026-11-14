from uuid import UUID
from django.db import transaction
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


def verifier_publication(description, lien, auteur):
    try:
        from Agents.services.verification_services import verifier_post
        return verifier_post(description=description, lien=lien, email_auteur=auteur.email)
    except Exception:
        # Garde la publication disponible si le service de vérification est absent.
        return {'approuve': True}


class CreerForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # vérifie que le dev n'est pas banni
        if request.user.banne:
            return Response(
                {'erreur': 'Votre compte est banni.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ForumPostSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        resultat = verifier_publication(
            description=serializer.validated_data['description'],
            lien=serializer.validated_data.get('lien'),
            auteur=request.user,
        )

        with transaction.atomic():
            # Enregistre le verdict avant que le post puisse apparaître dans le fil.
            post = serializer.save(developper=request.user, feu_vert=resultat['approuve'])
            if not post.feu_vert:
                raison = resultat.get('raison') or "Contenu non conforme aux règles de la plateforme."
                creer_notif(
                    request.user, 'post_refuse',
                    f'Votre post a été refusé : {raison}',
                    post_id=post.id_publication,
                )
                # Le brouillon refusé est conservé pour que son auteur puisse le modifier.
                return Response({
                    'message': 'Votre post a été refusé par l\'IA. Vous pouvez le modifier.',
                    'raison': raison,
                    'feu_vert': False,
                    'post': serializer.data,
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'Post créé et publié avec succès.',
            'post': serializer.data,
        }, status=status.HTTP_201_CREATED)

class ListeForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"[FORUM_LIST] Requête GET par {request.user.email}")
        
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
        
        logger.info(f"[FORUM_LIST] Nombre de posts trouvés : {posts.count()}")
        
        serializer = ForumPostListSerializer(posts, many=True, context={'request': request})
        
        logger.info(f"[FORUM_LIST] Données sérialisées : {len(serializer.data)} posts")
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class MesForumPostsView(APIView):
    """Retourne tous les posts du dev connecté (validés ou non)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Forum_post.objects.filter(
            developper=request.user
        ).order_by('-date_publication')
        
        serializer = ForumPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class DetailForumPostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_publication):
        try:
            # Le lien depuis une notification de refus reste accessible à son auteur.
            post = Forum_post.objects.filter(
                Q(feu_vert=True) | Q(developper=request.user)
            ).get(id_publication=id_publication)
        except Forum_post.DoesNotExist:
            return Response(
                {'erreur': 'Post introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ForumPostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, id_publication):
        """Modifier un post (propriétaire uniquement)"""
        try:
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
            # Vérifie la modification avant de changer sa visibilité dans le fil.
            resultat = verifier_publication(
                description=serializer.validated_data.get('description', post.description),
                lien=serializer.validated_data.get('lien', post.lien),
                auteur=request.user,
            )

            with transaction.atomic():
                post = serializer.save(feu_vert=resultat['approuve'])
                if not post.feu_vert:
                    raison = resultat.get('raison') or 'Contenu non conforme.'
                    creer_notif(
                        request.user,
                        'post_refuse',
                        f'Votre post modifié a été refusé : {raison}',
                        post_id=post.id_publication,
                    )

            return Response({
                'message': 'Post modifié avec succès.',
                'post': ForumPostSerializer(post, context={'request': request}).data,
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id_publication):
        """Supprimer un post (propriétaire uniquement)"""
        try:
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
        return Response({
            'message': 'Post supprimé avec succès.'
        }, status=status.HTTP_200_OK)


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

        serializer = ForumPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)



class CommentaireView(APIView):
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
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

        # ── vérification IA du commentaire ────────────────────────────────────
        from Agents.services.verification_services import verifier_commentaire
        
        commentaire_texte = request.data.get('commentaire', '')
        if not commentaire_texte or not commentaire_texte.strip():
            return Response(
                {'erreur': 'Le commentaire ne peut pas être vide.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # appelle l'agent de vérification
        resultat_verification = verifier_commentaire(commentaire=commentaire_texte.strip())
        
        if not resultat_verification.get('approuve', False):
            # si l'agent refuse, on retourne le refus au frontend
            raison = resultat_verification.get('raison', 'Commentaire non conforme aux règles.')
            return Response(
                {
                    'erreur': 'Commentaire refusé par la modération.',
                    'raison': raison
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # ── fin vérification ───────────────────────────────────────────────────

        serializer = CommentaireSerializer(data=request.data)
        if serializer.is_valid():
            commentaire = serializer.save(
                developper=request.user,
                forum_post=post
            )
            # Les notifications pointent vers le nouveau commentaire dans le fil.
            parent = commentaire.commentaire_parent
            if post.developper_id != request.user.pk and (not parent or parent.developper_id != post.developper_id):
                creer_notif(
                    post.developper, 'commentaire',
                    f'{request.user.pseudo} a commenté votre post.',
                    post_id=post.pk, commentaire_id=commentaire.pk, envoyeur=request.user,
                )
            if parent and parent.developper_id != request.user.pk:
                creer_notif(
                    parent.developper, 'reponse_commentaire',
                    f'{request.user.pseudo} a répondu à votre commentaire.',
                    post_id=post.pk, commentaire_id=commentaire.pk, envoyeur=request.user,
                )

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
        ).select_related('developper', 'commentaire_parent__developper').order_by('-date_commentaire')

        serializer = CommentaireSerializer(commentaires, many=True, context={'request': request})
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

        # ── vérification IA si le commentaire est modifié ──────────────────────
        nouveau_commentaire = request.data.get('commentaire')
        if nouveau_commentaire and nouveau_commentaire.strip():
            from Agents.services.verification_services import verifier_commentaire
            
            resultat_verification = verifier_commentaire(commentaire=nouveau_commentaire.strip())
            
            if not resultat_verification.get('approuve', False):
                raison = resultat_verification.get('raison', 'Commentaire non conforme aux règles.')
                return Response(
                    {
                        'erreur': 'Modification refusée par la modération.',
                        'raison': raison
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
        # ── fin vérification ───────────────────────────────────────────────────

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
                    'like',
                    f'{request.user.pseudo} a aimé votre post.',
                    post_id=post.id_publication,
                    envoyeur=request.user
                )
            return Response({
                'message': 'Note ajoutée.',
                'nombre_notes': post.note_set.count()
            }, status=status.HTTP_201_CREATED)
    




class EnregistrementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # retourne tous les enregistrements du dev connecté
        enregistrements = Enregistrement.objects.filter(dev=request.user).select_related(
            'forum_post__developper', 'offre_emploi__developper',
        ).order_by('-date_enregistrement', '-pk')
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

        try:
            id_pub = UUID(str(id_pub))
        except ValueError:
            return Response({'erreur': 'Identifiant de publication invalide.'}, status=status.HTTP_400_BAD_REQUEST)

        if type_pub == 'forum_post':
            try:
                post = Forum_post.objects.get(id_publication=id_pub, feu_vert=True)
            except Forum_post.DoesNotExist:
                return Response({'erreur': 'Post introuvable.'}, status=status.HTTP_404_NOT_FOUND)

            enregistrement, cree = Enregistrement.objects.get_or_create(
                dev=request.user, forum_post=post, defaults={'type_publication': 'forum_post'},
            )

        elif type_pub == 'offre_emploi':
            try:
                offre = Offre_Emploi.objects.get(id_publication=id_pub, feu_vert=True)
            except Offre_Emploi.DoesNotExist:
                return Response({'erreur': 'Offre introuvable.'}, status=status.HTTP_404_NOT_FOUND)

            enregistrement, cree = Enregistrement.objects.get_or_create(
                dev=request.user, offre_emploi=offre, defaults={'type_publication': 'offre_emploi'},
            )
        else:
            return Response(
                {'erreur': 'type_publication invalide. Utilisez "forum_post" ou "offre_emploi".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Le front retire ensuite le signet par cet identifiant, y compris après un nouvel essai.
        return Response(
            {'message': 'Publication enregistrée.', 'id': enregistrement.pk},
            status=status.HTTP_201_CREATED if cree else status.HTTP_200_OK,
        )

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

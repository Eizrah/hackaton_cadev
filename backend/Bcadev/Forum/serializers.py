from rest_framework import serializers
from .models import Forum_post, Commentaire
from fonction_utils.gestion_fichier import valider_fichier

class ForumPostSerializer(serializers.ModelSerializer):
    # on affiche l'email et le pseudo du dev au lieu de juste la clé étrangère
    developper_email = serializers.EmailField(source='developper.email', read_only=True)
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    developper_pays = serializers.CharField(source='developper.pays', read_only=True)
    liked_by_me = serializers.SerializerMethodField()
    # nombre de notes calculé dynamiquement
    nombre_notes = serializers.SerializerMethodField()
    nombre_commentaires = serializers.IntegerField(source='commentaire_set.count', read_only=True)

    class Meta:
        model = Forum_post
        fields = [
            'id_publication', 'description', 'fichier', 'lien', 'collaboration',
            'date_publication', 'feu_vert', 'point_penalite_obtenu',
            'developper_email', 'developper_pseudo', 'developper_pays',
            'nombre_notes', 'nombre_commentaires', 'liked_by_me'
        ]
        # ces champs sont gérés automatiquement par le système
        read_only_fields = [
            'id_publication', 'date_publication',
            'feu_vert', 'point_penalite_obtenu',
            'developper_email', 'developper_pseudo', 'nombre_notes'
        ]

    def get_nombre_notes(self, obj):
        # compte le nombre de lignes dans la table Note pour ce post
        return obj.note_set.count()

    def get_liked_by_me(self, obj):
        request = self.context.get('request')
        return bool(request and request.user.is_authenticated and obj.note_set.filter(developper=request.user).exists())

    def validate_fichier(self, value):
        if value:
            valider_fichier(value)
        return value

class ForumPostListSerializer(serializers.ModelSerializer):
    # serializer allégé pour la liste — moins de champs pour ne pas surcharger
    developper_email = serializers.EmailField(source='developper.email', read_only=True)
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    developper_pays = serializers.CharField(source='developper.pays', read_only=True)
    nombre_notes = serializers.SerializerMethodField()
    nombre_commentaires = serializers.IntegerField(source='commentaire_set.count', read_only=True)
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Forum_post
        fields = [
            'id_publication', 'description', 'date_publication',
            'feu_vert', 'lien', 'fichier', 'collaboration',
            'developper_email', 'developper_pseudo', 'developper_pays',
            'nombre_notes', 'nombre_commentaires', 'liked_by_me'
        ]

    def get_nombre_notes(self, obj):
        return obj.note_set.count()
    
    def get_liked_by_me(self, obj):
        # vérifie si le dev connecté a liké ce post
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.note_set.filter(developper=request.user).exists()
        return False

class CommentaireSerializer(serializers.ModelSerializer):
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    developper_pays = serializers.CharField(source='developper.pays', read_only=True)
    developper_email = serializers.EmailField(source='developper_id', read_only=True)
    developper_photo = serializers.ImageField(source='developper.photoprofil', read_only=True)
    commentaire = serializers.CharField(max_length=1500)
    commentaire_parent_contenu = serializers.SerializerMethodField()
    class Meta:
        model = Commentaire
        fields = [
            'id_commentaire', 'commentaire', 'date_commentaire',
            'point_penalite_obtenu', 'developper_pseudo', 'developper_pays',
            'developper_email', 'developper_photo', 'commentaire_parent', 'commentaire_parent_contenu'
        ]
        read_only_fields = [
            'id_commentaire', 'date_commentaire',
            'point_penalite_obtenu', 'developper_pseudo',
            'commentaire_parent_contenu'
        ]
    def validate_commentaire_parent(self, parent):
        # Un commentaire parent doit appartenir à la publication ouverte.
        if parent and parent.forum_post_id != self.context['post_id']:
            raise serializers.ValidationError('Ce commentaire appartient à une autre publication.')
        if self.instance and parent != self.instance.commentaire_parent:
            raise serializers.ValidationError('Le commentaire parent ne peut pas être modifié.')
        return parent

    def get_commentaire_parent_contenu(self, obj):
        if obj.commentaire_parent:
            return {
                'id': str(obj.commentaire_parent.id_commentaire),
                'commentaire': obj.commentaire_parent.commentaire,
                'auteur': obj.commentaire_parent.developper.pseudo
            }
        return None



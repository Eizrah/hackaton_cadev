from rest_framework import serializers
from .models import Forum_post, Commentaire
from fonction_utils.gestion_fichier import valider_fichier

class ForumPostSerializer(serializers.ModelSerializer):
    # on affiche l'email et le pseudo du dev au lieu de juste la clé étrangère
    developper_email = serializers.EmailField(source='developper.email', read_only=True)
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    # nombre de notes calculé dynamiquement
    nombre_notes = serializers.SerializerMethodField()

    class Meta:
        model = Forum_post
        fields = [
            
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

    def validate_fichier(self, value):
        if value:
            valider_fichier(value)
        return value

class ForumPostListSerializer(serializers.ModelSerializer):
    # serializer allégé pour la liste — moins de champs pour ne pas surcharger
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    nombre_notes = serializers.SerializerMethodField()

    class Meta:
        model = Forum_post
        fields = [
            'id_publication', 'description', 'date_publication',
            'developper_pseudo', 'nombre_notes'
        ]

    def get_nombre_notes(self, obj):
        return obj.note_set.count()

class CommentaireSerializer(serializers.ModelSerializer):
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)

    class Meta:
        model = Commentaire
        fields = [
            'id_commentaire', 'commentaire', 'date_commentaire',
            'point_penalite_obtenu', 'developper_pseudo'
        ]
        read_only_fields = [
            'id_commentaire', 'date_commentaire',
            'point_penalite_obtenu', 'developper_pseudo'
        ]



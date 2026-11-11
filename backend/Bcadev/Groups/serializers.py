from rest_framework import serializers
from .models import Group, Membre
from fonction_utils.gestion_fichier import valider_image

class GroupSerializer(serializers.ModelSerializer):
    # nombre de membres calculé dynamiquement
    nombre_membres = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            'id_group', 'nom', 'motif_creation', 'photo',
            'date_creation', 'actif', 'point_penalite',
            'motif_suppression', 'date_suppression', 'nombre_membres'
        ]
        read_only_fields = [
            'id_group', 'date_creation', 'actif',
            'point_penalite', 'motif_suppression',
            'date_suppression', 'nombre_membres'
        ]

    def get_nombre_membres(self, obj):
        return obj.membre_set.count()

    def validate_photo(self, value):
        if value:
            valider_image(value)
        return value

class GroupListSerializer(serializers.ModelSerializer):
    # version allégée pour la liste
    nombre_membres = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            'id_group', 'nom', 'photo',
            'date_creation', 'nombre_membres'
        ]

    def get_nombre_membres(self, obj):
        return obj.membre_set.count()

class MembreSerializer(serializers.ModelSerializer):
    # infos du dev membre
    dev_email = serializers.EmailField(source='id_personne.email', read_only=True)
    dev_pseudo = serializers.CharField(source='id_personne.pseudo', read_only=True)
    dev_photo = serializers.ImageField(source='id_personne.photoprofil', read_only=True)

    class Meta:
        model = Membre
        fields = [
            'id', 'dev_email', 'dev_pseudo', 'dev_photo',
            'type', 'date_adhesion'
        ]
        read_only_fields = [
            'id', 'dev_email', 'dev_pseudo',
            'dev_photo', 'date_adhesion'
        ]

from rest_framework import serializers
from .models import Group, Membre, InvitationGroupe
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
    
    def to_representation(self, instance):
        """Convertir la photo en URL absolue pour la lecture"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if data.get('photo') and request:
            data['photo'] = request.build_absolute_uri(instance.photo.url)
        elif data.get('photo'):
            data['photo'] = instance.photo.url
        return data

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
    
    def to_representation(self, instance):
        """Convertir la photo en URL absolue pour la lecture"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if data.get('photo') and request:
            data['photo'] = request.build_absolute_uri(instance.photo.url)
        elif data.get('photo'):
            data['photo'] = instance.photo.url
        return data

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


class InvitationSerializer(serializers.ModelSerializer):
    # Informations du groupe
    groupe_nom = serializers.CharField(source='groupe.nom', read_only=True)
    
    # Informations de l'inviteur
    inviteur_pseudo = serializers.CharField(source='inviteur.pseudo', read_only=True)
    inviteur_email = serializers.EmailField(source='inviteur.email', read_only=True)
    
    # Informations de l'invité
    invite_pseudo = serializers.CharField(source='invite.pseudo', read_only=True)
    invite_email = serializers.EmailField(source='invite.email', read_only=True)

    class Meta:
        model = InvitationGroupe
        fields = [
            'id_invitation', 'groupe', 'groupe_nom', 'groupe_photo',
            'inviteur', 'inviteur_pseudo', 'inviteur_email',
            'invite', 'invite_pseudo', 'invite_email',
            'statut', 'date_invitation', 'date_reponse'
        ]
        read_only_fields = [
            'id_invitation', 'groupe_nom', 'groupe_photo',
            'inviteur_pseudo', 'inviteur_email',
            'invite_pseudo', 'invite_email',
            'date_invitation', 'date_reponse'
        ]
    
    def to_representation(self, instance):
        """Convertir la photo du groupe en URL absolue"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.groupe.photo:
            if request:
                data['groupe_photo'] = request.build_absolute_uri(instance.groupe.photo.url)
            else:
                data['groupe_photo'] = instance.groupe.photo.url
        else:
            data['groupe_photo'] = None
        return data

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Developper,Experience

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Experience
        fields = ['nom_poste', 'description', 'nbr_annee_exp', 'diplome', 'certificat']

class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    experiences = ExperienceSerializer(many=True, required=False)

    class Meta:
        model = Developper
        fields = [
            'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'password', 'password_confirm',
            'photoprofil', 'experiences'
        ]
       
         

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def validate_email(self, value):
        if Developper.objects.filter(email=value).exists():
            raise serializers.ValidationError("Un compte existe déjà avec cet email.")
        return value
    
    def validate_photoprofil(self, value):
        if value:
            from fonction_utils.gestion_fichier import valider_image
            valider_image(value)
        return value


    def create(self, validated_data):
        experiences_data = validated_data.pop('experiences', [])
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        dev = Developper(**validated_data)
        dev.set_password(password)  # hashage du mot de passe
        dev.save()
        # on crée chaque expérience et on la lie au dev
        for experience in experiences_data:
            Experience.objects.create(developper=dev, **experience)
        return dev


class ConnexionSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        dev = authenticate(email=data['email'], password=data['password'])
        if not dev:
            raise serializers.ValidationError("Email ou mot de passe incorrect.")
        if dev.banne:
            raise serializers.ValidationError("Ce compte est banni.")
        data['dev'] = dev
        return data

class DevelopperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developper
        fields = [
            'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'photoprofil',
            'lien_portfolio', 'lien_github', 'point_penalite'
        ]
        read_only_fields = ['email', 'point_penalite']

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Developper, Experience, Possession
from fonction_utils.gestion_fichier import valider_image, valider_fichier, valider_diplome_certificat


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'nom_poste', 'description', 'nbr_annee_exp',
            'diplome', 'certificat',
            # champs fichiers — optionnels
            'fichier_diplome', 'fichier_certificat'
        ]

    def validate_fichier_diplome(self, value):
        if value:
            valider_diplome_certificat(value)
        return value

    def validate_fichier_certificat(self, value):
        if value:
            valider_diplome_certificat(value)
        return value


class PossessionSerializer(serializers.ModelSerializer):
    # affiche le nom et le domaine de la compétence
    competence_nom = serializers.CharField(source='competence.nom_competence', read_only=True)
    competence_domaine = serializers.CharField(source='competence.domaine', read_only=True)
    competence_difficulte = serializers.CharField(source='competence.difficulte', read_only=True)

    class Meta:
        model = Possession
        fields = ['competence', 'competence_nom', 'competence_domaine', 'competence_difficulte', 'date_ajout']
        read_only_fields = ['competence_nom', 'competence_domaine', 'competence_difficulte', 'date_ajout']


class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    # expériences optionnelles à l'inscription
    experiences = ExperienceSerializer(many=True, required=False)
    # compétences déjà possédées — optionnelles
    # on passe juste les ids des compétences
    competences = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Developper
        fields = [
            'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'password', 'password_confirm',
            'photoprofil', 'experiences', 'competences'
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
            valider_image(value)
        return value

    def validate_competences(self, value):
        # vérifie que toutes les compétences existent
        from Learning.models import Competence
        for id_competence in value:
            if not Competence.objects.filter(id_competence=id_competence).exists():
                raise serializers.ValidationError(f'Compétence {id_competence} introuvable.')
        return value

    def create(self, validated_data):
        experiences_data = validated_data.pop('experiences', [])
        competences_ids = validated_data.pop('competences', [])
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        dev = Developper(**validated_data)
        dev.set_password(password)
        dev.save()

        # crée les expériences liées au dev
        for experience in experiences_data:
            Experience.objects.create(developper=dev, **experience)

        # crée les possessions de compétences
        from Learning.models import Competence
        for id_competence in competences_ids:
            competence = Competence.objects.get(id_competence=id_competence)
            Possession.objects.create(developper=dev, competence=competence)

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
    # affiche les possessions du dev dans son profil
    possessions = PossessionSerializer(many=True, read_only=True)

    class Meta:
        model = Developper
        fields = [
            'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'photoprofil',
            'lien_portfolio', 'lien_github', 'point_penalite',
            'possessions'
        ]
        read_only_fields = ['email', 'point_penalite', 'possessions']

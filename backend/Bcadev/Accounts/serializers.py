import re

from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models.functions import Lower
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from Learning.models import Competence
from fonction_utils.gestion_fichier import valider_image, valider_diplome_certificat
from .models import Developper, Experience, Possession, Notif


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


class NomsCompetencesField(serializers.JSONField):
    def to_internal_value(self, data):
        # Le même champ fonctionne en JSON et lors d'un envoi multipart avec photo.
        noms = super().to_internal_value(data)
        return serializers.ListField(child=serializers.CharField(max_length=100)).run_validation(noms)


def enregistrer_competences(dev, noms):
    # Les compétences connues gardent leur lien vers le catalogue de cours.
    noms_par_cle = {nom.lower(): nom for nom in noms}
    catalogue = {}
    competences = Competence.objects.annotate(nom_minuscule=Lower('nom_competence'))
    for competence in competences.filter(nom_minuscule__in=noms_par_cle).order_by('pk'):
        catalogue.setdefault(competence.nom_minuscule, competence.pk)

    ids = set(catalogue.values())
    dev.possessions.exclude(competence_id__in=ids).delete()
    for identifiant in ids:
        dev.possessions.get_or_create(competence_id=identifiant)
    dev.competences_personnalisees = [nom for cle, nom in noms_par_cle.items() if cle not in catalogue]
    dev.save(update_fields=['competences_personnalisees'])


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

    noms_competences = NomsCompetencesField(required=False, write_only=True)

    class Meta:
        model = Developper
        fields = [
            'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'password', 'password_confirm',
            'photoprofil', 'experiences', 'competences', 'noms_competences'
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
        for id_competence in value:
            if not Competence.objects.filter(id_competence=id_competence).exists():
                raise serializers.ValidationError(f'Compétence {id_competence} introuvable.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        experiences_data = validated_data.pop('experiences', [])
        competences_ids = validated_data.pop('competences', [])
        noms_competences = validated_data.pop('noms_competences', None)
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        dev = Developper(**validated_data)
        dev.set_password(password)
        dev.save()

        # crée les expériences liées au dev
        for experience in experiences_data:
            Experience.objects.create(developper=dev, **experience)

        # crée les possessions de compétences
        if noms_competences is not None:
            enregistrer_competences(dev, noms_competences)
        for id_competence in set(competences_ids):
            dev.possessions.get_or_create(competence_id=id_competence)

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
    possessions = PossessionSerializer(many=True, read_only=True)

    class Meta:
        model = Developper
        fields = [
            'identifiant', 'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'photoprofil',
            'lien_portfolio', 'lien_github', 'point_penalite', 'presentation',
            'possessions', 'competences_personnalisees',
        ]
        read_only_fields = [
            'identifiant', 'email', 'pseudo', 'point_penalite', 'possessions', 'competences_personnalisees',
        ]


class ProfilInfosSerializer(DevelopperSerializer):
    noms_competences = NomsCompetencesField(required=False, write_only=True)

    class Meta(DevelopperSerializer.Meta):
        fields = [*DevelopperSerializer.Meta.fields, 'noms_competences']

    def validate_photoprofil(self, value):
        if value:
            valider_image(value)
        return value

    @transaction.atomic
    def update(self, instance, validated_data):
        # Évite qu'une sauvegarde du profil écrase un changement d'identifiants simultané.
        instance = Developper.objects.select_for_update().get(identifiant=instance.identifiant)
        noms = validated_data.pop('noms_competences', None)
        instance = super().update(instance, validated_data)
        if noms is not None:
            enregistrer_competences(instance, noms)
        return instance


class ProfilMembreSerializer(DevelopperSerializer):
    class Meta(DevelopperSerializer.Meta):
        # Champs de la fiche visible par les membres, avec l'adresse utilisée par la messagerie.
        fields = [
            'identifiant', 'email', 'nom', 'prenom', 'pseudo', 'niveau', 'pays',
            'photoprofil', 'lien_portfolio', 'lien_github', 'presentation',
            'possessions', 'competences_personnalisees',
        ]


class ModifierIdentifiantsSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    pseudo = serializers.CharField(required=False, max_length=50)
    mot_de_passe = serializers.CharField(trim_whitespace=False, write_only=True)

    def validate_pseudo(self, value):
        if not re.fullmatch(r'[A-Za-z0-9]{3,30}', value):
            raise serializers.ValidationError('Le pseudo doit contenir 3 à 30 lettres ou chiffres.')
        return value


class RafraichirConnexionSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        # Les jetons générés avant l'identifiant stable nécessitent une nouvelle connexion.
        if not self.token_class(attrs['refresh']).get('user_id'):
            raise InvalidToken('Veuillez vous reconnecter.')
        try:
            return super().validate(attrs)
        except Developper.DoesNotExist as exc:
            raise InvalidToken('Compte introuvable.') from exc


class NotifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notif
        fields = ['id', 'type', 'message', 'lu', 'date', 'post_id', 'commentaire_id', 'offre_id', 'groupe_id']
        read_only_fields = ['id', 'date']

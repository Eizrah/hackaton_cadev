from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Developper, Experience, Possession, Notif
from fonction_utils.gestion_fichier import valider_image, valider_fichier, valider_diplome_certificat


class ExperienceSerializer(serializers.ModelSerializer):
    # URLs absolues pour accéder aux fichiers depuis le frontend
    fichier_diplome_url = serializers.SerializerMethodField()
    fichier_certificat_url = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            'id',
            'nom_poste', 'description', 'nbr_annee_exp',
            'diplome', 'certificat',
            'fichier_diplome', 'fichier_certificat',
            'fichier_diplome_url', 'fichier_certificat_url',
        ]
        read_only_fields = ['id', 'fichier_diplome_url', 'fichier_certificat_url']

    def _build_url(self, request, file_field):
        """Retourne l'URL absolue d'un fichier ou None."""
        if not file_field:
            return None
        if request:
            return request.build_absolute_uri(file_field.url)
        # fallback sans request (rare)
        from django.conf import settings
        return f"{settings.MEDIA_URL}{file_field.name}"

    def get_fichier_diplome_url(self, obj):
        request = self.context.get('request')
        return self._build_url(request, obj.fichier_diplome)

    def get_fichier_certificat_url(self, obj):
        request = self.context.get('request')
        return self._build_url(request, obj.fichier_certificat)

    def validate_fichier_diplome(self, value):
        if value:
            valider_diplome_certificat(value)
        return value

    def validate_fichier_certificat(self, value):
        if value:
            valider_diplome_certificat(value)
        return value


class PossessionSerializer(serializers.ModelSerializer):
    """Lecture : retourne les détails de la compétence."""
    competence_nom = serializers.CharField(source='competence.nom_competence', read_only=True)
    competence_domaine = serializers.CharField(source='competence.domaine', read_only=True)
    competence_difficulte = serializers.CharField(source='competence.difficulte', read_only=True)

    class Meta:
        model = Possession
        fields = [
            'id',
            'competence', 'competence_nom', 'competence_domaine',
            'competence_difficulte', 'date_ajout'
        ]
        read_only_fields = [
            'id', 'competence_nom', 'competence_domaine',
            'competence_difficulte', 'date_ajout'
        ]


class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    # compétences déjà possédées à l'inscription — liste d'UUIDs
    # les expériences avec fichiers se gèrent APRÈS via POST /accounts/experiences/
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
            'photoprofil', 'competences'
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
        from Learning.models import Competence
        for id_competence in value:
            if not Competence.objects.filter(id_competence=id_competence).exists():
                raise serializers.ValidationError(f'Compétence {id_competence} introuvable.')
        return value

    def create(self, validated_data):
        competences_ids = validated_data.pop('competences', [])
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        dev = Developper(**validated_data)
        dev.set_password(password)
        dev.save()

        # crée les possessions de compétences sélectionnées à l'inscription
        from Learning.models import Competence
        for id_competence in competences_ids:
            competence = Competence.objects.get(id_competence=id_competence)
            Possession.objects.create(developper=dev, competence=competence)

        return dev


class ConnexionSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from .models import Developper as Dev
        try:
            dev = Dev.objects.get(email=data['email'])
        except Dev.DoesNotExist:
            raise serializers.ValidationError("Email ou mot de passe incorrect.")
        if not dev.check_password(data['password']):
            raise serializers.ValidationError("Email ou mot de passe incorrect.")
        if dev.banne:
            raise serializers.ValidationError("Ce compte est banni.")
        data['dev'] = dev
        return data


class DevelopperSerializer(serializers.ModelSerializer):
    # affiche les possessions du dev dans son profil
    possessions = PossessionSerializer(many=True, read_only=True)
    # affiche les expériences du dev dans son profil (avec URLs fichiers)
    experiences = serializers.SerializerMethodField()

    def get_experiences(self, obj):
        """Passe le request au contexte pour générer les URLs absolues."""
        serializer = ExperienceSerializer(
            obj.experiences.all(),
            many=True,
            context=self.context,   # propage request
        )
        return serializer.data

    class Meta:
        model = Developper
        fields = [
            'email', 'nom', 'prenom', 'pseudo', 'age',
            'niveau', 'pays', 'sexe', 'photoprofil',
            'lien_portfolio', 'lien_github', 'point_penalite',
            'presentation', 'possessions', 'experiences'
        ]
        read_only_fields = ['email', 'point_penalite', 'possessions', 'experiences']


class NotifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notif
        fields = ['id', 'type', 'message', 'lu', 'date', 'post_id', 'commentaire_id', 'offre_id', 'groupe_id']
        read_only_fields = ['id', 'date']

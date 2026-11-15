from rest_framework import serializers
from .models import Offre_Emploi, Candidature
from fonction_utils.gestion_fichier import valider_fichier


class OffreEmploiSerializer(serializers.ModelSerializer):
    developper_email = serializers.EmailField(source='developper.email', read_only=True)
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    ma_candidature = serializers.SerializerMethodField()

    class Meta:
        model = Offre_Emploi
        fields = [
            'id_publication', 'description', 'fichier', 'lien',
            'date_publication', 'feu_vert', 'point_penalite_obtenu',
            'developper_email', 'developper_pseudo', 'localisation',
            'type_contrat', 'duree', 'nom_poste', 'competence_requise',
            'type_travail', 'deadline', 'email', 'ma_candidature'
        ]
        read_only_fields = [
            'id_publication', 'date_publication',
            'feu_vert', 'point_penalite_obtenu',
            'developper_email', 'developper_pseudo', 'ma_candidature',
        ]

    def get_ma_candidature(self, obj):
        """Retourne l'état de la candidature de l'utilisateur actuel, si elle existe"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        candidature = Candidature.objects.filter(
            offre_emploi=obj,
            developpeur=request.user
        ).first()
        
        if candidature:
            return {
                'id': candidature.id,
                'etat': candidature.etat,
                'date_postule': candidature.date_postule
            }
        return None

    def validate_fichier(self, value):
        if value:
            valider_fichier(value)
        return value
    
    def validate_duree(self, value):
        if value is not None:
            if value <= 0:
                raise serializers.ValidationError(
                    'La durée doit être supérieure à 0 mois.'
                )
            if value > 60:  # max 5 ans
                raise serializers.ValidationError(
                    'La durée ne peut pas dépasser 60 mois.'
                )
        return value

    def validate(self, data):
        # duree est obligatoire si le type de contrat est CDD ou Stage
        if data.get('type_contrat') in ['CDD', 'Stage'] and not data.get('duree'):
            raise serializers.ValidationError(
                {'duree': 'La durée est obligatoire pour un contrat CDD ou Stage.'}
            )
        return data


class OffreEmploiListSerializer(serializers.ModelSerializer):
    # version allégée pour la liste
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)
    developper_email = serializers.EmailField(source='developper.email', read_only=True)

    class Meta:
        model = Offre_Emploi
        fields = [
            'id_publication', 'nom_poste', 'localisation',
            'type_contrat', 'type_travail', 'deadline', 
            'developper_pseudo', 'developper_email', 'email', 'feu_vert',
            'description', 'competence_requise', 'date_publication', 'duree',
            'lien', 'fichier'
        ]


class CandidatureSerializer(serializers.ModelSerializer):
    developper_email = serializers.EmailField(source='developpeur.email', read_only=True)
    developper_pseudo = serializers.CharField(source='developpeur.pseudo', read_only=True)
    developper_photo = serializers.ImageField(source='developpeur.photoprofil', read_only=True)
    offre_localisation = serializers.CharField(source='offre_emploi.localisation', read_only=True)
    nom_offre = serializers.CharField(source='offre_emploi.nom_poste', read_only=True)
    offre_id = serializers.UUIDField(source='offre_emploi.id_publication', read_only=True)

    class Meta:
        model = Candidature
        fields = [
            'id', 'date_postule', 'etat', 'lettre_motivation',
            'pj', 'lien_cv', 'developper_email', 'developper_pseudo', 'developper_photo',
            'nom_offre', 'offre_id', 'offre_localisation',
        ]
        read_only_fields = [
            'id', 'date_postule', 'etat',
            'developper_email', 'developper_pseudo', 'developper_photo',
            'nom_offre', 'offre_id', 'offre_localisation',
        ]

    def validate_pj(self, value):
        if value:
            # Vérifie la signature, en plus du type fourni lors de l'envoi.
            signature = value.read(5)
            value.seek(0)
            if signature != b'%PDF-':
                raise serializers.ValidationError('Le CV joint doit être au format PDF.')
            valider_fichier(value)
        return value

    def validate_lien_cv(self, value):
        if value and not value.lower().startswith(('https://', 'http://')):
            raise serializers.ValidationError('Le lien du CV doit utiliser HTTP ou HTTPS.')
        return value

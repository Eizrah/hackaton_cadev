from rest_framework import serializers
from .models import Offre_Emploi, Candidature
from fonction_utils.gestion_fichier import valider_fichier


class OffreEmploiSerializer(serializers.ModelSerializer):
    developper_email = serializers.EmailField(source='developper.email', read_only=True)
    developper_pseudo = serializers.CharField(source='developper.pseudo', read_only=True)

    class Meta:
        model = Offre_Emploi
        fields = [
            'id_publication', 'description', 'fichier', 'lien',
            'date_publication', 'feu_vert', 'point_penalite_obtenu',
            'developper_email', 'developper_pseudo', 'localisation',
            'type_contrat', 'duree', 'nom_poste', 'competence_requise',
            'type_travail', 'deadline', 'email'
        ]
        read_only_fields = [
            'id_publication', 'date_publication',
            'feu_vert', 'point_penalite_obtenu',
            'developper_email', 'developper_pseudo',
        ]

    def validate_fichier(self, value):
        if value:
            valider_fichier(value)
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
    nom_offre = serializers.CharField(source='offre_emploi.nom_poste', read_only=True)
    offre_id = serializers.UUIDField(source='offre_emploi.id_publication', read_only=True)

    class Meta:
        model = Candidature
        fields = [
            'id', 'date_postule', 'etat', 'lettre_motivation',
            'pj', 'developper_email', 'developper_pseudo', 
            'nom_offre', 'offre_id'
        ]
        read_only_fields = [
            'id', 'date_postule', 'etat',
            'developper_email', 'developper_pseudo', 'nom_offre', 'offre_id'
        ]

    def validate_pj(self, value):
        if value:
            valider_fichier(value)
        return value

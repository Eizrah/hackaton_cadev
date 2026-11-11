from rest_framework import serializers
from .models import Competence, Apprentissage

class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = [
            'id_competence', 'nom_competence',
            'domaine', 'difficulte'
        ]
        read_only_fields = ['id_competence']

class ApprentissageSerializer(serializers.ModelSerializer):
    competence_nom = serializers.CharField(
        source='id_competence.nom_competence', read_only=True
    )
    competence_domaine = serializers.CharField(
        source='id_competence.domaine', read_only=True
    )

    class Meta:
        model = Apprentissage
        fields = [
            'id', 'id_competence', 'competence_nom', 'competence_domaine',
            'date_debut', 'date_fin', 'avancement'
        ]
        read_only_fields = ['id', 'date_debut', 'competence_nom', 'competence_domaine']

    def validate(self, data):
        # vérifie que le dev n'apprend pas déjà cette compétence
        request = self.context.get('request')
        if request and data.get('id_competence'):
            existe = Apprentissage.objects.filter(
                id_apprenant=request.user,
                id_competence=data['id_competence'],
                avancement='en_cours'
            ).exists()
            if existe:
                raise serializers.ValidationError(
                    "Vous apprenez déjà cette compétence."
                )
        return data

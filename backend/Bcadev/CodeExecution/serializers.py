from rest_framework import serializers
from .models import CodeExecution


class CodeExecutionSerializer(serializers.Serializer):
    """Serializer pour les requêtes d'exécution de code"""
    language = serializers.ChoiceField(choices=['python', 'javascript', 'c', 'cpp', 'java', 'php'])
    code = serializers.CharField(max_length=50000)
    stdin = serializers.CharField(required=False, allow_blank=True, default='')


class CodeExecutionResponseSerializer(serializers.ModelSerializer):
    """Serializer pour les réponses d'exécution"""
    class Meta:
        model = CodeExecution
        fields = ['id_execution', 'language', 'stdout', 'stderr', 'status', 'execution_time', 'created_at']
        read_only_fields = ['id_execution', 'created_at']

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CodeExecutionSerializer, CodeExecutionResponseSerializer
from .models import CodeExecution
from .docker_executor import DockerCodeExecutor
from django.utils import timezone


class ExecuteCodeView(APIView):
    """
    API pour exécuter du code dans un conteneur Docker sécurisé.
    
    POST /api/execute/
    {
        "language": "python",
        "code": "print('Hello World')",
        "stdin": "input optionnel"
    }
    """
    permission_classes = [AllowAny]  # Ou IsAuthenticated selon vos besoins
    
    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        language = serializer.validated_data['language']
        code = serializer.validated_data['code']
        stdin = serializer.validated_data.get('stdin', '')
        
        # Vérifications de sécurité basiques
        if len(code) > 50000:
            return Response(
                {'erreur': 'Le code est trop long (max 50000 caractères)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Exécuter le code dans Docker
        try:
            executor = DockerCodeExecutor()
            stdout, stderr, exec_status, execution_time = executor.execute(language, code, stdin)
        except Exception as e:
            return Response(
                {'erreur': f'Erreur serveur: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Sauvegarder l'exécution dans la BDD
        execution = CodeExecution.objects.create(
            user=request.user if request.user.is_authenticated else None,
            language=language,
            code=code,
            stdin=stdin,
            stdout=stdout,
            stderr=stderr,
            status=exec_status,
            execution_time=execution_time,
            ip_address=self._get_client_ip(request)
        )
        
        # Retourner le résultat
        response_serializer = CodeExecutionResponseSerializer(execution)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    def _get_client_ip(self, request):
        """Récupère l'IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ExecutionHistoryView(APIView):
    """Récupère l'historique des exécutions de l'utilisateur"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        executions = CodeExecution.objects.filter(user=request.user)[:50]
        serializer = CodeExecutionResponseSerializer(executions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HealthCheckView(APIView):
    """Vérifie que Docker est disponible et fonctionnel"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            executor = DockerCodeExecutor()
            # Test simple avec Python
            stdout, stderr, exec_status, _ = executor.execute(
                'python',
                'print("Docker OK")',
                ''
            )
            
            if exec_status == 'success' and 'Docker OK' in stdout:
                return Response({
                    'status': 'healthy',
                    'message': 'Code execution service is operational',
                    'docker': 'connected'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'degraded',
                    'message': 'Docker is connected but execution failed',
                    'docker': 'connected'
                }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'message': str(e),
                'docker': 'disconnected'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

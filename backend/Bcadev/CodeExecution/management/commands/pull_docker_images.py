from django.core.management.base import BaseCommand
from CodeExecution.docker_executor import DockerCodeExecutor


class Command(BaseCommand):
    help = 'Télécharge toutes les images Docker nécessaires pour l\'exécution de code'
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Début du téléchargement des images Docker...'))
        
        try:
            executor = DockerCodeExecutor()
            executor.pull_images()
            self.stdout.write(self.style.SUCCESS('✅ Toutes les images sont prêtes !'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Erreur: {e}'))

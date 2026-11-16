"""
Commande pour télécharger uniquement les images Docker essentielles
Optimisé pour serveurs avec ressources limitées (1 vCPU / 2GB RAM)
"""
from django.core.management.base import BaseCommand
from CodeExecution.docker_executor import DockerCodeExecutor


class Command(BaseCommand):
    help = 'Télécharge uniquement les images Docker essentielles pour le compilateur (Python, JavaScript)'

    def handle(self, *args, **options):
        executor = DockerCodeExecutor()
        
        # Images essentielles uniquement (les plus utilisées)
        essential_images = {
            'python': executor.DOCKER_IMAGES['python'],
            'javascript': executor.DOCKER_IMAGES['javascript'],
        }
        
        self.stdout.write(self.style.WARNING('📦 Téléchargement des images Docker ESSENTIELLES...'))
        self.stdout.write(self.style.WARNING('   (Python et JavaScript uniquement pour économiser l\'espace)'))
        self.stdout.write('')
        
        for lang, image in essential_images.items():
            try:
                self.stdout.write(f"  ⬇️  {lang}: {image}")
                executor.client.images.pull(image)
                self.stdout.write(self.style.SUCCESS(f"  ✅ {lang} OK"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  ❌ {lang} ERREUR: {e}"))
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('✨ Images essentielles téléchargées !'))
        self.stdout.write('')
        self.stdout.write(self.style.WARNING('💡 Pour télécharger TOUTES les images (C, C++, Java, PHP) :'))
        self.stdout.write('   python manage.py pull_docker_images')

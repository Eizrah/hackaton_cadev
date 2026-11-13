"""
Module d'exécution de code dans des conteneurs Docker isolés.
Gère l'exécution sécurisée de Python, JavaScript, C, C++, Java et PHP.
"""

import docker
import time
import os
from typing import Dict, Tuple
from django.conf import settings


class DockerCodeExecutor:
    """Exécute du code dans des conteneurs Docker isolés"""
    
    # Configuration des images Docker pour chaque langage
    DOCKER_IMAGES = {
        'python': 'python:3.12-slim',
        'javascript': 'node:20-alpine',
        'typescript': 'node:20-alpine',
        'c': 'gcc:13-bookworm',
        'cpp': 'gcc:13-bookworm',
        'java': 'eclipse-temurin:21-jdk-alpine',
        'php': 'php:8.3-cli-alpine',
        'swift': 'swift:5.9',
        'sql': 'postgres:16-alpine',  # Pour SQLite/PostgreSQL
    }
    
    # Limites de sécurité
    MAX_EXECUTION_TIME = 10  # secondes
    MAX_MEMORY = '128m'  # 128 MB
    MAX_OUTPUT_SIZE = 10000  # caractères
    
    def __init__(self):
        """Initialise le client Docker"""
        try:
            self.client = docker.from_env()
        except Exception as e:
            raise Exception(f"Impossible de se connecter à Docker: {e}")
    
    def execute(self, language: str, code: str, stdin: str = '') -> Tuple[str, str, str, float]:
        """
        Exécute du code dans un conteneur Docker.
        
        Args:
            language: Langage de programmation (python, javascript, c, cpp, java, php)
            code: Code source à exécuter
            stdin: Entrée standard (input)
        
        Returns:
            Tuple (stdout, stderr, status, execution_time)
        """
        if language not in self.DOCKER_IMAGES:
            return '', f"Langage non supporté: {language}", 'error', 0.0
        
        # Préparer les fichiers selon le langage
        files, command = self._prepare_execution(language, code, stdin)
        
        # Exécuter dans Docker
        start_time = time.time()
        stdout, stderr, status = self._run_in_container(language, files, command, stdin)
        execution_time = time.time() - start_time
        
        # Limiter la taille de sortie
        stdout = stdout[:self.MAX_OUTPUT_SIZE]
        stderr = stderr[:self.MAX_OUTPUT_SIZE]
        
        return stdout, stderr, status, execution_time
    
    def _prepare_execution(self, language: str, code: str, stdin: str) -> Tuple[Dict[str, str], str]:
        """Prépare les fichiers et commandes selon le langage"""
        
        if language == 'python':
            return {
                'main.py': code
            }, 'python main.py'
        
        elif language == 'javascript':
            return {
                'main.js': code
            }, 'node main.js'
        
        elif language == 'c':
            return {
                'main.c': code
            }, 'gcc /workspace/main.c -o /workspace/main && /workspace/main'
        
        elif language == 'cpp':
            return {
                'main.cpp': code
            }, 'g++ /workspace/main.cpp -o /workspace/main && /workspace/main'
        
        elif language == 'java':
            # Extraire le nom de la classe publique
            class_name = self._extract_java_class_name(code)
            return {
                f'{class_name}.java': code
            }, f'javac /workspace/{class_name}.java && cd /workspace && java {class_name}'
        
        elif language == 'php':
            return {
                'main.php': code
            }, 'php main.php'
        
        elif language == 'typescript':
            return {
                'main.ts': code,
                'tsconfig.json': '{"compilerOptions": {"target": "ES2020", "module": "commonjs", "strict": false}}'
            }, 'sh -c "npm install -g typescript > /dev/null 2>&1 && tsc main.ts && node main.js"'
        
        elif language == 'swift':
            return {
                'main.swift': code
            }, 'swift main.swift'
        
        elif language == 'sql':
            # SQLite pour exécution SQL
            return {
                'query.sql': code
            }, 'sh -c "apt-get update > /dev/null && apt-get install -y sqlite3 > /dev/null && sqlite3 :memory: < query.sql"'
        
        return {}, ''
    
    def _extract_java_class_name(self, code: str) -> str:
        """Extrait le nom de la classe publique Java"""
        import re
        match = re.search(r'public\s+class\s+(\w+)', code)
        return match.group(1) if match else 'Main'
    
    def _run_in_container(self, language: str, files: Dict[str, str], command: str, stdin: str) -> Tuple[str, str, str]:
        """Exécute le code dans un conteneur Docker"""
        
        image = self.DOCKER_IMAGES[language]
        
        try:
            # Créer le conteneur avec les fichiers montés
            import tempfile
            import tarfile
            from io import BytesIO
            
            # Créer une archive tar avec les fichiers
            tar_stream = BytesIO()
            tar = tarfile.open(fileobj=tar_stream, mode='w')
            
            for filename, content in files.items():
                content_bytes = content.encode('utf-8')
                tarinfo = tarfile.TarInfo(name=filename)
                tarinfo.size = len(content_bytes)
                tarinfo.mode = 0o644
                tar.addfile(tarinfo, BytesIO(content_bytes))
            
            tar.close()
            tar_data = tar_stream.getvalue()
            
            # Créer et démarrer le conteneur
            container = self.client.containers.create(
                image=image,
                command=f'sh -c "{command}"',
                detach=True,
                stdin_open=bool(stdin),
                tty=False,
                mem_limit=self.MAX_MEMORY,
                network_disabled=True,
                security_opt=['no-new-privileges'],
                cap_drop=['ALL'],
                working_dir='/workspace',
                environment={
                    'PYTHONUNBUFFERED': '1',
                }
            )
            
            # Copier les fichiers dans le conteneur
            container.put_archive('/workspace', tar_data)
            
            # Démarrer le conteneur
            container.start()
            
            # Envoyer stdin si nécessaire
            if stdin:
                try:
                    sock = container.attach_socket(params={'stdin': 1, 'stream': 1, 'stdout': 0, 'stderr': 0})
                    sock._sock.send(stdin.encode('utf-8'))
                    sock.close()
                except:
                    pass  # Ignorer les erreurs stdin
            
            # Attendre l'exécution avec timeout
            try:
                result = container.wait(timeout=self.MAX_EXECUTION_TIME)
                exit_code = result['StatusCode']
                
                # Récupérer stdout et stderr
                logs = container.logs(stdout=True, stderr=True).decode('utf-8', errors='ignore')
                
                # Docker mélange stdout et stderr, on fait de notre mieux
                stdout = logs
                stderr = '' if exit_code == 0 else logs
                
                status = 'success' if exit_code == 0 else 'error'
                
            except docker.errors.ReadTimeout:
                stdout = ''
                stderr = f'Timeout: l\'exécution a dépassé {self.MAX_EXECUTION_TIME} secondes'
                status = 'timeout'
            
            finally:
                # Nettoyer le conteneur
                try:
                    container.stop(timeout=1)
                except:
                    pass
                try:
                    container.remove(force=True)
                except:
                    pass
            
            return stdout, stderr, status
        
        except docker.errors.ImageNotFound:
            return '', f"Image Docker non trouvée: {image}. Exécutez: docker pull {image}", 'error'
        
        except docker.errors.APIError as e:
            return '', f"Erreur Docker API: {str(e)}", 'error'
        
        except Exception as e:
            return '', f"Erreur inattendue: {str(e)}", 'error'
    
    def pull_images(self):
        """Télécharge toutes les images Docker nécessaires"""
        print("📦 Téléchargement des images Docker...")
        for lang, image in self.DOCKER_IMAGES.items():
            try:
                print(f"  ⬇️  {lang}: {image}")
                self.client.images.pull(image)
                print(f"  ✅ {lang} OK")
            except Exception as e:
                print(f"  ❌ {lang} ERREUR: {e}")
        print("✨ Toutes les images sont prêtes !")

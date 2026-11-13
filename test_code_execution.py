"""
Script de test pour l'exécution de code Docker
"""

import os
import sys
import django

# Configuration Django
sys.path.insert(0, 'e:/Cadev/backend/Bcadev')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
django.setup()

from CodeExecution.docker_executor import DockerCodeExecutor

def test_language(executor, language, code, description):
    """Teste un langage"""
    print(f"\n{'='*60}")
    print(f"Test : {description}")
    print(f"{'='*60}")
    print(f"Code:\n{code}\n")
    
    try:
        stdout, stderr, status, exec_time = executor.execute(language, code, '')
        
        print(f"Status: {status}")
        print(f"Temps: {exec_time:.3f}s")
        
        if stdout:
            print(f"\nSortie:\n{stdout}")
        
        if stderr:
            print(f"\nErreur:\n{stderr}")
            
    except Exception as e:
        print(f"Erreur: {e}")

def main():
    print("Test d'execution de code multi-langages")
    print("="*60)
    
    try:
        executor = DockerCodeExecutor()
        print("Connexion Docker etablie\n")
    except Exception as e:
        print(f"Erreur de connexion Docker: {e}")
        return
    
    # Tests
    test_language(
        executor, 
        'python', 
        'print("Hello from Python!")\nfor i in range(3):\n    print(f"Ligne {i+1}")',
        "Python 3.12"
    )
    
    test_language(
        executor,
        'javascript',
        'console.log("Hello from JavaScript!");\nfor (let i = 0; i < 3; i++) {\n    console.log(`Ligne ${i+1}`);\n}',
        "JavaScript (Node 20)"
    )
    
    test_language(
        executor,
        'c',
        '#include <stdio.h>\nint main() {\n    printf("Hello from C!\\n");\n    for (int i = 0; i < 3; i++) {\n        printf("Ligne %d\\n", i+1);\n    }\n    return 0;\n}',
        "C (gcc 13)"
    )
    
    test_language(
        executor,
        'java',
        'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n        for (int i = 0; i < 3; i++) {\n            System.out.println("Ligne " + (i+1));\n        }\n    }\n}',
        "Java (Eclipse Temurin 21)"
    )
    
    test_language(
        executor,
        'php',
        '<?php\necho "Hello from PHP!\\n";\nfor ($i = 0; $i < 3; $i++) {\n    echo "Ligne " . ($i+1) . "\\n";\n}\n?>',
        "PHP 8.3"
    )
    
    print("\n" + "="*60)
    print("Tests termines !")
    print("="*60)

if __name__ == "__main__":
    main()

"""
Script de test pour vérifier que le contexte de code est bien extrait et utilisé
par le FloatingTutor.

Usage:
    python test_context.py
"""

import requests
import json

# Configuration
API_URL = "http://localhost:8000/api/agents/learning/chat/"
LOGIN_URL = "http://localhost:8000/api/accounts/login/"

# Données de test
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpass123"

# Test 1: Contexte code (bouton robot 🤖)
test_code_context = {
    "messages": [
        {
            "role": "user",
            "content": "Que fait useState ici ?"
        }
    ],
    "language": "fr",
    "context": {
        "courseId": "react",
        "courseTitle": "React : Hooks et État",
        "lessonTitle": "useState - État local",
        "file": "Counter.jsx",
        "code": "const [count, setCount] = useState(0);\nreturn <button onClick={() => setCount(count + 1)}>{count}</button>;",
        "explanation": "useState est un hook React qui permet de gérer l'état local d'un composant.",
        "level": "intermediaire",
        "returnPath": "apprentissage/cours/react/hooks"
    }
}

# Test 2: Contexte cours (bouton point d'interrogation ❓)
test_course_context = {
    "messages": [
        {
            "role": "user",
            "content": "Explique-moi Django"
        }
    ],
    "language": "fr",
    "context": {
        "kind": "lesson",
        "courseId": "react",
        "courseTitle": "React : Hooks et État",
        "lessonTitle": "useEffect - Effets de bord",
        "explanation": "Le hook useEffect permet d'exécuter du code après chaque rendu du composant.",
        "level": "intermediaire",
        "returnPath": "apprentissage/cours/react/hooks"
    }
}

def test_context_extraction():
    """Test que le contexte de code est bien extrait"""
    
    print("\n" + "="*60)
    print("TEST 1: Extraction du contexte CODE (bouton robot 🤖)")
    print("="*60)
    
    print("\n📤 Envoi de la requête avec contexte code...")
    print(f"Code: {test_code_context['context']['code'][:50]}...")
    print(f"Fichier: {test_code_context['context']['file']}")
    
    # Note: Ce test nécessite une authentification
    # Pour le moment, on vérifie juste que l'endpoint existe
    try:
        response = requests.post(
            API_URL,
            json=test_code_context,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        
        if response.status_code == 403:
            print("\n⚠️  Authentification requise (normal)")
            print("✅ L'endpoint existe et répond")
        elif response.status_code == 200:
            data = response.json()
            answer = data.get('answer', '')
            print(f"\n✅ Réponse reçue ({len(answer)} caractères)")
            print(f"\nRéponse: {answer[:200]}...")
            
            # Vérifier que la réponse mentionne le code
            if 'useState' in answer or 'count' in answer:
                print("✅ Le contexte code a été utilisé dans la réponse")
            else:
                print("⚠️  La réponse ne semble pas utiliser le contexte code")
        else:
            print(f"❌ Erreur {response.status_code}: {response.text[:200]}")
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au backend sur http://localhost:8000")
        print("   Vérifiez que Django tourne avec: python manage.py runserver")
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")

def test_course_restriction():
    """Test que l'IA reste dans le contexte du cours"""
    
    print("\n" + "="*60)
    print("TEST 2: Restriction au contexte COURS (bouton ❓)")
    print("="*60)
    
    print("\n📤 Envoi d'une question HORS contexte (Django dans cours React)...")
    print(f"Cours: {test_course_context['context']['courseTitle']}")
    print(f"Question: {test_course_context['messages'][0]['content']}")
    
    try:
        response = requests.post(
            API_URL,
            json=test_course_context,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        
        if response.status_code == 403:
            print("\n⚠️  Authentification requise (normal)")
            print("✅ L'endpoint existe et répond")
        elif response.status_code == 200:
            data = response.json()
            answer = data.get('answer', '')
            print(f"\n✅ Réponse reçue ({len(answer)} caractères)")
            print(f"\nRéponse: {answer[:300]}...")
            
            # Vérifier que la réponse redirige vers le cours React
            keywords_restriction = ['react', 'cours react', 'contexte', 'reste dans']
            keywords_django = ['django', 'python backend']
            
            has_restriction = any(kw in answer.lower() for kw in keywords_restriction)
            talks_django = any(kw in answer.lower() for kw in keywords_django)
            
            if has_restriction and not talks_django:
                print("✅ L'IA respecte le contexte du cours React")
            elif talks_django:
                print("⚠️  L'IA parle de Django alors qu'on est dans le cours React")
            else:
                print("⚠️  Impossible de déterminer si la restriction fonctionne")
        else:
            print(f"❌ Erreur {response.status_code}: {response.text[:200]}")
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au backend sur http://localhost:8000")
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")

def test_backend_health():
    """Vérifie que le backend Django répond"""
    
    print("\n" + "="*60)
    print("VÉRIFICATION: État du backend Django")
    print("="*60)
    
    try:
        response = requests.get("http://localhost:8000/api/", timeout=5)
        print(f"✅ Backend accessible (status {response.status_code})")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend Django non accessible sur http://localhost:8000")
        print("   Démarrez-le avec: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n🧪 Tests FloatingTutor - Contexte Code et Cours\n")
    
    # Vérifier d'abord que le backend est accessible
    if test_backend_health():
        test_context_extraction()
        test_course_restriction()
    
    print("\n" + "="*60)
    print("NOTES:")
    print("="*60)
    print("- Ces tests nécessitent une authentification pour fonctionner complètement")
    print("- Pour tester en conditions réelles, utilisez l'interface web:")
    print("  1. Connectez-vous sur http://localhost:5173")
    print("  2. Allez dans un cours (ex: React)")
    print("  3. Testez le bouton robot 🤖 dans un atelier code")
    print("  4. Testez le bouton ❓ avec une question hors contexte")
    print("="*60)
    print()

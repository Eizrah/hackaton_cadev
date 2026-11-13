# 🚀 Système d'exécution de code multi-langages - Documentation complète

## Vue d'ensemble

Ce système permet aux utilisateurs d'exécuter du code dans 9 langages différents directement depuis le navigateur, de manière sécurisée via Docker.

---

## 📂 Architecture

```
Cadev/
├── backend/
│   └── Bcadev/
│       └── CodeExecution/          # Module Django
│           ├── docker_executor.py  # Exécution Docker
│           ├── views.py            # API endpoints
│           ├── models.py           # Historique BD
│           ├── serializers.py      # Validation
│           └── urls.py             # Routes
│
└── frontend/
    └── src/
        ├── api/
        │   └── codeExecution.ts    # Service API
        ├── hooks/
        │   └── useCodeExecution.ts # Hook React
        └── components/
            └── learning/
                └── WebCodeStudio.tsx # Intégration UI
```

---

## 🔧 Langages supportés

| Langage    | Version       | Image Docker              | Status |
|------------|---------------|---------------------------|--------|
| Python     | 3.12          | python:3.12-slim          | ✅     |
| JavaScript | Node 20       | node:20-alpine            | ✅     |
| TypeScript | Node 20 + tsc | node:20-alpine            | ✅     |
| C          | gcc 13        | gcc:13-bookworm           | ✅     |
| C++        | g++ 13        | gcc:13-bookworm           | ✅     |
| Java       | 21 (Temurin)  | eclipse-temurin:21-alpine | ✅     |
| PHP        | 8.3           | php:8.3-cli-alpine        | ✅     |
| Swift      | 5.9           | swift:5.9                 | ✅     |
| SQL        | PostgreSQL 16 | postgres:16-alpine        | ✅     |

---

## 🔐 Sécurité

### Isolation Docker
- Chaque exécution dans un conteneur séparé
- Conteneurs détruits après exécution
- Aucune persistance entre exécutions

### Limites strictes
```python
MAX_EXECUTION_TIME = 10   # secondes
MAX_MEMORY = '128m'       # 128 MB
MAX_OUTPUT_SIZE = 10000   # caractères
```

### Protection réseau
- `network_disabled=True` : Pas d'accès Internet
- `cap_drop=['ALL']` : Aucun privilège système
- `security_opt=['no-new-privileges']`

---

## 📡 API Endpoints

### POST `/api/code-execution/execute/`
Exécute du code dans un conteneur Docker.

**Request :**
```json
{
  "language": "python",
  "code": "print('Hello World')",
  "stdin": ""
}
```

**Response :**
```json
{
  "id": 1,
  "stdout": "Hello World\n",
  "stderr": "",
  "status": "success",
  "execution_time": 0.234,
  "created_at": "2026-10-23T10:30:00Z"
}
```

### GET `/api/code-execution/history/`
Récupère l'historique des exécutions (authentifié).

### GET `/api/code-execution/health/`
Vérifie que Docker est opérationnel.

---

## 🎯 Utilisation Frontend

### Méthode 1 : Hook React (recommandé)

```tsx
import { useCodeExecution } from '../hooks/useCodeExecution'

function MyComponent() {
  const { execute, isExecuting, result, error } = useCodeExecution()

  const handleRun = async () => {
    const response = await execute('python', 'print("Hello")', '')
    console.log(response.stdout)
  }

  return (
    <button onClick={handleRun} disabled={isExecuting}>
      Exécuter
    </button>
  )
}
```

### Méthode 2 : API directe

```tsx
import { codeExecutionApi } from '../api/codeExecution'

const result = await codeExecutionApi.execute({
  language: 'javascript',
  code: 'console.log("Hello")',
  stdin: ''
})
```

---

## 🚀 Installation & Lancement

### 1. Prérequis
- Docker Desktop installé et lancé
- Python 3.12+
- Node.js 20+

### 2. Backend

```bash
cd e:\Cadev\backend\Bcadev

# Migrations
python manage.py makemigrations CodeExecution
python manage.py migrate

# Télécharger images Docker (une seule fois)
python manage.py pull_docker_images

# Lancer le serveur
python manage.py runserver
```

### 3. Frontend

```bash
cd e:\Cadev\frontend

# Installer dépendances (si besoin)
npm install

# Lancer dev server
npm run dev
```

### 4. Tester

```bash
# Health check
curl http://localhost:8000/api/code-execution/health/

# Test Python
curl -X POST http://localhost:8000/api/code-execution/execute/ \
  -H "Content-Type: application/json" \
  -d '{"language":"python","code":"print(\"Hello\")"}'
```

---

## 🧪 Tests

### Test backend

```bash
cd e:\Cadev
python test_code_execution.py
```

### Test frontend

1. Aller sur http://localhost:5173
2. Section Learning/Apprentissage
3. Choisir un cours (Python, JS, C, etc.)
4. Ouvrir un exercice
5. Cliquer sur "Exécuter"
6. Vérifier la sortie dans la console

---

## 🐛 Troubleshooting

### Erreur : "Docker not connected"
```bash
# Vérifier Docker
docker --version
docker ps

# Relancer Docker Desktop
```

### Erreur : "Image not found"
```bash
# Re-télécharger les images
cd e:\Cadev\backend\Bcadev
python manage.py pull_docker_images
```

### Erreur : "CORS"
Dans `settings.py`, vérifier :
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
]
```

### Erreur : "Service indisponible"
1. Backend tourne ? `http://localhost:8000/admin/`
2. Docker tourne ? `docker ps`
3. Images OK ? `docker images`

---

## 📊 Monitoring

### Django Admin
```
http://localhost:8000/admin/CodeExecution/codeexecution/
```

### Nettoyer Docker
```bash
# Conteneurs arrêtés
docker container prune -f

# Images inutilisées
docker image prune -a
```

### Logs
```bash
# Backend Django
cd e:\Cadev\backend\Bcadev
python manage.py runserver
# Voir les logs en temps réel

# Docker
docker logs CONTAINER_ID
```

---

## 📈 Performances

### Temps d'exécution moyens
- Python : ~0.6s
- JavaScript : ~0.7s  
- C/C++ : ~0.6s (compilation incluse)
- Java : ~1.7s (compilation incluse)
- PHP : ~0.6s

### Optimisations possibles
1. **Pool de conteneurs** : Pré-créer des conteneurs
2. **Cache de compilation** : Garder les .class Java
3. **Conteneurs réutilisables** : Ne pas destroy à chaque fois
4. **Queue de tâches** : Celery pour async
5. **Load balancing** : Plusieurs workers Docker

---

## 🔄 Workflow d'exécution

```
1. User clique "Exécuter" dans WebCodeStudio
   ↓
2. Frontend appelle codeExecutionApi.execute()
   ↓
3. POST /api/code-execution/execute/
   ↓
4. Backend crée conteneur Docker
   ↓
5. Copie fichiers dans conteneur (tar)
   ↓
6. Démarre conteneur et exécute commande
   ↓
7. Attend résultat (max 10s)
   ↓
8. Récupère stdout/stderr
   ↓
9. Détruit conteneur
   ↓
10. Retourne résultat au frontend
   ↓
11. Frontend affiche dans console
```

---

## 🎓 Exemples d'utilisation

### Exercice débutant (Python)
```python
# Demande le nom et affiche un message
nom = input("Ton nom ? ")
print(f"Bonjour {nom} !")
```

### Mini-projet (C)
```c
#include <stdio.h>

int main() {
    int n;
    printf("Nombre ? ");
    scanf("%d", &n);
    
    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\n", n, i, n * i);
    }
    return 0;
}
```

### API REST (JavaScript)
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Hello API' });
});

console.log('Serveur démarré');
```

---

## ✅ Checklist de déploiement

### Développement
- [x] Backend Django fonctionnel
- [x] Docker configuré
- [x] Images téléchargées
- [x] Frontend intégré
- [x] Tests passent

### Production (TODO)
- [ ] Variables d'environnement
- [ ] HTTPS activé
- [ ] Rate limiting
- [ ] Monitoring (Sentry)
- [ ] Backup BD
- [ ] Scaling Docker
- [ ] CDN pour images
- [ ] CI/CD pipeline

---

## 📚 Ressources

### Documentation
- [Docker Python SDK](https://docker-py.readthedocs.io/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Hooks](https://react.dev/reference/react)

### Images Docker
- [Python Official](https://hub.docker.com/_/python)
- [Node Official](https://hub.docker.com/_/node)
- [GCC Official](https://hub.docker.com/_/gcc)
- [Eclipse Temurin](https://hub.docker.com/_/eclipse-temurin)

---

## 👥 Contribution

Pour ajouter un nouveau langage :

1. **Backend** : `docker_executor.py`
   ```python
   DOCKER_IMAGES['rust'] = 'rust:1.75-alpine'
   
   def _prepare_execution(self, language, code, stdin):
       elif language == 'rust':
           return {'main.rs': code}, 'rustc main.rs && ./main'
   ```

2. **Frontend** : `WebCodeStudio.tsx`
   ```typescript
   const mapping: Record<string, SupportedLanguage> = {
       'rust': 'rust',
   }
   ```

3. **API** : `codeExecution.ts`
   ```typescript
   export type SupportedLanguage = 'python' | 'rust' | ...
   ```

---

## 📞 Support

En cas de problème :
1. Vérifier les logs Django
2. Vérifier les logs Docker : `docker logs`
3. Tester l'API directement avec curl
4. Consulter ce fichier de documentation

---

**🎉 Le système est maintenant opérationnel !**

Les utilisateurs peuvent exécuter du code dans 9 langages différents, directement depuis le navigateur, de manière sécurisée et performante.

# 🤖 Guide d'intégration IA - Assistant d'apprentissage

**Date** : 12 novembre 2026  
**Projet** : DevAfrica Connect

---

## ✅ État actuel du système

### Frontend : FloatingTutor déjà implémenté ! 🎉

Le composant `FloatingTutor.tsx` est **déjà fonctionnel** et inclut :

1. **✅ Bouton flottant "?" (CircleHelp)**
   - Visible sur toutes les pages `/workspace/apprentissage`
   - Ouvre un chat contextuel
   - Comprend automatiquement la leçon en cours
   - Gère l'historique des conversations
   - Sauvegarde locale des discussions

2. **⚠️ Bouton robot dans les blocs de code**
   - À vérifier/compléter
   - Devrait utiliser `TutorOverlay` (déjà présent)
   - Mode "code" déjà géré par le système

### Backend : Endpoints partiellement présents

**Structure existante** :
```
backend/Bcadev/
├── Agents/                    # Structure IA
│   ├── graph/                # LangGraph workflows
│   ├── llm/                  # Client LLM
│   ├── prompt/               # Prompts système
│   ├── rag/                  # RAG (embeddings, vectorstore)
│   ├── services/             # Services IA
│   └── tools/                # Outils agent
└── Learning/                  # App apprentissage
    ├── views.py              # Vues API
    └── urls.py               # Routes API
```

**Endpoints existants** (`/api/learning/`) :
- `assistant/question/` - Poser une question
- `assistant/exercice/` - Générer un exercice
- `assistant/corriger/` - Corriger un exercice
- `assistant/recommander/` - Recommander du contenu

**Endpoint attendu par le frontend** :
- `POST /api/agents/learning/chat/` ❌ N'existe PAS encore

---

## 🔧 Configuration actuelle

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
VITE_AUTH_MODE=api
VITE_AGENT_MODE=api          # ✅ Déjà en mode API !
```

### Frontend `agents.ts`
Le système envoie :
```typescript
POST /api/agents/learning/chat/
{
  "messages": [
    { "role": "user", "content": "Qu'est-ce qu'une variable ?" },
    { "role": "assistant", "content": "Une variable..." },
    { "role": "user", "content": "Donne un exemple" }
  ],
  "language": "fr",
  "context": {
    "courseTitle": "Python",
    "lessonTitle": "Les variables",
    "lessonContent": "..."
  }
}
```

Réponse attendue :
```json
{
  "answer": "Voici un exemple de variable en Python : ..."
}
```

---

## 🚀 Solution : Créer l'endpoint manquant

### Option 1 : Adapter le frontend (rapide)

Modifier `frontend/src/lib/agents.ts` pour utiliser `/api/learning/assistant/question/` :

```typescript
// Dans agents.ts, ligne ~11
const response = await apiRequest<{ answer: string }>(
  "learning/assistant/question/",  // ⬅️ Changer ici
  { method: "POST", body: JSON.stringify({ messages, language, ...(context ? { context } : {}) }) },
);
```

**Avantage** : Rapide, réutilise l'endpoint existant  
**Inconvénient** : Il faut vérifier que `/assistant/question/` gère le format attendu

---

### Option 2 : Créer `/api/agents/learning/chat/` (recommandé)

#### Étape 1 : Créer une app `Agents`

```bash
cd e:\Cadev\backend\Bcadev
python manage.py startapp AgentsAPI
```

Ou utiliser le dossier `Agents` existant et y ajouter des vues.

#### Étape 2 : Créer la vue `ChatAgentView`

```python
# backend/Bcadev/Agents/views.py (nouveau fichier)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services.assistant_services import assistant_apprentissage
import json

class ChatAgentView(APIView):
    """
    Endpoint unifié pour discuter avec l'agent d'apprentissage.
    Gère les messages contextuels (leçon ou code).
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        messages = request.data.get('messages', [])
        language = request.data.get('language', 'fr')
        context = request.data.get('context')  # Optionnel
        
        if not messages:
            return Response(
                {'error': 'Messages requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extraire la dernière question de l'utilisateur
        last_user_message = next(
            (msg['content'] for msg in reversed(messages) if msg['role'] == 'user'),
            None
        )
        
        if not last_user_message:
            return Response(
                {'error': 'Aucune question trouvée'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Appeler le service IA existant
            # Adapter selon ta fonction assistant_apprentissage
            answer = assistant_apprentissage(
                question=last_user_message,
                historique=[msg['content'] for msg in messages[:-1]],
                contexte=context,
                langue=language
            )
            
            return Response({'answer': answer}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Erreur agent : {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

#### Étape 3 : Créer les URLs

```python
# backend/Bcadev/Agents/urls.py (nouveau fichier)
from django.urls import path
from .views import ChatAgentView

urlpatterns = [
    path('learning/chat/', ChatAgentView.as_view(), name='agent-learning-chat'),
]
```

#### Étape 4 : Enregistrer dans `urls.py` principal

```python
# backend/Bcadev/Bcadev/urls.py
urlpatterns = [
    # ... autres routes ...
    path('api/agents/', include('Agents.urls')),  # ⬅️ Ajouter cette ligne
]
```

#### Étape 5 : Tester l'endpoint

```bash
# Dans un terminal
curl -X POST http://localhost:8000/api/agents/learning/chat/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TON_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Qu est-ce qu une variable ?"}
    ],
    "language": "fr"
  }'
```

---

## 🎨 Ajouter le bouton robot dans les blocs de code

### Frontend : Modifier le rendu des blocs de code

Le système utilise déjà `TutorOverlay`. Il faut juste ajouter un bouton dans les blocs de code.

Cherchons où les blocs de code sont rendus :

```typescript
// frontend/src/components/learning/...
// Ou dans le composant qui affiche les exemples de code
```

**Exemple d'intégration** :

```tsx
import { useContext } from 'react';
import { Bot } from 'lucide-react';
import { TutorOverlay } from '../../lib/tutorOverlayContext';

function CodeBlock({ code, language, file }) {
  const openTutor = useContext(TutorOverlay);
  
  const handleExplain = () => {
    openTutor({
      courseTitle: "...",  // Récupérer depuis le contexte
      file: file || "example.code",
      language,
      code
    });
  };
  
  return (
    <div className="code-block">
      <button 
        className="code-explain-btn"
        onClick={handleExplain}
        title="Expliquer ce code">
        <Bot size={20} />
      </button>
      <pre><code>{code}</code></pre>
    </div>
  );
}
```

---

## 📋 Checklist d'intégration complète

### Backend
- [ ] Vérifier que `assistant_apprentissage()` existe dans `Agents/services/`
- [ ] Créer `Agents/views.py` avec `ChatAgentView`
- [ ] Créer `Agents/urls.py`
- [ ] Enregistrer `path('api/agents/', include('Agents.urls'))` dans `Bcadev/urls.py`
- [ ] Tester l'endpoint avec curl/Postman
- [ ] Vérifier les permissions (authentification requise ?)
- [ ] Gérer les erreurs (LLM indisponible, quota dépassé, etc.)

### Frontend
- [x] FloatingTutor déjà implémenté ✅
- [ ] Vérifier l'endpoint appelé dans `agents.ts` (ligne ~11)
- [ ] Trouver où les blocs de code sont rendus
- [ ] Ajouter le bouton `<Bot>` dans chaque bloc
- [ ] Connecter le bouton à `TutorOverlay.openTutor()`
- [ ] Tester le flux complet : question → backend → réponse

### Tests
- [ ] Tester bouton "?" sur une leçon
- [ ] Tester bouton robot sur un bloc de code
- [ ] Tester l'historique des conversations
- [ ] Tester avec et sans contexte
- [ ] Tester les erreurs (backend down, timeout, etc.)

---

## 🐛 Dépannage

### Erreur : "Agent is unavailable"

**Causes possibles** :
1. Backend Django non démarré
2. Endpoint `/api/agents/learning/chat/` n'existe pas
3. Erreur dans le service IA (LLM, RAG, etc.)
4. Token d'authentification manquant/invalide

**Solutions** :
```bash
# Vérifier que Django tourne
curl http://localhost:8000/api/learning/assistant/question/

# Vérifier les logs Django
cd e:\Cadev\backend\Bcadev
python manage.py runserver
# Regarder les logs dans le terminal

# Vérifier la configuration frontend
cat e:\Cadev\frontend\.env
# VITE_AGENT_MODE doit être "api"
# VITE_API_URL doit pointer vers Django
```

### Erreur : CORS

Si tu vois des erreurs CORS dans la console :

```python
# backend/Bcadev/Bcadev/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend Vite
]

CORS_ALLOW_CREDENTIALS = True
```

### Erreur : 401 Unauthorized

L'endpoint nécessite une authentification. Vérifie que :
1. Tu es connecté dans le frontend
2. Le token est envoyé dans les headers
3. La permission `IsAuthenticated` est correcte

---

## 📚 Fichiers clés à modifier

### Backend
```
backend/Bcadev/
├── Agents/
│   ├── views.py              # ⬅️ CRÉER ChatAgentView
│   ├── urls.py               # ⬅️ CRÉER routes agents
│   └── services/
│       └── assistant_services.py  # ⬅️ VÉRIFIER fonction existante
├── Bcadev/
│   └── urls.py               # ⬅️ MODIFIER ajouter agents
└── Learning/
    └── urls.py               # ⬅️ Optionnel : unifier ici
```

### Frontend
```
frontend/src/
├── components/
│   ├── shared/
│   │   └── FloatingTutor.tsx # ✅ Déjà OK !
│   └── learning/
│       └── [CodeBlock].tsx   # ⬅️ TROUVER et ajouter bouton robot
└── lib/
    └── agents.ts             # ⬅️ VÉRIFIER endpoint appelé
```

---

## 🎯 Résumé rapide

**Pour faire fonctionner l'IA :**

1. **Backend** : Créer `/api/agents/learning/chat/` qui appelle ton service IA
2. **Frontend** : Vérifier que `VITE_AGENT_MODE=api` (✅ déjà fait !)
3. **Bouton code** : Trouver le composant CodeBlock et ajouter `<Bot>` avec `openTutor()`

**Le système est déjà à 80% prêt !** Il manque juste l'endpoint backend et le bouton dans les blocs de code.

---

**Questions ?**
- Quelle fonction IA as-tu dans `Agents/services/` ?
- Quel modèle LLM utilises-tu (OpenAI, Gemini, local) ?
- Veux-tu que je t'aide à créer les fichiers manquants ?


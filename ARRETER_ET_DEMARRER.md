# Guide : Arrêter et redémarrer le projet DevAfrica Connect

## 🛑 Arrêter le projet proprement

### 1. Arrêter les serveurs de développement

**Frontend (Vite)** :
```powershell
# Dans le terminal où tourne `npm run dev`
# Appuie sur Ctrl+C
# Ou ferme le terminal
```

**Backend (Django)** :
```powershell
# Dans le terminal où tourne `python manage.py runserver`
# Appuie sur Ctrl+C
# Ou ferme le terminal
```

### 2. Arrêter Docker (si utilisé)

```powershell
cd e:\Cadev\backend\Bcadev
docker-compose down
```

Ou arrêter tous les conteneurs :
```powershell
docker stop $(docker ps -q)
```

### 3. Éteindre le PC
Tu peux maintenant éteindre ton PC normalement.

---

## 🚀 Redémarrer le projet plus tard

### 1. Ouvrir VS Code
```powershell
cd e:\Cadev
code .
```

### 2. Démarrer Docker (si nécessaire)
```powershell
cd e:\Cadev\backend\Bcadev
docker-compose up -d
```

### 3. Démarrer le backend Django
```powershell
cd e:\Cadev\backend\Bcadev
python manage.py runserver
```

### 4. Démarrer le frontend Vite
```powershell
cd e:\Cadev\frontend
npm run dev
```

### 5. Ouvrir le navigateur
- Frontend : http://localhost:5173
- Backend API : http://127.0.0.1:8000

---

## ⚡ Raccourci rapide

Tu peux aussi créer des scripts pour tout démarrer d'un coup :

### `start.ps1` (PowerShell)
```powershell
# Démarre tout le projet
Write-Host "🚀 Démarrage du projet DevAfrica Connect..." -ForegroundColor Cyan

# Docker (si nécessaire)
if (Test-Path ".\backend\Bcadev\docker-compose.yml") {
    Write-Host "📦 Démarrage de Docker..." -ForegroundColor Yellow
    cd backend\Bcadev
    docker-compose up -d
    cd ..\..
}

# Backend Django
Write-Host "🐍 Démarrage du backend Django..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend\Bcadev; python manage.py runserver"

# Attendre un peu
Start-Sleep -Seconds 3

# Frontend Vite
Write-Host "⚡ Démarrage du frontend Vite..." -ForegroundColor Magenta
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Projet démarré !" -ForegroundColor Green
Write-Host "Frontend : http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend : http://127.0.0.1:8000" -ForegroundColor Cyan
```

### `stop.ps1` (PowerShell)
```powershell
# Arrête tout le projet
Write-Host "🛑 Arrêt du projet DevAfrica Connect..." -ForegroundColor Red

# Arrêter les processus Node et Python
Write-Host "Arrêt des serveurs..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -match "node|python"} | Stop-Process -Force

# Arrêter Docker
if (Test-Path ".\backend\Bcadev\docker-compose.yml") {
    Write-Host "📦 Arrêt de Docker..." -ForegroundColor Yellow
    cd backend\Bcadev
    docker-compose down
    cd ..\..
}

Write-Host "✅ Projet arrêté !" -ForegroundColor Green
```

**Utilisation** :
```powershell
# Démarrer tout
.\start.ps1

# Arrêter tout
.\stop.ps1
```

---

## 💡 Réponses rapides

### ❓ Puis-je éteindre le PC directement ?
**✅ OUI !** Tu peux éteindre ton PC sans arrêter Docker. Il n'y a aucun risque de casser quoi que ce soit.

### ❓ Que se passe-t-il si j'éteins sans arrêter ?
- Docker arrête proprement les conteneurs automatiquement
- Les données dans les volumes persistent (bases de données, fichiers)
- Aucune corruption possible

### ❓ Docker redémarre-t-il automatiquement ?
- **Non** par défaut, tu dois relancer `docker-compose up -d`
- Mais tu peux configurer le redémarrage automatique dans `docker-compose.yml` :
  ```yaml
  services:
    nom-service:
      restart: always
  ```

### ❓ Comment savoir si Docker tourne ?
```powershell
docker ps        # Voir les conteneurs actifs
docker-compose ps   # Si tu utilises compose
```

---

## 🔍 Commandes utiles

### Voir l'état de Docker
```powershell
docker ps                # Conteneurs actifs
docker ps -a             # Tous les conteneurs
docker images            # Images téléchargées
docker volume ls         # Volumes (données persistantes)
docker-compose ps        # État du projet
```

### Logs et debug
```powershell
docker logs nom_conteneur        # Voir les logs
docker-compose logs              # Logs de tous les services
docker-compose logs -f           # Suivre les logs en temps réel
```

### Nettoyage (si besoin)
```powershell
docker system prune              # Nettoyer les conteneurs arrêtés
docker volume prune              # Nettoyer les volumes non utilisés
docker-compose down -v           # Arrêter et supprimer les volumes
```

---

## ⚠️ Attention

### ❌ Ne fais PAS :
- `docker-compose down -v` sauf si tu veux **supprimer les données** (base de données)
- `docker system prune -a` sauf si tu veux tout supprimer

### ✅ Fais plutôt :
- `docker-compose down` : arrête proprement sans supprimer les données
- `docker-compose up -d` : redémarre en arrière-plan
- `docker-compose restart` : redémarre sans tout arrêter

---

## 📝 Résumé

**Pour arrêter rapidement** :
1. Ctrl+C dans les terminaux (frontend/backend)
2. `docker-compose down` (si Docker utilisé)
3. Éteindre le PC

**Pour redémarrer** :
1. `docker-compose up -d` (si Docker nécessaire)
2. `python manage.py runserver` (backend)
3. `npm run dev` (frontend)

**En cas de doute** :
- Tu peux **toujours éteindre le PC directement**
- Aucun risque de corruption
- Docker gère l'arrêt propre automatiquement

---

**Date de création** : 12 novembre 2026  
**Projet** : DevAfrica Connect

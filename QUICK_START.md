# ⚡ Démarrage Rapide - CADEV

## 🚀 Installation en 3 minutes

### 1️⃣ Backend (Terminal 1)

```bash
cd backend/Bcadev
cp .env.example .env
# Éditer .env : ajouter une SECRET_KEY
docker-compose up --build
```

**Attendre que vous voyez** : `Starting development server at http://0.0.0.0:8000/`

### 2️⃣ Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Attendre que vous voyez** : `Local: http://localhost:5173/`

### 3️⃣ Accéder à l'application

Ouvrir dans le navigateur : **http://localhost:5173**

---

## 🎯 Démarrage quotidien

### Terminal 1
```bash
cd backend/Bcadev
docker-compose up
```

### Terminal 2
```bash
cd frontend
npm run dev
```

---

## 🛑 Arrêt

- **Terminal 1** : `Ctrl+C`
- **Terminal 2** : `Ctrl+C`

---

## 🆘 Problèmes courants

### ❌ "Port 5432 already in use"
```bash
# Arrêter PostgreSQL local
# OU changer le port dans docker-compose.yml
```

### ❌ "Cannot connect to Docker daemon"
```bash
# Démarrer Docker Desktop
```

### ❌ "404 Not Found" sur les API
```bash
# Vérifier que le backend tourne sur http://localhost:8000
# Vérifier les logs : docker-compose logs web
```

### ❌ Réinitialiser la base de données
```bash
docker-compose down -v
docker-compose up --build
```

---

## 📚 Documentation complète

- **Installation détaillée** : `backend/Bcadev/Readme.txt`
- **Architecture** : `README.md`
- **Docker** : `docker-compose.yml`

---

## ✨ Fonctionnalités disponibles

✅ Forum avec posts et commentaires  
✅ Offres d'emploi (CDI, CDD, Stage, Freelance)  
✅ Candidatures avec CV  
✅ Recherche de développeurs  
✅ Profils utilisateurs  
✅ Modération IA  

---

**Bon développement ! 🎉**

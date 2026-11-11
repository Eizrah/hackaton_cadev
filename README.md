# 🌍 CADEV - Plateforme de mise en relation des développeurs africains

Plateforme web permettant de mettre en relation des développeurs africains avec des opportunités d'emploi, favorisant la collaboration et le partage de connaissances.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)
- [Contribution](#-contribution)

## ✨ Fonctionnalités

### 👤 Gestion des profils
- Création et personnalisation de profil développeur
- Compétences, expériences et portfolio
- Certifications et diplômes

### 💬 Forum communautaire
- Publication de posts avec fichiers et liens
- Système de commentaires et réponses
- Likes et enregistrements
- Modération automatique par IA

### 💼 Offres d'emploi
- Publication d'offres (CDI, CDD, Stage, Freelance)
- Candidatures avec CV et lettre de motivation
- Gestion des candidatures (accepter/refuser/en attente)
- Filtres avancés (Remote, Hybride, Sur site)
- Notifications pour les recruteurs et candidats

### 🔍 Recherche
- Recherche de développeurs par pseudo et compétences
- Recherche de posts dans le forum
- Recherche d'offres d'emploi par mots-clés

### 🤖 Modération IA
- Vérification automatique du contenu
- Détection de spam et contenu inapproprié
- Validation des offres d'emploi

## 🛠️ Technologies

### Backend
- **Django 5.1** - Framework Python
- **Django REST Framework** - API REST
- **PostgreSQL 17** - Base de données
- **Anthropic Claude** - Modération IA

### Frontend
- **React 18** - Framework JavaScript
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration
- **Nginx** - Serveur web (production)

## 📦 Installation

### Prérequis

- Docker Desktop installé et démarré
- Git
- Ports disponibles : 5432, 8000, 5173

### Installation rapide

```bash
# 1. Cloner le projet
git clone https://github.com/Eizrah/hackaton_cadev.git
cd hackaton_cadev

# 2. Backend
cd backend/Bcadev
cp .env.example .env
# Éditer .env avec vos propres valeurs
docker-compose up --build

# 3. Frontend (nouveau terminal)
cd ../../frontend
npm install
npm run dev
```

📖 **Guide complet** : Voir `backend/Bcadev/Readme.txt`

## 🚀 Utilisation

### Démarrage

**Terminal 1 - Backend :**
```bash
cd backend/Bcadev
docker-compose up
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### Accès

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000/api/
- **Admin Django** : http://localhost:8000/admin

### Créer un compte admin

```bash
docker-compose exec web python manage.py createsuperuser
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│              React + TypeScript                 │
│              http://localhost:5173              │
└────────────────────┬────────────────────────────┘
                     │
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────┐
│                   BACKEND                       │
│                 Django REST API                 │
│              http://localhost:8000              │
└────────────────────┬────────────────────────────┘
                     │
                     │ SQL
                     ▼
┌─────────────────────────────────────────────────┐
│                  DATABASE                       │
│                 PostgreSQL 17                   │
│              Port: 5432                         │
└─────────────────────────────────────────────────┘
```

### Structure du projet

```
Cadev/
├── backend/Bcadev/          # Backend Django
│   ├── Accounts/           # Gestion utilisateurs
│   ├── Forum/              # Publications et commentaires
│   ├── Jobs/               # Offres d'emploi et candidatures
│   ├── Agents/             # Services IA
│   ├── Bcadev/             # Configuration Django
│   ├── manage.py
│   ├── requirements.txt
│   └── docker-compose.yml
│
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── api/           # Appels API
│   │   ├── data/          # Types et modèles
│   │   └── lib/           # Utilitaires
│   ├── package.json
│   └── vite.config.ts
│
└── conception/            # Diagrammes UML
```

## 🔧 Commandes utiles

### Backend (Django)

```bash
# Migrations
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate

# Créer un superuser
docker-compose exec web python manage.py createsuperuser

# Shell Django
docker-compose exec web python manage.py shell

# Logs
docker-compose logs -f web

# Collecter les fichiers statiques
docker-compose exec web python manage.py collectstatic
```

### Frontend (React)

```bash
# Installer une dépendance
npm install package-name

# Build production
npm run build

# Linter
npm run lint

# Tests
npm run test
```

### Base de données

```bash
# Connexion PostgreSQL
docker-compose exec db psql -U postgres -d cadedb

# Backup
docker-compose exec db pg_dump -U postgres cadedb > backup.sql

# Restore
docker-compose exec -T db psql -U postgres cadedb < backup.sql
```

## 🐛 Résolution de problèmes

### Backend ne démarre pas

```bash
# Reconstruire les images
docker-compose down
docker-compose up --build

# Vérifier les logs
docker-compose logs web
```

### Frontend ne se connecte pas au backend

Vérifier dans `frontend/src/api/client.ts` :
```typescript
const baseURL = 'http://localhost:8000/api/'
```

### Port déjà utilisé

Modifier les ports dans `docker-compose.yml` :
```yaml
ports:
  - "8001:8000"  # Backend sur port 8001
```

### Base de données corrompue

```bash
# Reset complet
docker-compose down -v
docker-compose up --build
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 👥 Équipe

- **Développement** : Eizrah
- **Design** : Équipe Cadev

## 📞 Contact

- **GitHub** : [Eizrah](https://github.com/Eizrah)
- **Email** : support@cadev.com

---

⭐ N'hésitez pas à mettre une étoile si ce projet vous plaît !

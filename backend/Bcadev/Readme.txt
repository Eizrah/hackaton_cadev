
========================================
   CADEV - GUIDE DE DÉMARRAGE
========================================

Ce projet est une plateforme de mise en relation de développeurs africains avec des opportunités d'emploi.
L'application est composée de :
  - Backend Django (API REST)
  - Frontend React + Vite
  - Base de données PostgreSQL

----------------------------------------
  PRÉREQUIS
----------------------------------------

1. Docker Desktop (OBLIGATOIRE)
   - Téléchargement : https://www.docker.com/products/docker-desktop
   - Installer et DÉMARRER Docker Desktop avant de lancer les commandes
   - Vérifier que Docker tourne : docker --version

2. Git
   - Téléchargement : https://git-scm.com/downloads
   - Nécessaire pour cloner le projet

3. Ports requis (vérifier qu'ils sont libres) :
   - Port 5432 : PostgreSQL
   - Port 8000 : Backend Django
   - Port 5173 : Frontend React (en développement)

----------------------------------------
  INSTALLATION COMPLÈTE
----------------------------------------

📌 ÉTAPE 1 : Cloner le projet

   git clone https://github.com/Eizrah/hackaton_cadev.git
   cd hackaton_cadev

📌 ÉTAPE 2 : Configuration Backend

   cd backend/Bcadev

   A. Créer le fichier .env :
      - Copier le fichier .env.example et le renommer en .env
      - OU créer un nouveau fichier .env avec ce contenu :

      ╔════════════════════════════════════════════╗
      ║ Exemple de fichier .env                    ║
      ╚════════════════════════════════════════════╝

      # Django Configuration
      CLE_SECRET=votre-cle-secrete-a-generer
      DEBUG=True
      ALLOWED_HOSTS=localhost,127.0.0.1

      # Database Configuration
      DB_NAME=cadedb
      DB_USER=postgres
      DB_PASSWORD=postgres123
      DB_HOST=db
      DB_PORT=5432

   B. Générer une clé secrète Django :
      Dans un terminal Python ou dans la console :

      python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

      Copiez la clé générée et remplacez "votre-cle-secrete-a-generer" dans le .env

📌 ÉTAPE 3 : Démarrage avec Docker

   ⚠️ IMPORTANT : Assurez-vous que Docker Desktop est lancé !

   # Rester dans le dossier backend/Bcadev
   docker-compose up --build

   ⏱️ Attendez quelques minutes (première fois seulement)

   ✅ Ce qui démarre :
      ┌────────────────────────────────────────────┐
      │ 1. PostgreSQL (Base de données)            │
      │    - Port : 5432                           │
      │    - Container : bcadev-db-1               │
      │                                            │
      │ 2. Django Backend (API)                    │
      │    - Port : 8000                           │
      │    - Container : bcadev-web-1              │
      │    - Migrations automatiques               │
      │    - Collectstatic automatique             │
      └────────────────────────────────────────────┘

   ✅ Vérification :
      - Logs : Vous devriez voir "Starting development server at http://0.0.0.0:8000/"
      - Navigateur : http://localhost:8000/admin (page d'admin Django)
      - API : http://localhost:8000/api/

📌 ÉTAPE 4 : Démarrage Frontend (dans un NOUVEAU terminal)

   # Retourner à la racine du projet
   cd ../../frontend

   A. Installer les dépendances (première fois uniquement) :
      npm install

   B. Lancer le serveur de développement :
      npm run dev

   ✅ Ce qui démarre :
      ┌────────────────────────────────────────────┐
      │ React + Vite (Frontend)                    │
      │    - Port : 5173                           │
      │    - URL : http://localhost:5173           │
      │    - Hot reload activé                     │
      └────────────────────────────────────────────┘

   ✅ Vérification :
      - Navigateur : http://localhost:5173
      - Vous devriez voir la page d'accueil de Cadev

📌 ÉTAPE 5 : Créer un compte admin (OPTIONNEL)

   Dans le terminal du backend :
   docker-compose exec web python manage.py createsuperuser

   Remplissez :
   - Email
   - Pseudo
   - Mot de passe

   Accédez à l'admin : http://localhost:8000/admin

----------------------------------------
  DÉMARRAGE QUOTIDIEN (après première installation)
----------------------------------------

🔄 POUR REDÉMARRER LE PROJET :

1. Terminal 1 - Backend :
   cd backend/Bcadev
   docker-compose up

2. Terminal 2 - Frontend :
   cd frontend
   npm run dev

✅ C'est tout ! Le projet est lancé.

----------------------------------------
  ARRÊT DU PROJET
----------------------------------------

🛑 Backend :
   - Dans le terminal du backend : Ctrl+C
   - OU : docker-compose down

🛑 Frontend :
   - Dans le terminal du frontend : Ctrl+C

🗑️ Nettoyage complet (supprime les conteneurs) :
   docker-compose down -v
   ⚠️ Cette commande supprime aussi la base de données !

----------------------------------------
  COMMANDES UTILES
----------------------------------------

📊 BACKEND (Django)

   # Voir les logs en temps réel
   docker-compose logs -f web

   # Accéder au shell Django
   docker-compose exec web python manage.py shell

   # Créer des migrations après changements de models
   docker-compose exec web python manage.py makemigrations

   # Appliquer les migrations
   docker-compose exec web python manage.py migrate

   # Créer un superuser
   docker-compose exec web python manage.py createsuperuser

   # Collecter les fichiers statiques
   docker-compose exec web python manage.py collectstatic

   # Accéder au bash du conteneur
   docker-compose exec web bash

📊 BASE DE DONNÉES

   # Se connecter à PostgreSQL
   docker-compose exec db psql -U postgres -d cadedb

   # Sauvegarder la base de données
   docker-compose exec db pg_dump -U postgres cadedb > backup.sql

   # Restaurer une sauvegarde
   docker-compose exec -T db psql -U postgres cadedb < backup.sql

📊 FRONTEND (React)

   # Installer une nouvelle dépendance
   npm install nom-du-package

   # Build pour production
   npm run build

   # Preview du build
   npm run preview

   # Linter
   npm run lint

----------------------------------------
  ARCHITECTURE DU PROJET
----------------------------------------

Cadev/
├── backend/Bcadev/          # Backend Django
│   ├── Accounts/           # Gestion utilisateurs
│   ├── Forum/              # Publications forum
│   ├── Jobs/               # Offres d'emploi
│   ├── Agents/             # Modération IA
│   ├── Bcadev/             # Configuration Django
│   ├── manage.py           # CLI Django
│   ├── requirements.txt    # Dépendances Python
│   ├── Dockerfile          # Image Docker backend
│   └── docker-compose.yml  # Orchestration Docker
│
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── api/           # Appels API
│   │   └── App.tsx        # Composant principal
│   ├── package.json       # Dépendances Node
│   └── vite.config.ts     # Configuration Vite
│
└── conception/            # Diagrammes UML

----------------------------------------
  FONCTIONNALITÉS PRINCIPALES
----------------------------------------

✨ FORUM
   - Publication de posts
   - Commentaires et réponses
   - Likes et enregistrements
   - Modération par IA

✨ OFFRES D'EMPLOI
   - Création d'offres (CDI, CDD, Stage, Freelance)
   - Candidatures avec CV et lettre de motivation
   - Gestion des candidatures (accepter/refuser)
   - Filtres par type de travail (Remote, Hybride, Sur site)

✨ PROFILS
   - Compétences et expériences
   - Portfolio et certifications
   - Statistiques personnelles

✨ RECHERCHE
   - Recherche de développeurs par pseudo
   - Recherche de posts
   - Recherche d'offres d'emploi

----------------------------------------
  RÉSOLUTION DE PROBLÈMES
----------------------------------------

🐛 Problème : "Port 5432 already in use"
   Solution : Arrêter PostgreSQL local ou changer le port dans docker-compose.yml

🐛 Problème : "Cannot connect to Docker daemon"
   Solution : Démarrer Docker Desktop

🐛 Problème : Les modifications backend ne s'appliquent pas
   Solution : 
   - Ctrl+C dans le terminal backend
   - docker-compose down
   - docker-compose up --build

🐛 Problème : Erreur 404 sur les API
   Solution : Vérifier que le backend tourne sur http://localhost:8000

🐛 Problème : Frontend ne charge pas les données
   Solution : Vérifier l'URL de l'API dans le fichier frontend/src/api/client.ts

🐛 Problème : Base de données corrompue
   Solution : 
   - docker-compose down -v
   - docker-compose up --build
   - Recréer le superuser

----------------------------------------
  SUPPORT
----------------------------------------

📧 Email : support@cadev.com
🐙 GitHub Issues : https://github.com/Eizrah/hackaton_cadev/issues
📚 Documentation : Voir le dossier /docs

========================================
   BON DÉVELOPPEMENT ! 🚀
========================================

# 🚀 Déploiement Cadev - Configuration Optimisée (1 vCPU / 2GB RAM)

Ce guide est spécifiquement adapté pour un serveur avec **ressources limitées**.

---

## ⚙️ Optimisations appliquées

### 1. **Gunicorn** (Backend Django)
- ✅ **2 workers** au lieu de 4
- ✅ **2 threads** par worker
- ✅ Redémarrage automatique après 1000 requêtes (évite les fuites mémoire)
- ✅ Timeout de 120 secondes

### 2. **PostgreSQL**
- ✅ Limité à **512 MB RAM**
- ✅ 30% du CPU maximum

### 3. **Docker Compose**
- ✅ Limites mémoire strictes pour chaque service
- ✅ Répartition intelligente du CPU

### 4. **Compilateur de code**
- ✅ Téléchargement d'images **essentielles uniquement** (Python + JavaScript)
- ✅ Images complètes (Java, C++, PHP) optionnelles

---

## 📋 Installation sur Systalink

### 1. Se connecter au serveur

```bash
ssh root@VOTRE_IP_SYSTALINK
```

### 2. Installer Docker et Docker Compose

```bash
# Mettre à jour
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Installer Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Vérifier
docker --version
docker-compose --version
```

### 3. Installer Node.js (pour build frontend)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version
```

### 4. Créer un utilisateur dédié

```bash
adduser cadev
usermod -aG docker cadev
su - cadev
```

### 5. Cloner le projet

```bash
cd ~
git clone https://github.com/Eizrah/hackaton_cadev.git cadev
cd cadev
```

---

## ⚙️ Configuration

### 1. Backend - Créer `.env.production`

```bash
cd backend/Bcadev
nano .env.production
```

**Contenu** (remplacez les valeurs) :

```env
# Django
CLE_SECRET=VOTRE_CLE_SECRETE_LONGUE_ICI
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com,VOTRE_IP_SERVEUR
CORS_ALLOWED_ORIGINS=https://votre-domaine.com,http://VOTRE_IP_SERVEUR
CSRF_TRUSTED_ORIGINS=https://votre-domaine.com,http://VOTRE_IP_SERVEUR

# Base de données
DB_NAME=cadev_prod
DB_USER=cadev_user
DB_PASSWORD=MOT_DE_PASSE_SECURISE
DB_HOST=db
DB_PORT=5432

# OAuth Google
GOOGLE_CLIENT_ID=VOTRE_CLIENT_ID
GOOGLE_CLIENT_SECRET=VOTRE_SECRET

# OAuth GitHub
GITHUB_CLIENT_ID=VOTRE_CLIENT_ID
GITHUB_CLIENT_SECRET=VOTRE_SECRET

# Frontend
FRONTEND_URL=https://votre-domaine.com

# IA
GROQ_API_KEY=VOTRE_CLE
OPENROUTER_API_KEY=VOTRE_CLE
GROQ_MODEL_VERIFICATION=openai/gpt-oss-20b
GROQ_MODEL_ASSISTANT=openai/gpt-oss-20b
OPENROUTER_MODEL_FALLBACK=mistralai/mistral-7b-instruct

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=VOTRE_MOT_DE_PASSE_APP
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@votre-domaine.com
```

**💡 Générer une clé secrète :**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 2. Frontend - Créer `.env.production`

```bash
cd ~/cadev/frontend
nano .env.production
```

**Contenu :**
```env
VITE_API_URL=https://votre-domaine.com
VITE_AUTH_MODE=api
VITE_AGENT_MODE=api
```

### 3. Modifier `nginx.conf`

```bash
cd ~/cadev/backend/Bcadev
nano nginx.conf
```

Remplacez **toutes les occurrences** de `votre-domaine.com` par votre domaine réel.

---

## 🚀 Déploiement

### 1. Build du frontend

```bash
cd ~/cadev/frontend
npm install --production
npm run build
```

⏳ **Temps estimé** : 5-10 minutes

### 2. Copier le build

```bash
cd ~/cadev
mkdir -p backend/Bcadev/frontend-build
cp -r frontend/dist/* backend/Bcadev/frontend-build/
```

### 3. Lancer les services

```bash
cd ~/cadev/backend/Bcadev
docker-compose -f docker-compose.production.yml up -d --build
```

⏳ **Temps estimé** : 10-15 minutes (téléchargement images + build)

### 4. Attendre que tout soit prêt

```bash
# Surveiller les logs
docker-compose -f docker-compose.production.yml logs -f
```

Attendez de voir : `Booting worker with pid: XXX` (Gunicorn démarré)

### 5. Migrations

```bash
docker-compose -f docker-compose.production.yml exec web python manage.py migrate
```

### 6. Créer un superutilisateur

```bash
docker-compose -f docker-compose.production.yml exec web python manage.py createsuperuser
```

### 7. Collecter les fichiers statiques

```bash
docker-compose -f docker-compose.production.yml exec web python manage.py collectstatic --noinput
```

### 8. Télécharger les images Docker ESSENTIELLES

```bash
docker-compose -f docker-compose.production.yml exec web python manage.py pull_essential_images
```

⏳ **Temps estimé** : 5-10 minutes (Python + JavaScript uniquement)

---

## ✅ Vérification

### 1. Tester l'API

```bash
curl http://localhost/api/forum/posts/
```

Vous devez voir du JSON.

### 2. Accéder au site

Ouvrez dans le navigateur : `http://VOTRE_IP_SERVEUR`

### 3. Tester l'admin

`http://VOTRE_IP_SERVEUR/admin/`

---

## 🔒 Sécurité (IMPORTANT)

### 1. Pare-feu

```bash
# Revenir en root
exit

# Configurer UFW
apt install ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Fail2ban

```bash
apt install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 📊 Surveillance des ressources

### Voir l'utilisation mémoire

```bash
docker stats
```

### Voir les logs

```bash
# Backend
docker-compose -f docker-compose.production.yml logs -f web

# Base de données
docker-compose -f docker-compose.production.yml logs -f db

# Nginx
docker-compose -f docker-compose.production.yml logs -f nginx
```

---

## ⚠️ Limitations avec 1 vCPU / 2GB RAM

| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| **Inscription/Connexion** | ✅ Fonctionne | |
| **Communauté/Posts** | ✅ Fonctionne | |
| **Messagerie** | ✅ Fonctionne | |
| **Compilateur Python** | ✅ Fonctionne | Peut être lent |
| **Compilateur JavaScript** | ✅ Fonctionne | |
| **Compilateur Java/C++** | ⚠️ Lent | Optionnel |
| **10-20 utilisateurs simultanés** | ✅ OK | |
| **50+ utilisateurs simultanés** | ❌ Trop lent | Besoin upgrade |

---

## 🔄 Mises à jour

```bash
cd ~/cadev
git pull origin main

# Rebuild frontend
cd frontend && npm install && npm run build && cd ..
cp -r frontend/dist/* backend/Bcadev/frontend-build/

# Redéployer backend
cd backend/Bcadev
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
docker-compose -f docker-compose.production.yml exec web python manage.py migrate
docker-compose -f docker-compose.production.yml exec web python manage.py collectstatic --noinput
```

---

## 🚨 En cas de problème

### Serveur lent ou qui freeze

```bash
# Redémarrer les services
docker-compose -f docker-compose.production.yml restart

# Si ça ne suffit pas, tout recréer
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

### Manque d'espace disque

```bash
# Nettoyer les images Docker inutilisées
docker system prune -a

# Nettoyer les logs
truncate -s 0 /var/lib/docker/containers/*/*-json.log
```

### Erreur de mémoire

```bash
# Ajouter du swap (mémoire virtuelle)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

---

## 💰 Quand upgrader ?

Envisagez d'upgrader vers 4GB RAM si :
- ✅ Vous avez **plus de 20 utilisateurs actifs** régulièrement
- ✅ Le serveur est **souvent lent**
- ✅ Vous voulez activer **tous les langages** du compilateur
- ✅ Vous voulez ajouter **des fonctionnalités IA** gourmandes

---

**Bon déploiement ! 🚀**

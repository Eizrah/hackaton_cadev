# 🚀 Guide de déploiement Cadev sur Systalink

## 📋 Prérequis sur le serveur

1. **Ubuntu 20.04+ ou Debian 11+**
2. **Docker** et **Docker Compose** installés
3. **Git** installé
4. **Nom de domaine** configuré pointant vers votre serveur
5. **Ports ouverts** : 80 (HTTP) et 443 (HTTPS)

---

## 🛠️ Installation initiale sur le serveur

### 1. Se connecter au serveur

```bash
ssh root@votre-serveur-systalink
```

### 2. Installer Docker

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Démarrer Docker
systemctl start docker
systemctl enable docker

# Vérifier
docker --version
```

### 3. Installer Docker Compose

```bash
# Télécharger Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Rendre exécutable
chmod +x /usr/local/bin/docker-compose

# Vérifier
docker-compose --version
```

### 4. Créer un utilisateur pour l'application

```bash
# Créer l'utilisateur cadev
adduser cadev
usermod -aG docker cadev

# Se connecter en tant que cadev
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

### 1. Créer le fichier `.env.production` backend

```bash
cd backend/Bcadev
nano .env.production
```

Copier ce contenu et **remplacer les valeurs** :

```env
# Django
CLE_SECRET=GENERER_UNE_CLE_SECRETE_LONGUE_ET_ALEATOIRE
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com
CORS_ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
CSRF_TRUSTED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com

# Base de données
DB_NAME=cadev_prod
DB_USER=cadev_user
DB_PASSWORD=MOT_DE_PASSE_SECURISE_ICI
DB_HOST=db
DB_PORT=5432

# OAuth Google
GOOGLE_CLIENT_ID=VOTRE_CLIENT_ID_GOOGLE
GOOGLE_CLIENT_SECRET=VOTRE_SECRET_GOOGLE

# OAuth GitHub
GITHUB_CLIENT_ID=VOTRE_CLIENT_ID_GITHUB
GITHUB_CLIENT_SECRET=VOTRE_SECRET_GITHUB

# Frontend
FRONTEND_URL=https://votre-domaine.com

# IA
GROQ_API_KEY=VOTRE_CLE_GROQ
OPENROUTER_API_KEY=VOTRE_CLE_OPENROUTER
GROQ_MODEL_VERIFICATION=openai/gpt-oss-20b
GROQ_MODEL_ASSISTANT=openai/gpt-oss-20b
OPENROUTER_MODEL_FALLBACK=mistralai/mistral-7b-instruct

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=MOT_DE_PASSE_APPLICATION_GMAIL
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@votre-domaine.com
```

**💡 Pour générer une clé secrète Django :**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2. Modifier nginx.conf

```bash
nano nginx.conf
```

Remplacer **toutes les occurrences** de `votre-domaine.com` par votre vrai domaine.

### 3. Créer le fichier `.env` frontend

```bash
cd ../../frontend
nano .env.production
```

Contenu :
```env
VITE_API_URL=https://votre-domaine.com
VITE_AUTH_MODE=api
VITE_AGENT_MODE=api
```

---

## 🚀 Premier déploiement

### 1. Build du frontend

```bash
cd ~/cadev/frontend
npm install
npm run build
```

### 2. Copier le build vers nginx

```bash
cd ~/cadev
mkdir -p backend/Bcadev/frontend-build
cp -r frontend/dist/* backend/Bcadev/frontend-build/
```

### 3. Mettre à jour nginx.conf pour servir le frontend

Modifier `backend/Bcadev/nginx.conf` pour ajouter le volume du frontend dans docker-compose :

```yaml
volumes:
  - ./frontend-build:/usr/share/nginx/html:ro
```

### 4. Obtenir un certificat SSL (Let's Encrypt)

**Avant de lancer les conteneurs**, obtenir le certificat :

```bash
cd ~/cadev/backend/Bcadev

# Créer les dossiers certbot
mkdir -p certbot/conf certbot/www

# Modifier temporairement nginx.conf pour écouter sur HTTP uniquement
# (commentez la section HTTPS)

# Lancer nginx temporairement
docker compose -f docker-compose.production.yml up -d nginx

# Obtenir le certificat
docker compose -f docker-compose.production.yml run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email votre-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d votre-domaine.com \
  -d www.votre-domaine.com

# Arrêter nginx
docker compose -f docker-compose.production.yml down

# Décommenter la section HTTPS dans nginx.conf
```

### 5. Lancer tous les services

```bash
cd ~/cadev/backend/Bcadev
docker compose -f docker-compose.production.yml up -d --build
```

### 6. Appliquer les migrations

```bash
docker compose -f docker-compose.production.yml exec web python manage.py migrate
```

### 7. Créer un superutilisateur

```bash
docker compose -f docker-compose.production.yml exec web python manage.py createsuperuser
```

### 8. Collecter les fichiers statiques

```bash
docker compose -f docker-compose.production.yml exec web python manage.py collectstatic --noinput
```

### 9. Télécharger les images Docker pour le compilateur

```bash
docker compose -f docker-compose.production.yml exec web python manage.py pull_docker_images
```

---

## ✅ Vérification

1. **Frontend** : https://votre-domaine.com
2. **API** : https://votre-domaine.com/api/forum/posts/
3. **Admin** : https://votre-domaine.com/admin/

---

## 🔄 Mises à jour futures

Utilisez le script automatique :

```bash
cd ~/cadev
chmod +x deploy.sh
./deploy.sh
```

Ou manuellement :

```bash
cd ~/cadev
git pull origin main
cd frontend && npm install && npm run build && cd ..
cp -r frontend/dist/* backend/Bcadev/frontend-build/
cd backend/Bcadev
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d --build
docker compose -f docker-compose.production.yml exec web python manage.py migrate
docker compose -f docker-compose.production.yml exec web python manage.py collectstatic --noinput
```

---

## 📊 Commandes utiles

```bash
# Voir les logs
docker compose -f docker-compose.production.yml logs -f web
docker compose -f docker-compose.production.yml logs -f nginx

# Redémarrer un service
docker compose -f docker-compose.production.yml restart web
docker compose -f docker-compose.production.yml restart nginx

# Voir l'état des conteneurs
docker compose -f docker-compose.production.yml ps

# Accéder au shell Django
docker compose -f docker-compose.production.yml exec web python manage.py shell

# Backup de la base de données
docker compose -f docker-compose.production.yml exec db pg_dump -U cadev_user cadev_prod > backup.sql
```

---

## 🔒 Sécurité

### Pare-feu (UFW)

```bash
# Installer UFW
apt install ufw

# Configurer
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Fail2ban (protection contre brute-force)

```bash
apt install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 🐛 Dépannage

### Erreur de connexion à la base de données

```bash
# Vérifier que la DB tourne
docker compose -f docker-compose.production.yml ps db

# Voir les logs
docker compose -f docker-compose.production.yml logs db
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que Django tourne
docker compose -f docker-compose.production.yml ps web

# Voir les logs
docker compose -f docker-compose.production.yml logs web
```

### Certificat SSL expiré

```bash
# Renouveler manuellement
docker compose -f docker-compose.production.yml run --rm certbot renew
docker compose -f docker-compose.production.yml restart nginx
```

---

## 📞 Support

En cas de problème, vérifiez :
1. Les logs des conteneurs
2. Le fichier `.env.production` 
3. Les DNS pointent bien vers le serveur
4. Les ports 80 et 443 sont ouverts

---

**Bon déploiement ! 🚀**

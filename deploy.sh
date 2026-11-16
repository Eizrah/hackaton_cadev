#!/bin/bash

# ========================================
# Script de déploiement Cadev sur Systalink
# ========================================

set -e  # Arrêter en cas d'erreur

echo "🚀 Début du déploiement Cadev..."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Vérifier les prérequis
echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker n'est pas installé${NC}"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}❌ Git n'est pas installé${NC}"; exit 1; }
echo -e "${GREEN}✅ Prérequis OK${NC}"

# 2. Mettre à jour le code depuis GitHub
echo -e "${YELLOW}📥 Récupération du code depuis GitHub...${NC}"
git pull origin main
echo -e "${GREEN}✅ Code mis à jour${NC}"

# 3. Build du frontend
echo -e "${YELLOW}🏗️  Build du frontend React...${NC}"
cd frontend
npm install
npm run build
echo -e "${GREEN}✅ Frontend buildé${NC}"

# 4. Copier le build frontend vers nginx
echo -e "${YELLOW}📦 Copie du build vers le dossier nginx...${NC}"
cd ..
mkdir -p backend/Bcadev/frontend-build
cp -r frontend/dist/* backend/Bcadev/frontend-build/
echo -e "${GREEN}✅ Build copié${NC}"

# 5. Vérifier le fichier .env.production
cd backend/Bcadev
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Fichier .env.production manquant !${NC}"
    echo "Créez-le à partir de .env.production.example"
    exit 1
fi
echo -e "${GREEN}✅ Fichier .env.production trouvé${NC}"

# 6. Arrêter les anciens conteneurs
echo -e "${YELLOW}🛑 Arrêt des anciens conteneurs...${NC}"
docker compose -f docker-compose.production.yml down

# 7. Construire les nouvelles images
echo -e "${YELLOW}🔨 Construction des images Docker...${NC}"
docker compose -f docker-compose.production.yml build --no-cache

# 8. Démarrer les services
echo -e "${YELLOW}🚀 Démarrage des services...${NC}"
docker compose -f docker-compose.production.yml up -d

# 9. Attendre que la DB soit prête
echo -e "${YELLOW}⏳ Attente de la base de données...${NC}"
sleep 10

# 10. Appliquer les migrations
echo -e "${YELLOW}🗃️  Application des migrations...${NC}"
docker compose -f docker-compose.production.yml exec -T web python manage.py migrate

# 11. Collecter les fichiers statiques
echo -e "${YELLOW}📁 Collecte des fichiers statiques...${NC}"
docker compose -f docker-compose.production.yml exec -T web python manage.py collectstatic --noinput

# 12. Télécharger les images Docker pour le compilateur
echo -e "${YELLOW}📦 Téléchargement des images pour le compilateur...${NC}"
docker compose -f docker-compose.production.yml exec -T web python manage.py pull_docker_images

# 13. Vérifier l'état des services
echo -e "${YELLOW}🔍 Vérification de l'état des services...${NC}"
docker compose -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}✨ Déploiement terminé avec succès !${NC}"
echo ""
echo "📊 Services déployés :"
echo "  - Frontend : https://votre-domaine.com"
echo "  - API : https://votre-domaine.com/api/"
echo "  - Admin : https://votre-domaine.com/admin/"
echo ""
echo "🔧 Commandes utiles :"
echo "  Logs backend : docker compose -f docker-compose.production.yml logs -f web"
echo "  Logs nginx : docker compose -f docker-compose.production.yml logs -f nginx"
echo "  Redémarrer : docker compose -f docker-compose.production.yml restart"
echo ""

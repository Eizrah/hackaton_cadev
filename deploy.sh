#!/bin/bash

# Script de déploiement automatique pour Cadev
# Usage: ./deploy.sh [dev|prod]

set -e  # Arrêter en cas d'erreur

ENV=${1:-dev}

echo "🚀 Déploiement Cadev en mode: $ENV"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ "$ENV" = "prod" ]; then
    echo -e "${YELLOW}⚠️  Mode PRODUCTION${NC}"
    
    # Vérifier que .env existe
    if [ ! -f "backend/Bcadev/.env" ]; then
        echo -e "${RED}❌ Erreur: backend/Bcadev/.env n'existe pas${NC}"
        echo "Créez-le à partir de .env.example"
        exit 1
    fi
    
    # Vérifier que DEBUG=False
    if grep -q "DEBUG=True" backend/Bcadev/.env; then
        echo -e "${RED}❌ Erreur: DEBUG=True dans .env${NC}"
        echo "Changez DEBUG=False pour la production"
        exit 1
    fi
    
    COMPOSE_FILE="docker-compose.prod.yml"
else
    echo -e "${GREEN}🔧 Mode DÉVELOPPEMENT${NC}"
    COMPOSE_FILE="docker-compose.yml"
fi

# Arrêter les conteneurs existants
echo "⏹️  Arrêt des conteneurs existants..."
docker-compose -f $COMPOSE_FILE down

# Nettoyer les images non utilisées
echo "🧹 Nettoyage des images Docker..."
docker system prune -f

# Build les nouvelles images
echo "🔨 Construction des images Docker..."
docker-compose -f $COMPOSE_FILE build --no-cache

# Démarrer les conteneurs
echo "▶️  Démarrage des conteneurs..."
docker-compose -f $COMPOSE_FILE up -d

# Attendre que la DB soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Migrations Django
echo "📊 Application des migrations..."
docker exec cadev_backend python manage.py migrate --noinput

# Collecte des fichiers statiques
if [ "$ENV" = "prod" ]; then
    echo "📦 Collecte des fichiers statiques..."
    docker exec cadev_backend python manage.py collectstatic --noinput
fi

# Afficher le statut
echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📊 Statut des conteneurs:"
docker-compose -f $COMPOSE_FILE ps

echo ""
echo "📝 Pour voir les logs:"
echo "   docker-compose -f $COMPOSE_FILE logs -f"
echo ""
echo "🌐 Application accessible sur:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:8000"

if [ "$ENV" = "prod" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  N'oubliez pas de:${NC}"
    echo "   1. Créer un superuser: docker exec -it cadev_backend python manage.py createsuperuser"
    echo "   2. Configurer le firewall"
    echo "   3. Configurer SSL/HTTPS"
    echo "   4. Configurer les backups automatiques"
fi

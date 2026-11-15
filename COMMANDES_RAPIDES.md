# 🚀 Commandes Rapides Cadev

## Démarrage rapide

```bash
# Développement
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Avec le script
./deploy.sh prod
```

## Gestion des conteneurs

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Redémarrer tout
docker-compose restart

# Redémarrer un service
docker-compose restart backend
docker-compose restart frontend

# Voir le statut
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Logs d'un service
docker-compose logs -f backend
```

## Django Management

```bash
# Migrations
docker exec cadev_backend python manage.py makemigrations
docker exec cadev_backend python manage.py migrate

# Superuser
docker exec -it cadev_backend python manage.py createsuperuser

# Shell Django
docker exec -it cadev_backend python manage.py shell

# Statiques
docker exec cadev_backend python manage.py collectstatic --noinput
```

## Base de données

```bash
# Backup
docker exec cadev_db pg_dump -U cadev_user cadev_prod > backup.sql

# Restore
cat backup.sql | docker exec -i cadev_db psql -U cadev_user cadev_prod

# Accès psql
docker exec -it cadev_db psql -U cadev_user -d cadev_prod

# Voir les tables
docker exec -it cadev_db psql -U cadev_user -d cadev_prod -c "\dt"
```

## Mise à jour

```bash
cd /opt/cadev
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
docker exec cadev_backend python manage.py migrate
docker exec cadev_backend python manage.py collectstatic --noinput
```

## Monitoring

```bash
# Stats des conteneurs
docker stats

# Espace disque
docker system df

# Nettoyer
docker system prune -a

# Voir les volumes
docker volume ls

# Inspecter un conteneur
docker inspect cadev_backend
```

## Debugging

```bash
# Entrer dans un conteneur
docker exec -it cadev_backend bash
docker exec -it cadev_frontend sh

# Voir les variables d'environnement
docker exec cadev_backend env

# Tester la connexion DB depuis le backend
docker exec cadev_backend python manage.py dbshell

# Vérifier nginx
docker exec cadev_frontend nginx -t
```

## Sécurité

```bash
# Firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# SSL
sudo certbot renew --dry-run
sudo certbot certificates

# Permissions
docker exec cadev_backend ls -la /app/media
docker exec cadev_backend chown -R 1000:1000 /app/media
```

## One-liners utiles

```bash
# Redémarrer tout en prod
docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d

# Voir les erreurs backend
docker-compose logs backend | grep ERROR

# Compter les utilisateurs
docker exec -it cadev_db psql -U cadev_user cadev_prod -c "SELECT COUNT(*) FROM accounts_developper;"

# Taille de la DB
docker exec -it cadev_db psql -U cadev_user cadev_prod -c "SELECT pg_size_pretty(pg_database_size('cadev_prod'));"

# Rebuild complet
docker-compose -f docker-compose.prod.yml down -v && docker-compose -f docker-compose.prod.yml up -d --build
```

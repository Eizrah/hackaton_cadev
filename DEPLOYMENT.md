# 🚀 Guide de Déploiement Cadev

## Prérequis

- Docker 20.10+
- Docker Compose 2.0+
- Git
- 2GB RAM minimum (4GB recommandé)
- 20GB espace disque minimum

## Configuration rapide

### 1. Cloner le projet

```bash
git clone https://votre-repo.git cadev
cd cadev
```

### 2. Configuration de l'environnement

```bash
# Copier le fichier d'exemple
cp backend/Bcadev/.env.example backend/Bcadev/.env

# Éditer avec vos valeurs
nano backend/Bcadev/.env
```

**Important** : Changez ces valeurs obligatoirement :
- `CLE_SECRET` : Générez une clé secrète longue et aléatoire
- `DEBUG=False` pour la production
- `DB_PASSWORD` : Mot de passe fort
- `GROQ_API_KEY` et `OPENROUTER_API_KEY` : Vos clés API
- `ALLOWED_HOSTS` : Votre domaine

### 3. Déploiement

#### Développement

```bash
# Méthode 1 : Script automatique
chmod +x deploy.sh
./deploy.sh dev

# Méthode 2 : Manuel
docker-compose up -d
docker exec cadev_backend python manage.py migrate
docker exec cadev_backend python manage.py createsuperuser
```

#### Production

```bash
# Méthode 1 : Script automatique
chmod +x deploy.sh
./deploy.sh prod

# Méthode 2 : Manuel
docker-compose -f docker-compose.prod.yml up -d
docker exec cadev_backend python manage.py migrate
docker exec cadev_backend python manage.py collectstatic --noinput
docker exec cadev_backend python manage.py createsuperuser
```

## Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Voir les logs
docker-compose logs -f

# Voir le statut
docker-compose ps
```

### Django management

```bash
# Migrations
docker exec cadev_backend python manage.py makemigrations
docker exec cadev_backend python manage.py migrate

# Créer un superuser
docker exec -it cadev_backend python manage.py createsuperuser

# Shell Django
docker exec -it cadev_backend python manage.py shell

# Collecte des fichiers statiques
docker exec cadev_backend python manage.py collectstatic --noinput
```

### Base de données

```bash
# Backup
docker exec cadev_db pg_dump -U cadev_user cadev_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
cat backup.sql | docker exec -i cadev_db psql -U cadev_user cadev_prod

# Accès psql
docker exec -it cadev_db psql -U cadev_user -d cadev_prod
```

## Sécurité en production

### Checklist

- [ ] `DEBUG=False` dans `.env`
- [ ] `CLE_SECRET` changée (générer avec `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
- [ ] Mots de passe forts pour la DB
- [ ] `.env` n'est PAS dans Git
- [ ] `ALLOWED_HOSTS` configuré
- [ ] Firewall configuré (ports 80, 443)
- [ ] SSL/HTTPS configuré
- [ ] Backups automatiques configurés

### Configurer le firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### Configurer SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## Monitoring

### Logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Dernières 100 lignes
docker-compose logs --tail=100
```

### Ressources

```bash
# Stats en temps réel
docker stats

# Espace disque
docker system df

# Nettoyer
docker system prune -a
```

## Mise à jour

```bash
# 1. Backup de la DB
docker exec cadev_db pg_dump -U cadev_user cadev_prod > backup_before_update.sql

# 2. Pull les changements
git pull origin main

# 3. Rebuild et redémarrer
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Migrations
docker exec cadev_backend python manage.py migrate

# 5. Collecte des statiques
docker exec cadev_backend python manage.py collectstatic --noinput
```

## Dépannage

### Le frontend ne charge pas

```bash
# Vérifier nginx
docker exec cadev_frontend nginx -t

# Redémarrer
docker-compose restart frontend

# Voir les logs
docker-compose logs frontend
```

### Le backend ne répond pas

```bash
# Voir les logs
docker-compose logs backend

# Redémarrer
docker-compose restart backend

# Vérifier la connexion DB
docker exec cadev_backend python manage.py dbshell
```

### Erreur de connexion à la DB

```bash
# Vérifier que la DB tourne
docker-compose ps db

# Voir les logs
docker-compose logs db

# Redémarrer la DB
docker-compose restart db
```

### Problèmes de permissions

```bash
# Donner les bonnes permissions aux volumes
docker exec cadev_backend chown -R 1000:1000 /app/media /app/staticfiles
```

## Architecture

```
┌─────────────────┐
│   Nginx (80)    │ ← Frontend React + Proxy
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Gunicorn │ ← Backend Django (8000)
    │ (Python) │
    └────┬─────┘
         │
    ┌────▼─────────┐
    │ PostgreSQL   │ ← Base de données
    │   (5432)     │
    └──────────────┘
```

## Support

- Documentation: [README.md](README.md)
- Issues: Ouvrir une issue sur GitHub
- Email: support@cadev.com

## License

Propriétaire - Tous droits réservés

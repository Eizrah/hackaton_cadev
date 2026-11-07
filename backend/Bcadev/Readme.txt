
----------------------------------------
  PRÉREQUIS
----------------------------------------

1. Docker Desktop
   - Téléchargement : https://www.docker.com/products/docker-desktop
   - Installer et démarrer Docker Desktop avant de lancer les commandes

2. Git
   - Téléchargement : https://git-scm.com/downloads
   - Nécessaire pour cloner le projet

----------------------------------------
  DÉMARRAGE
----------------------------------------

1. Cloner le projet :
   git clone https://github.com/Eizrah/hackaton_cadev.git
   cd backend/Bcadev

2. Créer le fichier .env :
   - Copier le fichier .env.example et le renommer en .env
   - Remplir les variables avec vos propres valeurs
   - Exemple de contenu du fichier .env :

     CLE_SECRET=generer-une-cle-secrete-django
     DEBUG=True
     DB_NAME=cadedb
     DB_USER=Eizrah
     DB_PASSWORD=votre-mot-de-passe
     DB_HOST=localhost
     DB_PORT=5432

   - Pour générer une clé secrète Django, lancer dans un terminal Python :
     python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

3. Installer les dépendances (si tu n'utilises pas Docker) :
   pip install -r requirements.txt

4. Lancer le backend (première fois) :
   docker-compose up --build

4. Lancer le backend (fois suivantes) :
   docker-compose up

   Le serveur Django sera accessible sur : http://localhost:8000

----------------------------------------
  ARRÊT
----------------------------------------

1. Arrêter les conteneurs :
   Ctrl+C dans le terminal

2. Nettoyer les conteneurs :
   docker-compose down

----------------------------------------
  COMMANDES UTILES
----------------------------------------

- Accéder au shell Django :
  docker-compose exec web python manage.py shell

- Créer un superuser (admin) :
  docker-compose exec web python manage.py createsuperuser

- Appliquer les migrations après un git pull :
  docker-compose exec web python manage.py migrate

- Supprimer la base de données (reset complet) :
  docker-compose down -v

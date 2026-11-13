# Plan d'amélioration du cours Django

## Objectif
Créer une leçon introductive complète comme pour Vue et React, puis améliorer les explications sur les fichiers clés (views.py, urls.py, models.py, settings.py).

## Sources officielles
- https://docs.djangoproject.com/en/5.2/
- https://docs.djangoproject.com/fr/5.2/
- https://docs.djangoproject.com/en/5.2/intro/overview/
- https://docs.djangoproject.com/en/5.2/intro/tutorial01/
- https://www.django-rest-framework.org/

---

## Nouvelle leçon 1 : "Qu'est-ce que Django ?"

### Contenu à créer (20-25 minutes)

#### Section 1 : Django : Framework web Python
**Points clés :**
- Django est un framework web Python créé en 2005 (Lawrence Journal-World)
- Framework "batteries included" : tout est fourni (ORM, admin, auth, forms, templates)
- Philosophie : "Don't Repeat Yourself" (DRY)
- Slogan : "The web framework for perfectionists with deadlines"
- High-level framework : abstraction élevée, productivité maximale

#### Section 2 : Architecture MTV (Model-Template-View)
**Points clés :**
- Django utilise MTV (équivalent de MVC mais différent)
- **Model** : couche de données (ORM Django)
  - Définit la structure de la base de données
  - Classes Python qui héritent de models.Model
  - Django génère automatiquement le SQL
  
- **Template** : couche de présentation
  - HTML + Django Template Language (DTL)
  - Variables {{ variable }}, tags {% for %}, filtres |upper
  
- **View** : couche de logique métier
  - Fonction ou classe qui reçoit une requête HTTP
  - Traite la requête, interroge le modèle
  - Retourne une HttpResponse
  
- **URLconf** : routeur d'URLs
  - Mappe les URLs vers les vues
  - Défini dans urls.py

#### Section 3 : Écosystème Django
**Points clés :**
- **Django ORM** : Object-Relational Mapping (PostgreSQL, MySQL, SQLite, Oracle)
- **Django Admin** : interface d'administration automatique
- **Django Auth** : système d'authentification complet
- **Django Forms** : validation et rendu de formulaires
- **Django REST Framework (DRF)** : création d'API REST
- **Django Channels** : WebSockets et protocoles asynchrones
- **Celery** : tâches asynchrones et background jobs
- **Django Debug Toolbar** : debugging avancé

#### Section 4 : Django vs autres frameworks
**Comparaison avec :**
- **Flask** : Django = batteries included, Flask = minimaliste/flexible
- **FastAPI** : Django = synchrone traditionnel, FastAPI = async/moderne/rapide
- **Laravel (PHP)** : similaires (batteries included, ORM, admin)
- **Express (Node.js)** : Django = opinionated, Express = flexible

**Avantages Django :**
- Administration automatique
- ORM puissant
- Sécurité intégrée (CSRF, XSS, SQL injection)
- Écosystème mature
- Documentation excellente

#### Section 5 : Concepts clés Django
**Points clés :**
- **Projet vs Application**
  - Projet = configuration globale (settings, urls racine)
  - Application = module fonctionnel réutilisable (blog, shop, auth)
  - Un projet contient plusieurs applications
  
- **manage.py** : outil CLI pour gérer le projet
  - runserver, migrate, makemigrations, createsuperuser
  
- **Middleware** : couche entre requête et vue
  - Authentification, CSRF, sessions, compression
  
- **Migrations** : gestion des évolutions de BDD
  - Fichiers Python générés automatiquement
  - Versioning du schéma de base de données

---

## Nouvelle leçon 2 : "Créer un projet Django et comprendre sa structure"

### Contenu à créer (25-30 minutes)

#### Section 1 : Prérequis et installation
**Points clés :**
- Python 3.10+ requis
- Environnement virtuel **obligatoire** :
  ```bash
  python -m venv .venv
  # Windows
  .venv\Scripts\activate
  # Linux/Mac
  source .venv/bin/activate
  ```
- Installation Django :
  ```bash
  pip install Django==5.2
  ```
- Vérification :
  ```bash
  python -m django --version
  ```

#### Section 2 : Créer un projet Django
**Points clés :**
- Commande : `django-admin startproject mon_projet`
- Structure générée :
  ```
  mon_projet/
    manage.py
    mon_projet/
      __init__.py
      settings.py
      urls.py
      asgi.py
      wsgi.py
  ```
  
- **Projet vs Application**
  - Projet créé : `django-admin startproject config`
  - Application créée : `python manage.py startapp mon_app`
  - Un projet peut avoir plusieurs apps (blog, api, users, etc.)

#### Section 3 : Structure d'un projet Django
**Dossiers et fichiers principaux :**

**Racine du projet :**
- 📄 `manage.py` : CLI pour gérer le projet (runserver, migrate, etc.)
- 📁 `config/` (ou nom du projet) : configuration globale

**Dossier de configuration (config/) :**
- 📄 `settings.py` : **FICHIER CLÉ** - configuration complète
  - INSTALLED_APPS : liste des applications
  - DATABASES : configuration base de données
  - MIDDLEWARE : couches de traitement
  - TEMPLATES : configuration des templates
  - STATIC_URL, MEDIA_URL : fichiers statiques
  
- 📄 `urls.py` : **FICHIER CLÉ** - routage racine
  - URLconf principal
  - Inclut les URLs des applications avec include()
  
- 📄 `wsgi.py` : déploiement production (serveur WSGI)
- 📄 `asgi.py` : déploiement asynchrone (WebSockets)

#### Section 4 : Structure d'une application Django
**Application créée avec `python manage.py startapp blog` :**

```
blog/
  migrations/        # Migrations de base de données
    __init__.py
  __init__.py
  admin.py          # Configuration admin Django
  apps.py           # Configuration de l'application
  models.py         # **FICHIER CLÉ** - Modèles (tables BDD)
  tests.py          # Tests unitaires
  views.py          # **FICHIER CLÉ** - Vues (logique)
  urls.py           # URLs de l'application (à créer)
  
  # À créer manuellement :
  templates/        # Templates HTML
    blog/
      list.html
      detail.html
  static/           # CSS, JS, images
    blog/
      style.css
```

#### Section 5 : Les 3 fichiers clés d'une application

**1. models.py - Définir les données**
```python
from django.db import models

class Article(models.Model):
    titre = models.CharField(max_length=200)
    contenu = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.titre
```

**Rôle :**
- Définit la structure de la base de données
- Chaque classe = une table
- Chaque attribut = une colonne
- Django génère automatiquement le SQL
- ORM : manipuler la BDD avec Python (pas de SQL brut)

**2. views.py - Logique métier**
```python
from django.shortcuts import render
from .models import Article

def liste_articles(request):
    articles = Article.objects.all()
    return render(request, 'blog/list.html', {'articles': articles})
```

**Rôle :**
- Reçoit la requête HTTP (objet `request`)
- Interroge les modèles (BDD)
- Prépare les données pour le template
- Retourne une HttpResponse (HTML, JSON, etc.)

**3. urls.py - Routage**
```python
from django.urls import path
from . import views

app_name = 'blog'
urlpatterns = [
    path('', views.liste_articles, name='liste'),
    path('<int:id>/', views.detail_article, name='detail'),
]
```

**Rôle :**
- Mappe les URLs vers les vues
- Capture des paramètres dans l'URL (<int:id>)
- Nommage des routes (name='liste') pour reverse()
- Inclus dans le urls.py racine avec include()

#### Section 6 : Workflow Django complet
**De la requête à la réponse :**

1. **Requête HTTP** : `GET /blog/5/`
2. **URLconf** (urls.py) : trouve la vue correspondante
3. **Vue** (views.py) : 
   - Reçoit request + paramètres (id=5)
   - Interroge le modèle : `Article.objects.get(id=5)`
4. **Modèle** (models.py) : requête SQL automatique
5. **Template** (HTML) : reçoit les données, génère HTML
6. **Réponse HTTP** : HTML envoyé au navigateur

#### Section 7 : Commandes essentielles
```bash
# Créer un projet
django-admin startproject config .

# Créer une application
python manage.py startapp blog

# Ajouter l'app dans settings.py INSTALLED_APPS
'blog.apps.BlogConfig',

# Créer les migrations (après modification models.py)
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (accès admin)
python manage.py createsuperuser

# Lancer le serveur de développement
python manage.py runserver

# Accès admin
http://127.0.0.1:8000/admin/
```

---

## Améliorations des leçons existantes

### Améliorer la leçon sur les modèles (niveau Intermédiaire)
**Ajouts :**
- Expliquer l'ORM en détail
- Types de champs (CharField, TextField, IntegerField, DateTimeField, ForeignKey, ManyToManyField)
- Relations : OneToOne, ForeignKey, ManyToMany
- Meta options (ordering, verbose_name, db_table)
- Méthodes du manager (objects.all(), filter(), get(), create(), update(), delete())
- QuerySets et lazy evaluation

### Améliorer la leçon sur le CRUD avec SQLite
**Ajouts :**
- Configuration SQLite dans settings.py (par défaut)
- Create : `Article.objects.create(titre="...", contenu="...")`
- Read : `Article.objects.all()`, `.filter()`, `.get(id=1)`
- Update : `article.titre = "Nouveau"; article.save()`
- Delete : `article.delete()`
- CRUD complet dans une vue
- Formulaires Django pour Create/Update

### Améliorer la leçon sur les API REST avec DRF
**Ajouts :**
- Installation : `pip install djangorestframework`
- Ajout dans INSTALLED_APPS : `'rest_framework',`
- Serializers : convertir modèles en JSON
- ViewSets : vues CRUD automatiques
- Routers : URLs automatiques
- Endpoints : GET, POST, PUT, DELETE
- Exemple complet d'API CRUD

---

## Exemple de code pour la leçon intro

```python
# models.py
from django.db import models

class Article(models.Model):
    titre = models.CharField(max_length=200)
    contenu = models.TextField()
    publie = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_creation']
    
    def __str__(self):
        return self.titre

# views.py
from django.shortcuts import render, get_object_or_404
from .models import Article

def liste_articles(request):
    articles = Article.objects.filter(publie=True)
    return render(request, 'blog/liste.html', {'articles': articles})

def detail_article(request, id):
    article = get_object_or_404(Article, id=id, publie=True)
    return render(request, 'blog/detail.html', {'article': article})

# urls.py (application)
from django.urls import path
from . import views

app_name = 'blog'
urlpatterns = [
    path('', views.liste_articles, name='liste'),
    path('<int:id>/', views.detail_article, name='detail'),
]

# urls.py (racine)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')),
]

# settings.py (extrait)
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog.apps.BlogConfig',  # Notre application
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

---

## Ordre d'implémentation

1. ✅ Créer "Qu'est-ce que Django ?" (intro complète)
2. ✅ Créer "Créer un projet Django et comprendre sa structure" (structure + fichiers clés)
3. Améliorer leçon sur models.py (ORM, relations, QuerySets)
4. Améliorer leçon sur CRUD SQLite (Create, Read, Update, Delete)
5. Améliorer leçon sur API REST avec DRF (serializers, viewsets, endpoints)

---

## Note
Le cours Django doit être très détaillé car Django est complexe. Les étudiants doivent comprendre :
- La différence projet vs application
- Le rôle de chaque fichier clé (settings.py, models.py, views.py, urls.py)
- Le workflow complet d'une requête HTTP
- Comment faire du CRUD avec l'ORM
- Comment créer des endpoints API REST

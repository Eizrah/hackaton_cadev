import { lesson, levelColors, quiz, section } from "./courseAuthoring";
import { djangoFiles, djangoPage } from "./djangoAuthoring";
import { djangoProjects } from "./djangoProjects";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://docs.djangoproject.com/fr/5.2/";
const drf = "https://www.django-rest-framework.org/";

function projectExample(level: 0 | 1 | 2, index: number, entry: string) {
  return { ...djangoProjects[level][index].files, entry };
}

const requestExample = djangoFiles("Requêtes et réponses", {
  views: `from django.http import HttpResponse, JsonResponse
from django.shortcuts import render


def home(request):
    return render(request, "home.html", {"method": request.method})


def text(request):
    return HttpResponse("Bonjour depuis le serveur Django.", content_type="text/plain; charset=utf-8")


def data(request):
    return JsonResponse({"message": "Bonjour", "method": request.method})
`,
  urls: `from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("texte/", views.text, name="text"),
    path("api/bonjour/", views.data, name="data"),
]
`,
  home: djangoPage(
    "Requêtes et réponses",
    `<h1>Une requête arrive</h1>
<p>Le navigateur a utilisé la méthode {{ method }}.</p>
<div class="actions">
  <a href="{% url 'text' %}">Réponse texte</a>
  <a href="{% url 'data' %}">Réponse JSON</a>
</div>`,
  ),
});

const routesExample = djangoFiles("Carnet des développeurs", {
  views: `from django.http import Http404
from django.shortcuts import render

PROFILES = {
    "tiana": {"name": "Tiana", "skills": ["Python", "HTML"]},
    "amina": {"name": "Amina", "skills": ["Django", "SQL"]},
    "sam": {"name": "Sam", "skills": []},
}


def home(request):
    return render(request, "home.html", {"profiles": PROFILES.items()})


def profile(request, pseudo):
    data = PROFILES.get(pseudo)
    if data is None:
        raise Http404("Ce profil est introuvable.")
    return render(request, "profile.html", {"profile": data})
`,
  urls: `from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("profils/<slug:pseudo>/", views.profile, name="profile"),
]
`,
  home: djangoPage(
    "Carnet des développeurs",
    `<h1>Carnet des développeurs</h1>
<ul>
  {% for pseudo, profile in profiles %}
    <li><a href="{% url 'profile' pseudo %}">{{ profile.name }}</a></li>
  {% endfor %}
</ul>`,
  ),
  sources: {
    "templates/profile.html": djangoPage(
      "Profil de {{ profile.name }}",
      `<h1>{{ profile.name }}</h1>
{% if profile.skills %}
  <h2>Compétences</h2>
  <ul>
    {% for skill in profile.skills %}<li>{{ skill }}</li>{% endfor %}
  </ul>
{% else %}
  <p>Le profil sera complété bientôt.</p>
{% endif %}
<a href="{% url 'home' %}">← Tous les profils</a>`,
    ),
  },
});

const beginner: WebLevel["chapters"] = [
  {
    id: "introduction-django",
    title: "Introduction à Django",
    description: "Comprendre Django, son architecture MTV, son écosystème et ses différences avec d'autres frameworks.",
    lessons: [
      lesson({
        id: "quest-ce-que-django",
        title: "Qu'est-ce que Django ?",
        minutes: 25,
        summary:
          "Django est un framework web Python batteries included créé en 2005. Il suit l'architecture MTV (Model-Template-View) et fournit tout ce dont tu as besoin pour créer des applications web robustes rapidement.",
        sections: [
          section(
            "Django : Framework web Python batteries included",
            "Django est un framework web high-level qui encourage le développement rapide et une conception propre et pragmatique. Créé en 2005 dans une salle de rédaction, il porte le slogan The web framework for perfectionists with deadlines.",
            [
              "Django est un framework BATTERIES INCLUDED : ORM, admin, authentification, formulaires, templates, tout est fourni.",
              "Philosophie DRY (Don't Repeat Yourself) : éviter la duplication de code.",
              "Créé au Lawrence Journal-World en 2005, open source depuis 2008.",
              "High-level framework : abstraction élevée pour une productivité maximale.",
              "Sécurité par défaut : protection contre CSRF, XSS, SQL injection, clickjacking.",
            ],
          ),
          section(
            "Architecture MTV : Model-Template-View",
            "Django utilise le pattern MTV, une variante du MVC (Model-View-Controller). L'URL Router dirige les requêtes vers les vues appropriées.",
            [
              "**Model** (models.py) : couche de données. Définit la structure de la base de données avec des classes Python. Django génère automatiquement le SQL.",
              "**Template** : couche de présentation. HTML enrichi avec Django Template Language (DTL). Variables {{ variable }}, boucles {% for %}, conditions {% if %}.",
              "**View** (views.py) : couche logique métier. Fonction ou classe qui reçoit une requête HTTP, interroge les modèles, retourne une HttpResponse.",
              "**URLconf** (urls.py) : routeur d'URLs. Mappe les chemins d'URL vers les fonctions de vue. path('articles/', views.liste_articles).",
            ],
          ),
          section(
            "Écosystème Django complet",
            "Django fournit un écosystème riche et mature pour tous les besoins d'une application web moderne.",
            [
              "**Django ORM** : Object-Relational Mapping. Manipule la base de données avec Python (PostgreSQL, MySQL, SQLite, Oracle).",
              "**Django Admin** : interface d'administration automatique générée depuis les modèles. Gestion des données sans code.",
              "**Django Auth** : système d'authentification complet (users, groups, permissions, sessions).",
              "**Django Forms** : validation et rendu de formulaires HTML avec classes Python.",
              "**Django REST Framework (DRF)** : création d'API REST puissantes avec serializers et viewsets.",
              "**Django Channels** : support WebSockets et protocoles asynchrones pour chat, notifications temps réel.",
              "**Celery** : tâches asynchrones et background jobs (emails, rapports, nettoyage).",
              "**Django Debug Toolbar** : panneau de debugging pour analyser requêtes SQL, performances, templates.",
            ],
          ),
          section(
            "Django vs autres frameworks backend",
            "Chaque framework a sa philosophie. Django privilégie la productivité avec des conventions fortes, d'autres privilégient la flexibilité.",
            [
              "**Django vs Flask (Python)** : Django = batteries included, opinionated. Flask = minimaliste, flexible, tu choisis tes outils.",
              "**Django vs FastAPI (Python)** : Django = synchrone traditionnel, ORM intégré. FastAPI = async natif, ultra-rapide, moderne (Pydantic).",
              "**Django vs Laravel (PHP)** : très similaires ! Tous deux batteries included, ORM (Eloquent vs Django ORM), admin (Nova vs Django Admin).",
              "**Django vs Express (Node.js)** : Django = opinionated, structure claire. Express = minimaliste, maximum de liberté.",
              "**Django vs Spring Boot (Java)** : similaires, tous deux enterprise-grade avec annotations/décorateurs et DI (Dependency Injection).",
            ],
          ),
          section(
            "Avantages Django et concepts clés",
            "Django excelle dans la création rapide d'applications web sécurisées et maintenables.",
            [
              "**Avantages** : Admin automatique, ORM puissant, sécurité intégrée, documentation excellente, écosystème mature, scalabilité prouvée (Instagram, Pinterest, Spotify).",
              "**Projet vs Application** : Un projet = configuration globale (settings.py). Une application = module fonctionnel (blog, shop, api). Un projet contient plusieurs apps.",
              "**manage.py** : outil CLI pour gérer le projet (runserver, migrate, makemigrations, createsuperuser, shell).",
              "**Middleware** : couches entre requête et vue (auth, CSRF, sessions, compression, cache).",
              "**Migrations** : versioning du schéma de base de données. Fichiers Python générés automatiquement, appliqués avec migrate.",
            ],
          ),
        ],
        files: djangoFiles("Introduction Django", {
          info: `# Django Framework

## Architecture MTV
- **M**odel : Données (ORM)
- **T**emplate : Présentation (HTML)
- **V**iew : Logique (Python)

## Philosophie
- Batteries included
- Don't Repeat Yourself (DRY)
- Explicit is better than implicit

## Écosystème
- ORM : Manipulation BDD
- Admin : Interface auto
- Auth : Authentification
- Forms : Validation
- DRF : API REST

## Commandes essentielles
python manage.py runserver
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
`,
        }),
        task: "Lis le fichier info qui résume l'architecture MTV et les concepts clés de Django.",
        takeaway:
          "Django est un framework batteries included qui suit MTV (Model-Template-View). Il fournit ORM, admin, auth, forms et tout ce qu'il faut pour créer des applications web rapidement et en toute sécurité.",
        quiz: quiz(
          "Quelle est la différence entre Django et Flask ?",
          [
            "Django est batteries included, Flask est minimaliste",
            "Django ne peut pas faire d'API",
            "Flask est plus rapide que Django",
          ],
          0,
          "Django fournit tout (ORM, admin, auth), Flask te laisse choisir tes outils.",
        ),
        link: `${docs}intro/overview/`,
      }),
      lesson({
        id: "structure-projet-django",
        title: "Créer un projet Django et comprendre sa structure",
        minutes: 30,
        summary:
          "Installe Django, crée un projet et une application, comprends la différence entre les deux et le rôle des fichiers clés : settings.py, urls.py, models.py, views.py.",
        sections: [
          section(
            "Prérequis et installation",
            "Python 3.10+ est requis. Un environnement virtuel est OBLIGATOIRE pour isoler les dépendances du projet.",
            [
              "Vérifie Python : python --version (ou python3 --version sur Linux/Mac).",
              "Crée un environnement virtuel : python -m venv .venv",
              "Active l'environnement : Windows PowerShell : .venv\\Scripts\\activate | Linux/Mac : source .venv/bin/activate",
              "Installe Django : pip install Django==5.2",
              "Vérifie l'installation : python -m django --version",
            ],
          ),
          section(
            "Créer un projet Django",
            "Un PROJET Django contient la configuration globale. Une APPLICATION est un module fonctionnel réutilisable. Un projet peut avoir plusieurs applications.",
            [
              "Crée un projet : django-admin startproject config . (le point crée dans le dossier actuel)",
              "Structure générée : manage.py (CLI), config/ (dossier de configuration avec settings.py, urls.py, wsgi.py, asgi.py).",
              "Crée une application : python manage.py startapp blog",
              "Ajoute l'app dans settings.py INSTALLED_APPS : 'blog.apps.BlogConfig',",
              "Un projet peut avoir plusieurs apps : blog, api, users, shop, etc. Chaque app est réutilisable dans d'autres projets.",
            ],
          ),
          section(
            "Structure du projet Django",
            "Comprends le rôle de chaque fichier et dossier pour naviguer efficacement dans ton projet.",
            [
              "📄 **manage.py** : CLI pour gérer le projet. Commandes : runserver, migrate, makemigrations, createsuperuser, shell, test.",
              "📁 **config/** (ou nom du projet) : Dossier de configuration globale.",
              "📄 **config/settings.py** : Configuration complète du projet (INSTALLED_APPS, DATABASES, MIDDLEWARE, TEMPLATES, STATIC, MEDIA).",
              "📄 **config/urls.py** : URLconf racine. Inclut les URLs des applications avec include('blog.urls').",
              "📄 **config/wsgi.py** : Point d'entrée WSGI pour déploiement production (Gunicorn, uWSGI).",
              "📄 **config/asgi.py** : Point d'entrée ASGI pour WebSockets et async (Daphne, Uvicorn).",
            ],
          ),
          section(
            "Structure d'une application Django",
            "Une application Django suit une structure standardisée avec des fichiers clés pour les modèles, vues et URLs.",
            [
              "📁 **migrations/** : Fichiers de migration de base de données générés automatiquement.",
              "📄 **admin.py** : Configuration de l'interface admin Django. Register tes modèles ici.",
              "📄 **apps.py** : Configuration de l'application (nom, label, auto-découverte).",
              "📄 **models.py** : **FICHIER CLÉ** - Définition des modèles (tables de base de données). Classes Python héritant de models.Model.",
              "📄 **views.py** : **FICHIER CLÉ** - Logique métier. Fonctions/classes qui reçoivent HttpRequest et retournent HttpResponse.",
              "📄 **urls.py** : **FICHIER CLÉ** (à créer) - Routage des URLs vers les vues. path(), include().",
              "📄 **tests.py** : Tests unitaires de l'application avec unittest ou pytest.",
              "📁 **templates/blog/** : Templates HTML (à créer). Django cherche dans app/templates/.",
              "📁 **static/blog/** : Fichiers statiques CSS, JS, images (à créer).",
            ],
          ),
          section(
            "Les 3 fichiers clés : models.py, views.py, urls.py",
            "Ces trois fichiers forment le cœur de ton application Django et suivent le pattern MTV.",
            [
              "**models.py** : Définit la STRUCTURE de la base de données. Chaque classe = une table, chaque attribut = une colonne. Django génère le SQL automatiquement.",
              "**views.py** : Contient la LOGIQUE métier. Reçoit request, interroge les modèles, prépare les données, retourne HttpResponse (HTML, JSON, redirect).",
              "**urls.py** : Définit le ROUTAGE. Mappe les chemins d'URL vers les fonctions de vue. Capture des paramètres (<int:id>). Nommage des routes (name='...').",
              "Workflow complet : URL → urls.py → view (views.py) → model (models.py) → template (HTML) → HttpResponse.",
            ],
          ),
          section(
            "Commandes Django essentielles",
            "Maîtrise ces commandes pour créer, migrer et lancer ton projet Django.",
            [
              "**Créer un projet** : django-admin startproject config .",
              "**Créer une app** : python manage.py startapp blog",
              "**Créer migrations** : python manage.py makemigrations (après modification de models.py)",
              "**Appliquer migrations** : python manage.py migrate (crée/met à jour les tables)",
              "**Créer superuser** : python manage.py createsuperuser (accès /admin/)",
              "**Lancer serveur** : python manage.py runserver (http://127.0.0.1:8000/)",
              "**Shell Python** : python manage.py shell (interactif avec accès aux modèles)",
              "**Tests** : python manage.py test",
            ],
          ),
        ],
        files: djangoFiles("Structure Django complète", {
          structure: `# Structure d'un projet Django

## Racine du projet
📄 manage.py                 # CLI Django
📁 config/                   # Configuration globale
📁 blog/                     # Application blog
📁 .venv/                    # Environnement virtuel
📄 db.sqlite3                # Base de données (après migrate)
📄 requirements.txt          # Dépendances Python

## Dossier config/ (projet)
📄 __init__.py
📄 settings.py               # Configuration (APPS, DB, MIDDLEWARE)
📄 urls.py                   # URLconf racine
📄 wsgi.py                   # Déploiement production
📄 asgi.py                   # Déploiement async

## Dossier blog/ (application)
📁 migrations/               # Migrations de BDD
📄 __init__.py
📄 admin.py                  # Config admin
📄 apps.py                   # Config app
📄 models.py                 # 🔑 Modèles (tables)
📄 views.py                  # 🔑 Vues (logique)
📄 urls.py                   # 🔑 Routes (à créer)
📄 tests.py                  # Tests
📁 templates/blog/           # Templates HTML (à créer)
📁 static/blog/              # CSS, JS, images (à créer)

## Fichiers clés à comprendre
1. settings.py : Configuration globale
2. models.py : Structure de la BDD (ORM)
3. views.py : Logique métier
4. urls.py : Routage des URLs
`,
        }),
        task: "Crée un projet Django avec django-admin startproject config ., puis une app avec python manage.py startapp blog. Explore les fichiers générés.",
        takeaway:
          "Un PROJET Django contient la configuration globale (settings.py, urls.py racine). Une APPLICATION est un module fonctionnel (models.py, views.py, urls.py). Les 3 fichiers clés sont models.py (données), views.py (logique), urls.py (routage).",
        quiz: quiz(
          "Quelle est la différence entre un projet et une application Django ?",
          [
            "Un projet contient la config globale, une app est un module fonctionnel",
            "Un projet est pour le frontend, une app pour le backend",
            "Il n'y a pas de différence",
          ],
          0,
          "Le projet (config/) contient settings.py et urls.py racine. L'app (blog/) contient models.py, views.py, urls.py spécifiques.",
        ),
        link: `${docs}intro/tutorial01/`,
      }),
    ],
  },
  {
    id: "initialisation-mtv",
    title: "Initialisation et architecture MTV",
    description: "Suis une requête HTTP puis lance ton premier serveur Django.",
    lessons: [
      lesson({
        id: "http-mtv",
        title: "Du navigateur à Django",
        minutes: 16,
        summary:
          "Une URL dans le navigateur déclenche une requête HTTP. Django la dirige vers une vue qui renvoie une réponse et un statut.",
        sections: [
          section(
            "Lire l’aller-retour HTTP",
            "GET sert à demander une ressource. POST sert notamment à soumettre des données. La réponse précise un statut comme 200 pour une réussite ou 404 pour une ressource absente.",
            [
              "Le corps d’une réponse peut contenir du HTML, du texte ou du JSON.",
              "Dans les outils du navigateur, l’onglet Réseau permet de lire la méthode, le statut et les en-têtes.",
            ],
          ),
          section(
            "Découvrir Model, Template, View",
            "Le modèle décrit et manipule les données. La vue reçoit la requête, choisit les données et construit la réponse. Le template met les données en forme dans le HTML.",
            [
              "Le routeur d’URL choisit d’abord la vue.",
              "Une vue peut renvoyer du JSON directement, par exemple pour un frontend React.",
            ],
          ),
        ],
        files: requestExample,
        task: "Lance l’exemple exporté, ouvre les liens Texte et JSON et compare les réponses dans l’onglet Réseau.",
        takeaway:
          "URL, vue et réponse forment le trajet d’une requête. Le template intervient quand la réponse doit produire du HTML.",
        quiz: quiz(
          "Quel élément Django reçoit la requête et prépare la réponse ?",
          ["La vue", "Le template seul", "Le fichier CSS"],
          0,
          "Le routeur envoie la requête à une vue, qui renvoie une réponse HTTP.",
        ),
        link: `${docs}intro/overview/`,
      }),
      lesson({
        id: "installer-django",
        title: "Environnement virtuel, projet et application",
        minutes: 22,
        summary:
          "Django est un framework Python pour le serveur. Un projet porte les réglages généraux et peut réunir plusieurs applications, comme un blog et un espace membre.",
        sections: [
          section(
            "Préparer l’environnement",
            "Vérifie l’installation de Python, crée un environnement avec python -m venv .venv, puis installe Django avec le pip de cet environnement.",
            [
              "Sous Windows, py -m venv .venv crée l’environnement. L’atelier indique le chemin de son interpréteur pour PowerShell.",
              'Après activation de l’environnement, python -m pip install "Django>=5.2,<5.3" installe Django 5.2.',
            ],
          ),
          section(
            "Partir d’un dossier vide",
            "django-admin startproject mon_projet génère la configuration et manage.py. Entre dans mon_projet puis lance python manage.py startapp mon_app.",
            [
              "Ajoute mon_app à INSTALLED_APPS dans settings.py.",
              "python manage.py migrate prépare les tables intégrées. python manage.py runserver démarre le serveur de développement.",
              "Le ZIP de l’exemple contient déjà un projet config et une application atelier. Lance les commandes affichées dans le guide.",
            ],
          ),
        ],
        files: djangoFiles("Mon premier serveur", { entry: "manage.py" }),
        task: "Démarre le serveur, ouvre http://127.0.0.1:8000/ et change le titre dans templates/home.html.",
        takeaway:
          "venv isole les dépendances. manage.py lance les commandes liées à un projet.",
        quiz: quiz(
          "Quelle commande démarre le serveur de développement ?",
          [
            "python manage.py startapp",
            "python manage.py runserver",
            "python manage.py makemigrations",
          ],
          1,
          "runserver démarre le serveur local et affiche son URL.",
        ),
        link: `${docs}intro/tutorial01/`,
      }),
    ],
  },
  {
    id: "urls-et-vues",
    title: "URLs et vues",
    description:
      "Associe un chemin à une fonction et adapte la réponse aux paramètres.",
    lessons: [
      lesson({
        id: "urls-django",
        title: "Relier un chemin à une vue",
        minutes: 17,
        summary:
          "urls.py contient les chemins reconnus par Django. path associe un chemin à une fonction et peut lui donner un nom.",
        sections: [
          section(
            "Organiser les routes",
            "config/urls.py inclut les routes de l’application. Dans atelier/urls.py, path('', views.home, name='home') associe la racine du site à home.",
            [
              "Une route <slug:pseudo> récupère un segment lisible et le transmet comme argument nommé pseudo.",
              "Dans un template, {% url 'profile' pseudo %} construit le lien avec le nom de la route.",
            ],
          ),
        ],
        files: { ...routesExample, entry: "atelier/urls.py" },
        task: "Ouvre /profils/tiana/ et /profils/amina/. Ajoute une entrée Python et vérifie qu’elle est accessible via la même route.",
        takeaway:
          "Une route dynamique peut desservir plusieurs fiches avec une seule vue.",
        quiz: quiz(
          "Que reçoit profile(request, pseudo) avec /profils/tiana/ ?",
          ["Le texte tiana", "Le HTML entier", "La liste des profils"],
          0,
          "Django transmet le segment capturé dans l’argument pseudo.",
        ),
        link: `${docs}topics/http/urls/`,
      }),
      lesson({
        id: "vues-fonctions",
        title: "HttpResponse, render et les erreurs 404",
        minutes: 16,
        summary:
          "Une vue fonction reçoit request. Tu peux construire une réponse texte avec HttpResponse ou demander à render d’associer un template et ses données.",
        sections: [
          section(
            "Faire le travail dans la vue",
            "La vue de profil recherche le pseudo. Si elle trouve une fiche, elle transmet un dictionnaire de contexte au template. Sinon, elle signale une ressource introuvable.",
            [
              "render(request, 'profile.html', {'profile': data}) renvoie une réponse HTML.",
              "raise Http404 arrête la vue et laisse Django produire une réponse 404.",
            ],
          ),
        ],
        files: routesExample,
        task: "Ouvre un pseudo existant puis /profils/inconnu/. Repère le 404 dans le navigateur et le terminal.",
        takeaway: "La vue décide du contenu et du statut de la réponse.",
        quiz: quiz(
          "Quel statut correspond à un profil absent ?",
          ["201", "200", "404"],
          2,
          "404 indique que la ressource demandée est introuvable.",
        ),
        link: `${docs}topics/http/views/`,
      }),
    ],
  },
  {
    id: "templates-django",
    title: "Le moteur de templates",
    description: "Affiche des données et partage la structure du site.",
    lessons: [
      lesson({
        id: "contexte-dtl",
        title: "Afficher des données avec le DTL",
        minutes: 17,
        summary:
          "Le langage de templates de Django lit les valeurs du contexte. {{ variable }} les affiche et les balises entre {% et %} organisent le rendu.",
        sections: [
          section(
            "Afficher, répéter et tester",
            "Dans le profil, {{ profile.name }} affiche le prénom. {% for skill in profile.skills %} génère une ligne par compétence.",
            [
              "Ferme les blocs avec {% endfor %} et {% endif %}.",
              "Le template échappe par défaut le texte affiché pour qu’il soit interprété comme du contenu.",
              "Garde la recherche des données et les opérations principales dans la vue.",
            ],
          ),
        ],
        files: { ...routesExample, entry: "templates/profile.html" },
        task: "Compare le profil de Sam et celui de Tiana. Ajoute une compétence à Sam et observe la nouvelle branche.",
        takeaway:
          "Le contexte est le lien entre les données de la vue et le template.",
        quiz: quiz(
          "Quelle syntaxe affiche le prénom dans le template ?",
          ["{% profile.name %}", "{{ profile.name }}", "<profile.name>"],
          1,
          "Les doubles accolades affichent une valeur du contexte.",
        ),
        link: `${docs}ref/templates/language/`,
      }),
      lesson({
        id: "heritage-django",
        title: "Partager un menu avec l’héritage",
        minutes: 18,
        summary:
          "base.html fournit les éléments communs. Un template enfant étend cette base puis remplit les blocs qui changent.",
        sections: [
          section(
            "Donner une place au contenu",
            "Commence le template enfant par {% extends 'base.html' %}. Le bloc title personnalise le titre. Le bloc content fournit le contenu de la page.",
            [
              "Ajoute le menu et le lien vers la feuille CSS dans la base.",
              "Modifie le titre commun à un seul endroit et recharge plusieurs pages.",
            ],
          ),
        ],
        files: projectExample(0, 0, "templates/article.html"),
        task: "Ajoute un pied de page à base.html. Vérifie qu’il apparaît sur la liste et les articles.",
        takeaway:
          "L’héritage partage la structure commune tout en laissant chaque page remplir ses propres blocs.",
        quiz: quiz(
          "Quelle balise indique que le template reprend une base ?",
          ["{% for %}", "{% extends %}", "{% csrf_token %}"],
          1,
          "extends associe le template enfant à son parent.",
        ),
        link: `${docs}ref/templates/language/#template-inheritance`,
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "modeles-et-orm",
    title: "Modèles, migrations et ORM",
    description:
      "Décris les données, crée les tables et écris tes premières requêtes.",
    lessons: [
      lesson({
        id: "modeles-migrations",
        title: "Du modèle à la table SQLite",
        minutes: 21,
        summary:
          "Une classe Django Model décrit une table. Ses champs décrivent les informations d’une ligne. Le modèle de tâche contient un titre, un état et une date.",
        sections: [
          section(
            "Versionner la structure de la base",
            "makemigrations prépare les fichiers de migration à partir des changements de modèles. migrate applique les opérations en attente à la base configurée.",
            [
              "CharField impose une longueur dans les formulaires Django. BooleanField stocke un état vrai ou faux.",
              "Le guide exécute makemigrations atelier puis migrate dans le projet exporté.",
              "Dans un projet partagé, versionne les fichiers de migration avec les modèles.",
            ],
          ),
        ],
        files: projectExample(1, 0, "atelier/models.py"),
        task: "Ajoute un champ priority avec une valeur par défaut. Crée et applique la migration, puis lis le fichier généré.",
        takeaway:
          "Le modèle décrit la structure. Les migrations appliquent cette structure dans le temps.",
        quiz: quiz(
          "Quelle commande applique les migrations ?",
          ["runserver", "makemigrations", "migrate"],
          2,
          "migrate applique les opérations à la base.",
        ),
        link: `${docs}topics/migrations/`,
      }),
      lesson({
        id: "requeter-orm",
        title: "Lire et filtrer avec l’ORM",
        minutes: 18,
        summary:
          "L’ORM traduit des opérations Python en requêtes de base de données. Le gestionnaire objects fournit des méthodes pour écrire ces requêtes.",
        sections: [
          section(
            "Composer une requête",
            "Task.objects.all() décrit toutes les tâches. Task.objects.filter(done=False) sélectionne celles à terminer. order_by précise l’ordre.",
            [
              "Un QuerySet peut être filtré ou trié avant d’être évalué, par exemple quand le template le parcourt.",
              "Utilise get_object_or_404 pour répondre proprement quand l’identifiant d’une tâche n’existe pas.",
            ],
          ),
        ],
        files: projectExample(1, 0, "atelier/views.py"),
        task: "Ajoute deux tâches et termine l’une d’elles. Remplace la requête d’accueil par un filtre done=False et vérifie la liste.",
        takeaway:
          "Un QuerySet exprime une sélection et peut être affiné avant la lecture.",
        quiz: quiz(
          "Quelle expression sélectionne les tâches terminées ?",
          [
            "Task.objects.filter(done=True)",
            "Task.objects.all()",
            "Task.objects.filter(done=False)",
          ],
          0,
          "filter(done=True) garde les lignes dont done vaut True.",
        ),
        link: `${docs}topics/db/queries/`,
      }),
    ],
  },
  {
    id: "administration-crud",
    title: "Administration et opérations CRUD",
    description:
      "Gère des objets depuis Django Admin puis relie une opération à l’interface.",
    lessons: [
      lesson({
        id: "django-admin",
        title: "Configurer Django Admin",
        minutes: 18,
        summary:
          "Django Admin fournit une interface réservée aux comptes autorisés. Après avoir enregistré un modèle, tu peux consulter et gérer ses objets.",
        sections: [
          section(
            "Ouvrir /admin/",
            "Arrête runserver avec Ctrl+C et lance manage.py createsuperuser avec le Python de ton environnement. Relance le serveur et connecte-toi dans /admin/.",
            [
              "admin.site.register(Model) suffit pour un écran simple.",
              "ModelAdmin permet de choisir list_display, list_filter et search_fields.",
              "Utilise un compte de test pour l’atelier et attribue les accès nécessaires à l’équipe dans un vrai projet.",
            ],
          ),
        ],
        files: projectExample(1, 0, "atelier/admin.py"),
        task: "Crée une tâche dans l’admin, retrouve-la dans la liste et filtre les tâches terminées.",
        takeaway:
          "Enregistrer un modèle rend ses objets accessibles dans l’interface d’administration selon les permissions.",
        quiz: quiz(
          "Quel réglage ajoute une zone de recherche au modèle dans l’admin ?",
          ["search_fields", "LANGUAGE_CODE", "ROOT_URLCONF"],
          0,
          "search_fields indique quels champs peuvent être recherchés.",
        ),
        link: `${docs}ref/contrib/admin/`,
      }),
      lesson({
        id: "crud-django",
        title: "Créer, lire, modifier et supprimer",
        minutes: 18,
        summary:
          "CRUD désigne les quatre opérations courantes sur les données. La liste de tâches les relie à des routes et à des actions visibles.",
        sections: [
          section(
            "Choisir la requête qui correspond à l’action",
            "Le chargement de la liste utilise GET. Le formulaire de création, la bascule d’état et la suppression utilisent POST.",
            [
              "save(update_fields=['done']) limite la mise à jour à l’état.",
              "@require_POST renvoie 405 si l’action reçoit une méthode différente.",
              "Après une modification réussie, redirect('home') déclenche un nouveau GET. Rafraîchir la page relit alors la liste.",
            ],
          ),
        ],
        files: projectExample(1, 0, "atelier/views.py"),
        task: "Crée une tâche, change son état et supprime-la. Essaie l’URL de suppression dans la barre d’adresse et lis le statut.",
        takeaway:
          "La lecture passe par GET. Les actions qui changent la base suivent des routes protégées et redirigent après réussite.",
        quiz: quiz(
          "Pourquoi utiliser POST pour supprimer une tâche depuis un formulaire ?",
          [
            "La suppression change l’état de la base",
            "GET est réservé au CSS",
            "POST désactive les migrations",
          ],
          0,
          "Une méthode de lecture doit éviter de déclencher une modification.",
        ),
        link: `${docs}topics/http/decorators/#allowed-http-methods`,
      }),
    ],
  },
  {
    id: "formulaires-securite",
    title: "Formulaires et protection CSRF",
    description:
      "Valide les entrées et lie les nouvelles données au compte connecté.",
    lessons: [
      lesson({
        id: "model-form",
        title: "Valider les données avec ModelForm",
        minutes: 21,
        summary:
          "Un ModelForm construit des champs à partir d’un modèle. Dans la vue, is_valid() vérifie les données reçues avant de les enregistrer.",
        sections: [
          section(
            "Sélectionner les champs éditables",
            "ListingForm reçoit title, description et price. Le compte propriétaire vient de request.user après validation.",
            [
              "Déclare les champs modifiables dans Meta.fields.",
              "form.save(commit=False) prépare l’objet. Attribue le propriétaire, puis appelle save().",
              "Une erreur de formulaire doit être rendue avec les champs que la personne a saisis.",
            ],
          ),
        ],
        files: projectExample(1, 1, "atelier/forms.py"),
        task: "Inscris-toi dans le projet exporté. Essaie un prix négatif puis un prix valide et vérifie la nouvelle annonce.",
        takeaway:
          "La validation côté serveur décide quelles données peuvent entrer dans la base.",
        quiz: quiz(
          "D’où doit venir le propriétaire d’une annonce ?",
          [
            "D’un champ caché du formulaire",
            "Du compte de request.user",
            "Du prix choisi",
          ],
          1,
          "La vue associe l’annonce au compte authentifié.",
        ),
        link: `${docs}topics/forms/modelforms/`,
      }),
      lesson({
        id: "csrf-django",
        title: "Protéger les formulaires POST",
        minutes: 19,
        summary:
          "Une requête forgée peut tenter de profiter de la session d’un utilisateur. Le middleware CSRF de Django vérifie le jeton avant de laisser passer les requêtes concernées.",
        sections: [
          section(
            "Inclure le jeton dans le bon formulaire",
            "Ajoute {% csrf_token %} dans les formulaires POST envoyés à ton application. Django produit un champ caché et vérifie le jeton à la réception.",
            [
              "GET reste adapté à une recherche qui ne modifie pas la base.",
              "Un jeton valide et la vérification de l’identité répondent à deux besoins distincts. Vérifie aussi les droits sur les données.",
              "Une requête rejetée par le contrôle CSRF renvoie normalement 403.",
            ],
          ),
        ],
        files: projectExample(1, 1, "templates/listing_form.html"),
        task: "Dans une copie locale de l’exercice, retire le jeton de ce formulaire, observe le refus puis rétablis-le.",
        takeaway:
          "Le formulaire POST envoie un jeton CSRF. La vue contrôle ensuite les données et le droit de publier.",
        quiz: quiz(
          "Quel élément place le jeton CSRF dans le formulaire Django ?",
          ["{% url %}", "{% csrf_token %}", "{{ request.path }}"],
          1,
          "La balise csrf_token rend le champ que vérifie le middleware.",
        ),
        link: `${docs}howto/csrf/`,
      }),
    ],
  },
];

const productionExample = djangoFiles("Préparer un déploiement", {
  entry: "config/settings_production.py",
  sources: {
    "config/settings_production.py": `import os

from .settings import *

# Ce module est choisi par le serveur de production.
DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = [host.strip() for host in os.environ["DJANGO_ALLOWED_HOSTS"].split(",") if host.strip()]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DB_NAME"],
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.environ["DB_HOST"],
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

STATIC_ROOT = BASE_DIR / "staticfiles"
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
`,
    "config/wsgi.py": `import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
application = get_wsgi_application()
`,
  },
  notes: `Le guide lance le module de développement config.settings avec SQLite.
Pour un hébergement de test avec PostgreSQL, ajoute psycopg[binary] et configure
les variables de config/settings_production.py dans le service d’hébergement.
Lance manage.py check --deploy, migrate et collectstatic avec
--settings=config.settings_production. Un hébergement WSGI tel que Gunicorn
sur Linux charge config.wsgi:application avec DJANGO_SETTINGS_MODULE réglé
sur config.settings_production. Le serveur HTTPS sert aussi STATIC_ROOT.
Consulte le guide de déploiement de Django avant la mise en ligne.`,
});

const advanced: WebLevel["chapters"] = [
  {
    id: "relations-auth",
    title: "Relations et authentification",
    description:
      "Relie les données aux comptes et protège les opérations privées.",
    lessons: [
      lesson({
        id: "relations-django",
        title: "Clés étrangères et relations plusieurs-à-plusieurs",
        minutes: 22,
        summary:
          "Une ForeignKey relie chaque commentaire à une publication. Une ManyToManyField permet à plusieurs personnes d’aimer plusieurs publications.",
        sections: [
          section(
            "Lire les relations dans les deux sens",
            "post.comments.all() donne les commentaires de la publication via related_name. post.likes.add(user) crée le lien entre ce post et ce membre.",
            [
              "on_delete=models.CASCADE supprime les commentaires quand leur publication est supprimée.",
              "settings.AUTH_USER_MODEL référence le modèle d’utilisateur configuré.",
              "Django crée la table intermédiaire pour la relation many-to-many.",
            ],
          ),
        ],
        files: projectExample(2, 1, "atelier/models.py"),
        task: "Crée deux comptes, fais-les aimer le même post puis vérifie le nombre de mentions dans l’API.",
        takeaway:
          "La cardinalité exprime les liens possibles entre les données.",
        quiz: quiz(
          "Quelle relation convient à plusieurs membres aimant plusieurs posts ?",
          [
            "ManyToManyField",
            "CharField",
            "Une ForeignKey de Post vers un seul membre",
          ],
          0,
          "Chaque côté de la relation peut contenir plusieurs objets.",
        ),
        link: `${docs}topics/db/models/#relationships`,
      }),
      lesson({
        id: "auth-django",
        title: "Inscrire, connecter et protéger les accès",
        minutes: 23,
        summary:
          "Django fournit des utilisateurs, des sessions et des vues de connexion. L’authentification établit l’identité. Les permissions déterminent les actions autorisées.",
        sections: [
          section(
            "Créer une session",
            "UserCreationForm valide l’inscription. login(request, user) ouvre la session. LoginView et LogoutView gèrent ensuite la connexion et la déconnexion.",
            [
              "Utilise un formulaire POST avec jeton CSRF pour la déconnexion.",
              "@login_required redirige un visiteur anonyme vers la connexion. L’annonce est liée à request.user.",
              "Pour une action sur un objet, vérifie aussi la propriété ou une permission explicite.",
            ],
          ),
        ],
        files: projectExample(1, 1, "atelier/views.py"),
        task: "Visite la route d’ajout d’annonce avant puis après connexion. Déconnecte-toi et vérifie la redirection.",
        takeaway:
          "La session donne l’identité. La vue ou l’API vérifie le droit d’effectuer l’action.",
        quiz: quiz(
          "Quel décorateur demande un compte connecté à une vue HTML ?",
          ["@login_required", "@require_POST", "@admin.register"],
          0,
          "login_required redirige un visiteur sans session vers la connexion.",
        ),
        link: `${docs}topics/auth/default/`,
      }),
    ],
  },
  {
    id: "api-rest",
    title: "API REST avec Django REST Framework",
    description:
      "Sérialise les objets et expose des routes avec les bons droits.",
    lessons: [
      lesson({
        id: "serialiseurs-drf",
        title: "Transformer et valider les données avec DRF",
        minutes: 22,
        summary:
          "Django REST Framework est une bibliothèque pour créer des API. Un sérialiseur transforme les objets en données prêtes à être rendues en JSON et valide les valeurs reçues.",
        sections: [
          section(
            "Définir la forme de l’API",
            "Installe djangorestframework et ajoute rest_framework dans INSTALLED_APPS. Dans le catalogue, ProductSerializer décrit id, name, price et category.",
            [
              "ModelSerializer peut dériver des champs du modèle. Indique les champs exposés.",
              "read_only empêche la modification d’un champ par l’entrée. Le propriétaire vient du compte connecté.",
              "Essaie une quantité inférieure à 1 et lis l’erreur de validation.",
            ],
          ),
        ],
        files: projectExample(2, 0, "atelier/serializers.py"),
        task: "Crée une catégorie et un produit depuis l’admin, puis inspecte le JSON de /api/produits/.",
        takeaway:
          "Le sérialiseur définit le contrat d’échange entre l’API et ses clients.",
        quiz: quiz(
          "Quel fichier définit les champs JSON d’un produit dans cet exemple ?",
          [
            "atelier/serializers.py",
            "static/atelier.css",
            "templates/base.html",
          ],
          0,
          "ProductSerializer liste les champs envoyés par l’API.",
        ),
        link: `${drf}api-guide/serializers/`,
      }),
      lesson({
        id: "viewsets-permissions",
        title: "Créer des endpoints et appliquer les permissions",
        minutes: 25,
        summary:
          "Une APIView ou une fonction @api_view traite un point d’accès. Un ViewSet regroupe les opérations autour d’une ressource et un routeur crée les URLs.",
        sections: [
          section(
            "Séparer catalogue et espace client",
            "La boutique utilise ReadOnlyModelViewSet pour la lecture du catalogue et ModelViewSet pour les lignes du panier. checkout est une fonction @api_view qui accepte POST.",
            [
              "AllowAny ouvre la lecture du catalogue. IsAuthenticated protège le panier et les commandes.",
              "Filtre le QuerySet par request.user pour isoler les lignes et les commandes de chaque compte.",
              "Dans le réseau privé, AuthorWrites contrôle aussi le propriétaire d’une publication ou d’un commentaire.",
            ],
          ),
        ],
        files: projectExample(2, 0, "atelier/api.py"),
        task: "Compare les réponses de /api/produits/ et /api/panier/ sans compte. Connecte deux comptes et vérifie que leurs paniers sont distincts.",
        takeaway:
          "Les permissions filtrent les actions. Le QuerySet détermine quels objets le compte peut atteindre.",
        quiz: quiz(
          "Quel filtre évite de rendre le panier d’un autre membre ?",
          [
            "filter(owner=request.user)",
            "order_by('-id')",
            "select_related('product')",
          ],
          0,
          "La condition owner réduit le résultat aux lignes du membre connecté.",
        ),
        link: `${drf}api-guide/permissions/`,
      }),
    ],
  },
  {
    id: "optimisation-production",
    title: "Optimisation et préparation à la production",
    description:
      "Mesure les requêtes et prépare des réglages dédiés au serveur.",
    lessons: [
      lesson({
        id: "optimiser-requetes",
        title: "Repérer les requêtes N+1",
        minutes: 21,
        summary:
          "Lire une liste puis interroger la base pour chaque auteur ou relation peut multiplier les requêtes. Ce problème est appelé N+1.",
        sections: [
          section(
            "Charger les relations ensemble",
            "select_related joint les relations à un seul objet, comme l’auteur d’un post. prefetch_related charge les relations multiples dans une requête distincte puis associe les résultats.",
            [
              "Dans PostViewSet, select_related('author') évite une lecture d’auteur par publication.",
              "prefetch_related('likes') charge les mentions des posts en groupe. Pour un nombre seul, essaie aussi une annotation Count.",
              "Mesure les requêtes sur quelques lignes puis davantage. Django Debug Toolbar et CaptureQueriesContext aident à comparer.",
            ],
          ),
        ],
        files: projectExample(2, 1, "atelier/api.py"),
        task: "Crée plusieurs posts et compare le nombre de requêtes avec et sans select_related, dans un environnement de développement.",
        takeaway:
          "Choisis la stratégie selon la relation et vérifie le nombre de requêtes.",
        quiz: quiz(
          "Quel outil charge une relation plusieurs-à-plusieurs en groupe ?",
          ["prefetch_related", "login_required", "HttpResponse"],
          0,
          "prefetch_related charge les relations multiples dans une requête séparée.",
        ),
        link: `${docs}ref/models/querysets/#prefetch-related`,
      }),
      lesson({
        id: "production-django",
        title: "Configurer un serveur de production",
        minutes: 26,
        summary:
          "Un déploiement utilise ses propres réglages, une base adaptée et un serveur d’application. Le fichier de l’exemple montre comment séparer ces réglages de l’atelier SQLite.",
        sections: [
          section(
            "Gérer secrets et services",
            "Lis SECRET_KEY et les identifiants PostgreSQL depuis des variables d’environnement. Définis DEBUG = False et autorise les noms d’hôtes prévus.",
            [
              "Configure HTTPS et les cookies sécurisés. Lance manage.py check --deploy avec les réglages de production.",
              "Applique les migrations sur la base configurée. Utilise collectstatic puis configure le service qui distribue les fichiers statiques.",
              "Gunicorn peut servir l’application WSGI derrière Nginx sur un VPS Linux. Un hébergement géré peut fournir ces services.",
            ],
          ),
        ],
        files: productionExample,
        task: "Repère la base de développement puis les variables nécessaires au module de production. Prépare les réglages pour un domaine de test et explique comment les vérifier.",
        takeaway:
          "Le déploiement utilise un module dédié, des secrets fournis par le serveur et une vérification avant ouverture.",
        quiz: quiz(
          "Où lire la clé secrète en production dans cet exemple ?",
          [
            "Dans une variable d’environnement du service",
            "Dans un fichier public du frontend",
            "Dans le texte d’un template",
          ],
          0,
          "Le service fournit le secret au processus Django via l’environnement.",
        ),
        link: `${docs}howto/deployment/checklist/`,
      }),
    ],
  },
];

export const djangoLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Architecture MTV et pages dynamiques",
    definition:
      "Django est un framework web écrit en Python. Un framework fournit une structure et des outils pour construire une application. Django associe les URL à des vues, génère du HTML avec des templates et manipule la base de données avec des modèles. Il peut aussi renvoyer du JSON à un frontend React ou Vue.",
    objective:
      "Démarre un serveur Django et relie une URL, une vue Python et un template HTML.",
    color: levelColors[0],
    prerequisites:
      "Pour démarrer, révise les fonctions Python et la structure d’une page HTML.",
    outcomes: [
      "Expliquer le trajet d’une requête HTTP et le rôle de Model, Template et View.",
      "Créer un environnement virtuel, un projet et une application Django.",
      "Relier des URL à des vues et répondre avec du texte, du JSON ou du HTML.",
      "Afficher des données et partager une base de template.",
    ],
    chapters: beginner,
    projects: djangoProjects[0],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "ORM, administration et formulaires",
    objective:
      "Enregistre des données dans SQLite et permets de les gérer depuis l’admin et des formulaires.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, sache lancer Django et relier une route à une vue.",
    outcomes: [
      "Définir des modèles et appliquer leurs migrations.",
      "Lire et filtrer la base avec l’ORM.",
      "Enregistrer un modèle dans Django Admin et effectuer des opérations CRUD.",
      "Valider un ModelForm et protéger les actions POST avec CSRF.",
    ],
    chapters: intermediate,
    projects: djangoProjects[1],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Relations, API REST et déploiement",
    objective:
      "Développe une API Django pour un frontend et protège les données privées avec des permissions.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, maîtrise les modèles, les formulaires et les migrations.",
    outcomes: [
      "Modéliser les relations entre plusieurs tables et utiliser l’authentification Django.",
      "Écrire des sérialiseurs et des ViewSets pour une API REST.",
      "Appliquer les permissions et isoler les données par compte.",
      "Optimiser les lectures et préparer les réglages de production et PostgreSQL.",
    ],
    chapters: advanced,
    projects: djangoProjects[2],
  },
];

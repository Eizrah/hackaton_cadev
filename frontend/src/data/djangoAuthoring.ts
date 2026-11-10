import { djangoLaunchCommands } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

const settings = `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Configuration de développement pour ce dossier local.
SECRET_KEY = "django-insecure-atelier-devafrica-local"
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "atelier",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "config.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"},
}
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
LANGUAGE_CODE = "fr"
TIME_ZONE = "UTC"
USE_TZ = True
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"
`;

const baseTemplate = `{% load static %}
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% block title %}Atelier Django{% endblock %}</title>
  <link rel="stylesheet" href="{% static 'atelier.css' %}">
</head>
<body>
  <header>
    <nav aria-label="Navigation principale">
      <a href="/">DevAfrica · Atelier Django</a>
      {% if user.is_authenticated %}
        <span>{{ user.get_username }}</span>
        <form action="{% url 'logout' %}" method="post">
          {% csrf_token %}
          <button>Se déconnecter</button>
        </form>
      {% else %}
        <a href="{% url 'login' %}">Se connecter</a>
      {% endif %}
    </nav>
  </header>
  <main>{% block content %}{% endblock %}</main>
</body>
</html>
`;

const css = `* { box-sizing: border-box; }
body { margin: 0; background: #eef5fc; color: #193b5b; font: 1rem/1.55 system-ui, sans-serif; }
header { background: #174b78; }
nav, main { max-width: 50rem; padding: 1rem; margin: auto; }
nav { color: white; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
nav a { color: white; }
main { padding-block: clamp(1rem, 5vw, 3rem); }
h1, h2 { line-height: 1.2; }
a { color: #195589; }
button { background: #1e6098; color: white; border: 0; border-radius: .55rem; padding: .55rem .8rem; font: inherit; cursor: pointer; }
input, textarea, select { max-width: 100%; font: inherit; padding: .45rem; border: 1px solid #8faac1; border-radius: .4rem; }
label { display: block; font-weight: 600; }
.card { padding: 1rem; margin-block: .9rem; background: white; border: 1px solid #c5d8e9; border-radius: .85rem; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; }
.done { text-decoration: line-through; }
.errorlist { color: #a32939; }
:focus-visible { outline: 3px solid #55a9eb; outline-offset: 3px; }
`;

export function djangoPage(title: string, body: string) {
  return `{% extends "base.html" %}
{% block title %}${title}{% endblock %}
{% block content %}
${body.trim()}
{% endblock %}
`;
}

type DjangoOptions = {
  entry?: string;
  views?: string;
  urls?: string;
  home?: string;
  sources?: Record<string, string>;
  rest?: boolean;
  notes?: string;
};

export function djangoFiles(
  title: string,
  options: DjangoOptions = {},
): WebFiles {
  return {
    html: "",
    css: "",
    entry: options.entry ?? "atelier/views.py",
    local: {
      runtime: "django",
      sources: {
        "atelier/views.py":
          options.views ??
          `from django.shortcuts import render


def home(request):
    return render(request, "home.html")
`,
        "atelier/urls.py":
          options.urls ??
          `from django.urls import path

from . import views

urlpatterns = [path("", views.home, name="home")]
`,
        "templates/home.html":
          options.home ??
          djangoPage(
            title,
            `<h1>${title}</h1><p>Ton serveur Django répond.</p>`,
          ),
        "templates/base.html": baseTemplate,
        "manage.py": `import os
import sys

from django.core.management import execute_from_command_line

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    execute_from_command_line(sys.argv)
`,
        "config/__init__.py": "",
        "config/settings.py":
          settings +
          (options.rest ? '\nINSTALLED_APPS += ["rest_framework"]\n' : ""),
        "config/urls.py": `from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("connexion/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("deconnexion/", auth_views.LogoutView.as_view(), name="logout"),
${options.rest ? '    path("api-auth/", include("rest_framework.urls")),\n' : ""}    path("", include("atelier.urls")),
]
`,
        "atelier/__init__.py": "",
        "atelier/migrations/__init__.py": "",
        "templates/login.html": djangoPage(
          "Connexion",
          `<h1>Connexion à l’atelier</h1>
<form class="card" method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <input type="hidden" name="next" value="{{ next }}">
  <button>Se connecter</button>
</form>`,
        ),
        "static/atelier.css": css,
        "requirements.txt":
          "Django>=5.2,<5.3\n" +
          (options.rest ? "djangorestframework>=3.16,<4\n" : ""),
        "README.md": `# ${title}

Ouvre ce dossier dans VS Code. Dans un terminal, utilise Python 3.10 ou plus récent.

## Windows PowerShell

\`\`\`powershell
${djangoLaunchCommands(true)}
\`\`\`

## macOS et Linux

\`\`\`bash
${djangoLaunchCommands(false)}
\`\`\`

Ouvre http://127.0.0.1:8000/. Arrête le serveur avec Ctrl+C.
Pour créer un compte administrateur, remplace \`runserver\` par \`createsuperuser\`
dans la dernière commande et suis les questions du terminal.

Le fichier config/settings.py contient la configuration de développement local.
${options.notes ?? ""}`,
        ...options.sources,
      },
    },
  };
}

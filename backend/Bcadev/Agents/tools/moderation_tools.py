# vérifier contenu, détecter spam/harcèlement
"""
agents/tools/moderation_tools.py

Outils de modération pour l'agent vérification.
Ces fonctions sont décorées avec @tool pour que LangGraph
puisse les appeler automatiquement pendant le raisonnement de l'agent.

Le décorateur @tool :
- Transforme la fonction en outil LangGraph
- La docstring devient la description que l'agent lit pour savoir
  quand utiliser cet outil
- Les paramètres et types sont analysés automatiquement
"""

from langchain_core.tools import tool

# ─── Liste noire de mots interdits ────────────────────────────────────────────
# Mots clairement inappropriés pour une plateforme professionnelle de devs.
# On garde cette liste simple — le LLM gère les cas nuancés.
MOTS_INTERDITS = [
    # ── insultes directes (français) ──
    "idiot", "imbécile", "connard", "abruti", "crétin",
    "salaud", "enculé", "fils de pute", "bâtard", "con",
    "conne", "débile", "attardé", "mongol", "bouffon",

    # ── insultes directes (anglais) ──
    "idiot", "moron", "asshole", "bastard", "dickhead",
    "dumbass", "retard", "loser", "jerk", "scumbag",

    # ── harcèlement / violence (français) ──
    "suicide", "tuer", "mourir", "mort", "crève",
    "je vais te tuer", "tu vas mourir",

    # ── harcèlement / violence (anglais) ──
    "kill yourself", "kys", "die", "go die",
    "i will kill", "you will die",

    # ── contenu haineux (français) ──
    "raciste", "nazi", "terroriste", "islamiste",
    "antisémite", "xénophobe",

    # ── contenu haineux (anglais) ──
    "racist", "nazism", "terrorist", "white supremacy",
    "antisemitic", "xenophobic", "nigger", "faggot",
]

@tool
def check_mots_interdits(texte: str) -> dict:
    """
    Vérifie si le texte contient des mots explicitement interdits.
    Utilise cet outil en premier pour un filtrage rapide avant l'analyse LLM.
    Retourne la liste des mots trouvés et un booléen indiquant si le contenu
    doit être bloqué immédiatement.
    """
    texte_lower = texte.lower()
    mots_trouves = [
        mot for mot in MOTS_INTERDITS
        if mot in texte_lower
    ]

    return {
        # True si des mots interdits ont été trouvés
        "contient_mots_interdits": len(mots_trouves) > 0,
        # liste des mots trouvés pour expliquer le refus
        "mots_trouves": mots_trouves,
        # nombre de mots interdits détectés
        "nombre": len(mots_trouves)
    }

@tool
def get_historique_signalements(email: str) -> dict:
    """
    Récupère l'historique des signalements d'un développeur depuis la base de données.
    Utilise cet outil pour évaluer la fiabilité d'un dev avant de valider son contenu.
    Un dev avec beaucoup de signalements mérite une analyse plus stricte.
    """
    try:
        # import tardif pour éviter les conflits entre le venv agents
        # et l'environnement Django
        import django
        import os
        if not os.environ.get('DJANGO_SETTINGS_MODULE'):
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
            django.setup()

        from Moderation.models import (
            Signalement_Individuel,
            SignalementPost,
            SignalementOffre,
            SignalementGroupe
        )
        from Accounts.models import Developper

        dev = Developper.objects.get(email=email)

        # compte les signalements reçus par ce dev
        signalements_recus = Signalement_Individuel.objects.filter(
            id_personne_signale=dev
        ).count()

        return {
            "email": email,
            "point_penalite": dev.point_penalite,
            "banne": dev.banne,
            "signalements_recus": signalements_recus,
            # un dev avec 3+ signalements ou 5+ points mérite plus de vigilance
            "profil_risque": dev.point_penalite >= 5 or signalements_recus >= 3
        }

    except Exception as e:
        # si Django n'est pas accessible, on retourne un profil neutre
        return {
            "email": email,
            "point_penalite": 0,
            "banne": False,
            "signalements_recus": 0,
            "profil_risque": False,
            "erreur": str(e)
        }

@tool
def check_lien_suspect(url: str) -> dict:
    """
    Vérifie si une URL est potentiellement suspecte ou malveillante.
    Utilise cet outil quand un post ou une offre contient un lien externe.
    Analyse le domaine et la structure de l'URL sans faire de requête HTTP.
    """
    if not url:
        return {"suspect": False, "raison": None}

    url_lower = url.lower()

    # domaines et patterns suspects connus
    patterns_suspects = [
        # raccourcisseurs d'URL souvent utilisés pour masquer des liens malveillants
        "bit.ly", "tinyurl", "t.co", "goo.gl", "ow.ly",
        # extensions suspectes dans les URLs
        ".exe", ".bat", ".scr", ".zip/download",
        # patterns de phishing courants
        "login-", "verify-", "account-secure",
        "paypal-", "apple-", "microsoft-",
    ]

    patterns_trouves = [p for p in patterns_suspects if p in url_lower]

    # domaines légitimes connus pour le dev — pas suspects
    domaines_legitimes = [
        "github.com", "stackoverflow.com", "docs.python.org",
        "react.dev", "vuejs.org", "djangoproject.com",
        "npmjs.com", "pypi.org", "developer.mozilla.org",
        "medium.com", "dev.to", "youtube.com",
    ]

    est_legitime = any(d in url_lower for d in domaines_legitimes)

    return {
        # suspect si des patterns sont trouvés ET le domaine n'est pas connu
        "suspect": len(patterns_trouves) > 0 and not est_legitime,
        "patterns_trouves": patterns_trouves,
        "domaine_legitime": est_legitime,
        "raison": f"Patterns suspects détectés : {patterns_trouves}" if patterns_trouves else None
    }

# ─── Liste des outils disponibles pour l'agent ────────────────────────────────
# Cette liste est importée dans le graphe pour équiper l'agent
MODERATION_TOOLS = [
    check_mots_interdits,
    get_historique_signalements,
    check_lien_suspect,
]

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

# ─── Liste noire de mots/expressions interdits ────────────────────────────────
# Mots clairement inappropriés pour une plateforme professionnelle de devs.
# On garde cette liste simple — le LLM gère les cas nuancés.
# 
# IMPORTANT : Ces patterns sont détectés comme MOTS COMPLETS avec regex \b
# pour éviter de bloquer "conversation" à cause de "con", etc.

import re

MOTS_INTERDITS = [
    # ── insultes directes (français) ──
    r"\bidiot\b", r"\bimbécile\b", r"\bconnard\b", r"\babruti\b", r"\bcrétin\b",
    r"\bsalaud\b", r"\benculé\b", r"fils de pute", r"\bbâtard\b",
    r"\bcon\b", r"\bconne\b", r"\bdébile\b", r"\battardé\b", 
    r"\bmongol\b", r"\bbouffon\b", r"\benfoiré\b", r"\bputain\b",

    # ── insultes directes (anglais) ──
    r"\bmoron\b", r"\basshole\b", r"\bbastard\b", r"\bdickhead\b",
    r"\bdumbass\b", r"\bretard\b", r"\bloser\b", r"\bjerk\b", r"\bscumbag\b",
    r"\bfuck\b", r"\bshit\b", r"\bbitch\b",

    # ── incitation au suicide / violence (français) ──
    r"suicide-toi", r"suicid[eé]-toi", r"va te suicider", r"vas te suicider",
    r"tue-toi", r"va te tuer", r"vas te tuer",
    r"je vais te tuer", r"tu vas mourir", r"va crever", r"vas crever",
    r"crève", r"\bcrever\b",

    # ── incitation au suicide / violence (anglais) ──
    r"kill yourself", r"\bkys\b", r"go die", r"you should die",
    r"i will kill you", r"you will die", r"go kill yourself",

    # ── contenu haineux / discrimination (français) ──
    r"\bnazi\b", r"\bnazis\b", r"\bnéonazi\b",
    r"sale (arabe|noir|juif|musulman|africain|asiatique)",
    r"(arabes|noirs|juifs|musulmans|africains|asiatiques) de merde",
    r"retourne dans ton pays",
    r"\bantisémite\b", r"\bantisémites\b",
    r"(heil hitler|sieg heil)",
    
    # ── contenu haineux / discrimination (anglais) ──
    r"\bnigger\b", r"\bnigga\b", r"\bfaggot\b", r"\bfag\b",
    r"white supremacy", r"white power",
    r"\bnazism\b", r"terrorist scum",
    r"go back to your country",
    
    # ── contenu sexuel explicite / pornographique (français) ──
    r"porn(o|ographie)", r"site (porno|pornographique|xxx)",
    r"sexe gratuit", r"cam(girl|boy)s?\b",
    r"escort(es?)?\b.*sexe", r"prostitution",
    
    # ── contenu sexuel explicite / pornographique (anglais) ──
    r"free porn", r"xxx videos", r"\bpornh", r"sex videos",
    r"nude pics", r"nudes for",
]

@tool
def check_mots_interdits(texte: str) -> dict:
    """
    Vérifie si le texte contient des mots/expressions explicitement interdits.
    Utilise des regex avec limites de mots (\b) pour éviter les faux positifs.
    Par exemple, "con" est détecté seulement s'il est seul, pas dans "conversation".
    
    Utilise cet outil en premier pour un filtrage rapide avant l'analyse LLM.
    Retourne la liste des patterns trouvés et un booléen indiquant si le contenu
    doit être bloqué immédiatement.
    """
    texte_lower = texte.lower()
    patterns_trouves = []
    
    for pattern in MOTS_INTERDITS:
        try:
            if re.search(pattern, texte_lower, re.IGNORECASE):
                # Garde une version lisible du pattern pour le message d'erreur
                pattern_readable = pattern.replace(r"\b", "").replace("\\", "")
                patterns_trouves.append(pattern_readable)
        except re.error:
            # Si un pattern est invalide, on l'ignore silencieusement
            continue

    return {
        # True si des patterns interdits ont été trouvés
        "contient_mots_interdits": len(patterns_trouves) > 0,
        # liste des patterns trouvés pour expliquer le refus
        "mots_trouves": patterns_trouves,
        # nombre de patterns interdits détectés
        "nombre": len(patterns_trouves)
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

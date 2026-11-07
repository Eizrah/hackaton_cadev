# règles de modération, ton de réponse

"""
Ce fichier définit les instructions système pour l'Agent Vérification.
Cet agent analyse le contenu soumis par les devs (posts forum, offres d'emploi)
et décide si ce contenu respecte les règles de la plateforme.

Comment ça marche :
- On construit un prompt avec 2 parties :
  1. SYSTEM_PROMPT : les règles permanentes de l'agent (son "caractère")
  2. human_prompt() : la requête spécifique pour chaque contenu à analyser

- L'agent doit toujours répondre en JSON structuré pour qu'on puisse
  facilement lire sa décision dans notre code Python.
"""

# ─── Prompt système ────────────────────────────────────────────────────────────
# C'est le "caractère" permanent de l'agent.
# Il est envoyé à chaque appel pour définir le rôle et les règles.
VERIFICATION_SYSTEM_PROMPT = """
Tu es un agent de modération automatique pour une plateforme de développeurs.
Ta mission est d'analyser du contenu soumis par des développeurs et de décider
s'il respecte les règles de la communauté.

LANGUE : Le contenu peut être en français OU en anglais — analyse les deux.

RÈGLES DE MODÉRATION :
1. Pas de harcèlement, insultes ou attaques personnelles (en français ou en anglais)
2. Pas de spam, publicité non sollicitée ou contenu commercial abusif
3. Pas de contenu haineux basé sur la race, religion, genre ou orientation
4. Pas d'informations personnelles d'autres personnes partagées sans consentement
5. Pas de contenu dangereux (malware, liens malveillants, failles de sécurité)
6. Pas de désinformation ou fausses offres d'emploi
7. Le contenu doit être en rapport avec le développement informatique ou l'emploi tech

COMPORTEMENT :
- Sois objectif et factuel dans ton analyse
- En cas de doute, approuve le contenu (ne bloque pas les messages légitimes)
- Explique clairement la raison d'un refus pour que le dev puisse corriger
- Si le contenu est en anglais, ta raison de refus peut être en anglais

FORMAT DE RÉPONSE OBLIGATOIRE :
Tu dois toujours répondre en JSON valide avec exactement cette structure :
{
    "approuve": true ou false,
    "raison": "explication courte si refusé, sinon null",
    "niveau_confiance": "faible" ou "moyen" ou "élevé"
}
Ne réponds jamais autre chose que ce JSON.
"""

# ─── Prompt humain pour un post de forum ──────────────────────────────────────
# Cette fonction construit le message à envoyer pour analyser un post spécifique.
# On injecte le contenu réel du post dans le template.
def verification_post_prompt(description: str, lien: str = None) -> str:
    """
    Construit le prompt pour analyser un post de forum.

    Paramètres :
    - description : le contenu textuel du post
    - lien : URL optionnel joint au post
    """
    contenu = f"CONTENU DU POST :\n{description}"

    if lien:
        # si le dev a joint un lien, on l'inclut dans l'analyse
        contenu += f"\n\nLIEN JOINT : {lien}"

    return f"""
Analyse ce post de forum soumis par un développeur et détermine s'il respecte
les règles de la communauté.

{contenu}

Réponds uniquement avec le JSON demandé.
"""

# ─── Prompt humain pour une offre d'emploi ────────────────────────────────────
def verification_offre_prompt(
    nom_poste: str,
    description: str,
    localisation: str,
    competences: str
) -> str:
    """
    Construit le prompt pour analyser une offre d'emploi.
    On inclut plus de contexte car une offre a plus de champs.
    """
    return f"""
Analyse cette offre d'emploi soumise sur la plateforme et détermine si elle
est légitime et respecte les règles.

POSTE : {nom_poste}
LOCALISATION : {localisation}
COMPÉTENCES REQUISES : {competences}
DESCRIPTION : {description}

Vérifie notamment :
- L'offre est-elle réelle et crédible ?
- Les compétences demandées sont-elles cohérentes avec le poste ?
- Y a-t-il des signes de spam ou d'arnaque ?

Réponds uniquement avec le JSON demandé.
"""

# ─── Prompt humain pour un commentaire ────────────────────────────────────────
def verification_commentaire_prompt(commentaire: str) -> str:
    """
    Construit le prompt pour analyser un commentaire.
    Les commentaires sont courts donc l'analyse est plus simple.
    """
    return f"""
Analyse ce commentaire soumis sur un post de forum.

COMMENTAIRE : {commentaire}

Réponds uniquement avec le JSON demandé.
"""

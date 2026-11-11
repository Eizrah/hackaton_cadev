# appelé dans Forum/views.py et Jobs/views.py

"""


Service de vérification du contenu par l'agent IA.
C'est la couche appelée depuis les views Django (Forum et Jobs).

Flux complet :
    Django view → verification_service → LLM (Groq) → JSON → Django

Exemple d'utilisation dans Forum/views.py :
    from agents.services.verification_service import verifier_post

    resultat = verifier_post(description="Mon post...", lien=None)
    if resultat["approuve"]:
        post.feu_vert = True
    else:
        creer_notif(post.developper, 'post_refuse', resultat["raison"])
"""

import json
import logging

from langchain_core.messages import SystemMessage, HumanMessage

# on importe le client LLM configuré avec le fallback Groq → OpenRouter
from Agents.llm.client import get_llm_verification

# on importe le graphe de vérification
from Agents.graph.verification_graph import get_verification_graph

# on importe les prompts définis dans agents/prompts/
from Agents.prompt.verification_prompts import (
    VERIFICATION_SYSTEM_PROMPT,
    verification_post_prompt,
    verification_offre_prompt,
    verification_commentaire_prompt,
)

# logger pour tracer les erreurs sans faire planter l'app
logger = logging.getLogger(__name__)

def _appeler_llm_verification(human_prompt: str) -> dict:
    """
    Fonction interne partagée par tous les types de vérification.
    Envoie le prompt au LLM et parse la réponse JSON.

    Retourne toujours un dict avec :
    {
        "approuve": bool,
        "raison": str ou None,
        "niveau_confiance": str
    }

    En cas d'erreur LLM, approuve par défaut pour ne pas bloquer les devs.
    """
    try:
        llm = get_llm_verification()

        # on construit la conversation avec 2 messages :
        # 1. SystemMessage → le "caractère" permanent de l'agent
        # 2. HumanMessage → le contenu spécifique à analyser
        messages = [
            SystemMessage(content=VERIFICATION_SYSTEM_PROMPT),
            HumanMessage(content=human_prompt),
        ]

        # appel au LLM — retourne un AIMessage
        reponse = llm.invoke(messages)

        # on extrait le texte de la réponse
        contenu = reponse.content.strip()

        # le LLM doit renvoyer du JSON — on le parse
        # parfois le LLM ajoute ```json ... ``` autour, on le nettoie
        if contenu.startswith("```"):
            contenu = contenu.split("```")[1]
            if contenu.startswith("json"):
                contenu = contenu[4:]

        resultat = json.loads(contenu)

        # vérifie que les clés attendues sont présentes
        if "approuve" not in resultat:
            raise ValueError("Clé 'approuve' manquante dans la réponse")

        return {
            "approuve": bool(resultat.get("approuve", True)),
            "raison": resultat.get("raison", None),
            "niveau_confiance": resultat.get("niveau_confiance", "moyen"),
        }

    except Exception as e:
        # si le LLM plante ou retourne quelque chose d'invalide,
        # on approuve par défaut pour ne pas bloquer les devs
        logger.error(f"Erreur agent vérification : {e}")
        return {
            "approuve": True,
            "raison": None,
            "niveau_confiance": "faible",
        }

def verifier_post(description: str, lien: str = None, email_auteur: str = None) -> dict:
    """Vérifie un post de forum via le graphe LangGraph."""
    try:
        graph = get_verification_graph()
        result = graph.invoke({
            "contenu": description,
            "lien": lien,
            "email_auteur": email_auteur,
            "mots_interdits": [],
            "lien_suspect": False,
            "profil_risque": False,
            "refus_immediat": False,
            "approuve": True,
            "raison": None,
            "niveau_confiance": "moyen",
        })
        return {
            "approuve": result["approuve"],
            "raison": result["raison"],
            "niveau_confiance": result["niveau_confiance"],
        }
    except Exception as e:
        logger.error(f"Erreur graphe vérification : {e}")
        return {"approuve": True, "raison": None, "niveau_confiance": "faible"}

def verifier_offre(
    nom_poste: str,
    description: str,
    localisation: str,
    competences: str
) -> dict:
    """Vérifie une offre d'emploi via le graphe LangGraph."""
    # on construit un contenu combiné pour le graphe
    contenu = f"POSTE : {nom_poste}\nLOCALISATION : {localisation}\nCOMPÉTENCES : {competences}\nDESCRIPTION : {description}"
    try:
        graph = get_verification_graph()
        result = graph.invoke({
            "contenu": contenu,
            "lien": None,
            "email_auteur": None,
            "mots_interdits": [],
            "lien_suspect": False,
            "profil_risque": False,
            "refus_immediat": False,
            "approuve": True,
            "raison": None,
            "niveau_confiance": "moyen",
        })
        return {
            "approuve": result["approuve"],
            "raison": result["raison"],
            "niveau_confiance": result["niveau_confiance"],
        }
    except Exception as e:
        logger.error(f"Erreur graphe vérification offre : {e}")
        return {"approuve": True, "raison": None, "niveau_confiance": "faible"}


def verifier_commentaire(commentaire: str) -> dict:
    """Vérifie un commentaire via le graphe LangGraph."""
    try:
        graph = get_verification_graph()
        result = graph.invoke({
            "contenu": commentaire,
            "lien": None,
            "email_auteur": None,
            "mots_interdits": [],
            "lien_suspect": False,
            "profil_risque": False,
            "refus_immediat": False,
            "approuve": True,
            "raison": None,
            "niveau_confiance": "moyen",
        })
        return {
            "approuve": result["approuve"],
            "raison": result["raison"],
            "niveau_confiance": result["niveau_confiance"],
        }
    except Exception as e:
        logger.error(f"Erreur graphe vérification commentaire : {e}")
        return {"approuve": True, "raison": None, "niveau_confiance": "faible"}

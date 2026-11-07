# appelé dans Learning/views.py

"""
agents/services/assistant_services.py

Service de l'agent assistant pédagogique.
C'est la couche appelée depuis Learning/views.py.

Flux complet :
    Django view → assistant_service → assistant_graph → RAG + LLM → réponse

Exemple d'utilisation dans Learning/views.py :
    from Agents.services.assistant_services import repondre_question

    reponse = repondre_question(
        question="Comment fonctionne useEffect ?",
        technologie="react",
        niveau="I",
        email_dev="dev@example.com"
    )
"""

import logging

from Agents.graph.assistant_graph import (
    get_assistant_graph,
    TACHE_QUESTION,
    TACHE_EXERCICE,
    TACHE_CORRECTION,
    TACHE_RECOMMANDATION,
)

logger = logging.getLogger(__name__)


def _invoquer_graphe(state: dict) -> str:
    """
    Fonction interne partagée — invoque le graphe assistant
    et retourne la réponse finale.

    En cas d'erreur, retourne un message lisible sans planter Django.
    """
    try:
        graph = get_assistant_graph()
        result = graph.invoke(state)
        return result.get("reponse", "Aucune réponse générée.")
    except Exception as e:
        logger.error(f"Erreur graphe assistant : {e}")
        return "L'assistant est temporairement indisponible. Réessaie dans quelques instants."


def _etat_initial(tache: str, email_dev: str, **kwargs) -> dict:
    """
    Construit l'état initial complet pour le graphe.
    Toutes les clés de AssistantState doivent être présentes
    sinon LangGraph lève une erreur.
    """
    return {
        # entrées obligatoires
        "tache": tache,
        "email_dev": email_dev,
        # entrées optionnelles — None par défaut
        "technologie": kwargs.get("technologie"),
        "question": kwargs.get("question"),
        "sujet": kwargs.get("sujet"),
        "code_soumis": kwargs.get("code_soumis"),
        "enonce_exercice": kwargs.get("enonce_exercice"),
        "domaine_interet": kwargs.get("domaine_interet"),
        # résultats intermédiaires — initialisés à vide
        # le graphe les remplira pendant l'exécution
        "niveau_dev": "I",
        "niveau_lisible": "intermédiaire",
        "competences_dev": [],
        "contexte_rag": "",
        "rag_disponible": False,
        # résultat final — initialisé à vide
        "reponse": "",
    }


def repondre_question(
    question: str,
    technologie: str,
    niveau: str,
    email_dev: str = ""
) -> str:
    """
    Répond à une question technique via le graphe assistant.

    Le graphe :
    1. Récupère le profil du dev (niveau réel, compétences)
    2. Charge la doc officielle dans ChromaDB si nécessaire
    3. Récupère les passages pertinents via le RAG
    4. Génère une réponse adaptée au niveau du dev

    Paramètres :
    - question : la question posée par le dev
    - technologie : "react", "vue", "django", "python", "typescript"
    - niveau : "D", "I" ou "A" — sera affiné par le profil réel du dev
    - email_dev : email pour récupérer le profil complet (optionnel)
    """
    etat = _etat_initial(
        tache=TACHE_QUESTION,
        email_dev=email_dev,
        technologie=technologie,
        question=question,
    )
    return _invoquer_graphe(etat)


def generer_exercice(
    technologie: str,
    niveau: str,
    sujet: str,
    email_dev: str = ""
) -> str:
    """
    Génère un exercice pratique adapté au niveau réel du dev.

    Le graphe vérifie d'abord si le dev possède déjà des bases
    sur le sujet avant de calibrer la difficulté de l'exercice.

    Paramètres :
    - technologie : la technologie concernée
    - niveau : "D", "I" ou "A"
    - sujet : thème de l'exercice (ex: "hooks React", "authentification Django")
    - email_dev : email pour récupérer le profil (optionnel)
    """
    etat = _etat_initial(
        tache=TACHE_EXERCICE,
        email_dev=email_dev,
        technologie=technologie,
        sujet=sujet,
    )
    return _invoquer_graphe(etat)


def corriger_code(
    code_soumis: str,
    enonce_exercice: str,
    technologie: str,
    email_dev: str = ""
) -> str:
    """
    Corrige le code soumis par un dev de manière pédagogique.

    Le graphe enrichit la correction avec la documentation officielle
    pour que les explications soient précises et référencées.

    Paramètres :
    - code_soumis : le code écrit par le dev
    - enonce_exercice : l'énoncé de l'exercice pour contexte
    - technologie : la technologie utilisée
    - email_dev : email pour récupérer le profil (optionnel)
    """
    etat = _etat_initial(
        tache=TACHE_CORRECTION,
        email_dev=email_dev,
        technologie=technologie,
        code_soumis=code_soumis,
        enonce_exercice=enonce_exercice,
    )
    return _invoquer_graphe(etat)


def recommander_competences(
    competences_actuelles: list,
    niveau: str,
    domaine_interet: str,
    email_dev: str = ""
) -> str:
    """
    Recommande des compétences à apprendre selon le profil du dev.

    Pas de RAG pour les recommandations — le LLM utilise sa connaissance
    générale sur les parcours de carrière en développement.

    Paramètres :
    - competences_actuelles : liste des noms de compétences du dev
    - niveau : "D", "I" ou "A"
    - domaine_interet : ex "frontend", "backend", "devops", "data"
    - email_dev : email pour enrichir avec le profil réel (optionnel)
    """
    etat = _etat_initial(
        tache=TACHE_RECOMMANDATION,
        email_dev=email_dev,
        domaine_interet=domaine_interet,
    )
    return _invoquer_graphe(etat)

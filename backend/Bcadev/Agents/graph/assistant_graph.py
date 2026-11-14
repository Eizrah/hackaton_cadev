# graphe agent assistant
"""
agents/graph/assistant_graph.py

Graphe LangGraph pour l'agent assistant pédagogique.

Architecture du graphe :
                    ┌─────────────────────────────┐
                    │           START              │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       preparer_contexte      │
                    │  - get_niveau_dev            │
                    │  - charger_doc_technologie   │
                    │  - rechercher_passages (RAG) │
                    └──────────────┬──────────────┘
                                   │
               ┌───────────────────▼──────────────────┐
               │          arête conditionnelle         │
               │  documentation disponible ?           │
               └─────────┬──────────────────┬─────────┘
                          │ OUI              │ NON
           ┌──────────────▼──┐    ┌──────────▼──────────────┐
           │  generer_avec   │    │  generer_sans_rag        │
           │     _rag        │    │  (connaissance générale) │
           └──────────┬──────┘    └──────────┬──────────────┘
                      │                      │
                      └──────────┬───────────┘
                    ┌────────────▼────────────┐
                    │         formatter       │
                    │  (structure la réponse) │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │          END            │
                    └─────────────────────────┘

Avantage vs appel LLM direct :
- Vérifie d'abord le niveau du dev pour adapter la réponse
- Charge automatiquement la doc si elle n'est pas dans ChromaDB
- Si le RAG ne trouve rien → génère quand même une réponse utile
- La réponse est toujours formatée de manière cohérente
"""

import logging
from typing import TypedDict, Optional

from langgraph.graph import StateGraph, END, START
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from Agents.llm.client import get_llm_assistant
from Agents.prompt.assistant_prompts import (
    ASSISTANT_SYSTEM_PROMPT,
    question_prompt,
    exercice_prompt,
    correction_prompt,
    recommandation_prompt,
)
from Agents.tools.learning_tools import (
    get_niveau_dev,
    charger_doc_technologie,
)
from Agents.rag.retriever import rechercher_passages

logger = logging.getLogger(__name__)

# ─── Types de tâches supportées ───────────────────────────────────────────────
TACHE_QUESTION = "question"
TACHE_EXERCICE = "exercice"
TACHE_CORRECTION = "correction"
TACHE_RECOMMANDATION = "recommandation"

# ─── État partagé entre les nœuds ─────────────────────────────────────────────

class AssistantState(TypedDict):
    # ── entrées ──
    tache: str                      # "question", "exercice", "correction", "recommandation"
    email_dev: str                  # email du dev pour récupérer son profil
    technologie: Optional[str]      # "react", "vue", "django", "python", "typescript"
    question: Optional[str]         # question posée par le dev
    sujet: Optional[str]            # sujet de l'exercice à générer
    code_soumis: Optional[str]      # code soumis pour correction
    enonce_exercice: Optional[str]  # énoncé de l'exercice pour la correction
    domaine_interet: Optional[str]  # domaine pour les recommandations
    contexte_cours: Optional[dict]  # contexte du cours (si le dev est dans une leçon)
    historique: list[dict]         # messages précédant la dernière question
    langue: Optional[str]          # langue de réponse demandée par l'interface

    # ── résultats intermédiaires ──
    niveau_dev: str                 # "D", "I" ou "A"
    niveau_lisible: str             # "débutant", "intermédiaire", "avancé"
    competences_dev: list           # liste des compétences possédées
    contexte_rag: str               # passages récupérés depuis ChromaDB
    rag_disponible: bool            # True si le RAG a retourné des passages

    # ── résultat final ──
    reponse: str                    # réponse formatée à retourner au dev

# ─── Nœud 1 : préparation du contexte ─────────────────────────────────────────

def preparer_contexte(state: AssistantState) -> AssistantState:
    """
    Premier nœud — récupère le profil du dev et le contexte documentaire.

    1. Appelle get_niveau_dev pour connaître le niveau et les compétences du dev
    2. Si une technologie est spécifiée, s'assure que la doc est dans ChromaDB
    3. Récupère les passages pertinents via le RAG
    
    OPTIMISATION : Le chargement de la doc ne se fait qu'une fois par technologie.
    ChromaDB garde ensuite les embeddings en cache pour les requêtes suivantes.
    """
    # 1. récupère le profil du dev
    try:
        profil = get_niveau_dev.invoke({"email": state["email_dev"]})
        niveau_dev = profil.get("niveau", "I")
        niveau_lisible = profil.get("niveau_lisible", "intermédiaire")
        competences_dev = profil.get("competences_possedees", [])
    except Exception as e:
        logger.warning(f"Impossible de récupérer le profil dev : {e}")
        niveau_dev = "I"
        niveau_lisible = "intermédiaire"
        competences_dev = []

    # Détection rapide : messages simples (salutations, remerciements)
    question_lower = (state.get("question") or "").lower().strip()
    is_simple_message = (
        len(question_lower) < 30 and 
        any(word in question_lower for word in [
            'bonjour', 'salut', 'hello', 'hi', 'hey', 'bonsoir',
            'merci', 'thanks', 'thank you', 'cool', 'super', 'génial', 'ok'
        ])
    )
    
    # Si message simple, skip le RAG pour répondre plus vite
    if is_simple_message:
        return {
            **state,
            "niveau_dev": niveau_dev,
            "niveau_lisible": niveau_lisible,
            "competences_dev": competences_dev,
            "contexte_rag": "",
            "rag_disponible": False,
        }

    # 2. charge la doc si une technologie est spécifiée (cache ChromaDB)
    if state.get("technologie"):
        try:
            # Cette fonction vérifie d'abord si la doc existe déjà
            # Si oui, elle ne fait rien → pas de téléchargement répété
            charger_doc_technologie.invoke({"technologie": state["technologie"]})
        except Exception as e:
            logger.warning(f"Impossible de charger la doc {state['technologie']} : {e}")

    # 3. récupère les passages pertinents via le RAG
    contexte_rag = ""
    rag_disponible = False

    if state.get("technologie"):
        # détermine la query selon le type de tâche
        query = (
            state.get("question") or
            state.get("sujet") or
            state.get("enonce_exercice") or
            state["technologie"]
        )
        try:
            passages = rechercher_passages(state["technologie"], query, k=3)
            if passages:
                contexte_rag = "\n\n---\n\n".join(passages)
                rag_disponible = True
        except Exception as e:
            logger.warning(f"RAG indisponible pour {state['technologie']} : {e}")

    return {
        **state,
        "niveau_dev": niveau_dev,
        "niveau_lisible": niveau_lisible,
        "competences_dev": competences_dev,
        "contexte_rag": contexte_rag,
        "rag_disponible": rag_disponible,
    }

# ─── Nœud 2a : génération avec RAG ────────────────────────────────────────────

def _messages_assistant(state: AssistantState, human_prompt: str):
    # Les tours précédents conservent leur rôle dans la conversation avec le modèle.
    instruction = {"fr": "Réponds en français.", "en": "Reply in English."}.get(state.get("langue"), "")
    historique = [
        (HumanMessage if tour["role"] == "user" else AIMessage)(content=tour["content"])
        for tour in state.get("historique", [])
    ]
    return [
        SystemMessage(content=f"{ASSISTANT_SYSTEM_PROMPT}\n{instruction}"),
        *historique,
        HumanMessage(content=human_prompt),
    ]


def generer_avec_rag(state: AssistantState) -> AssistantState:
    """
    Génère une réponse enrichie par la documentation officielle (RAG).
    Appelé uniquement quand le RAG a retourné des passages pertinents.
    """
    try:
        llm = get_llm_assistant()
        tache = state["tache"]

        # Récupérer le contexte de cours s'il existe (pour savoir si le dev est dans un cours)
        contexte_cours = state.get("contexte_cours")

        # construit le prompt selon le type de tâche
        if tache == TACHE_QUESTION:
            human_prompt = question_prompt(
                question=state["question"],
                technologie=state["technologie"],
                niveau=state["niveau_lisible"],
                contexte_documentation=state["contexte_rag"],
                contexte_cours=contexte_cours
            )
        elif tache == TACHE_EXERCICE:
            human_prompt = exercice_prompt(
                technologie=state["technologie"],
                niveau=state["niveau_lisible"],
                sujet=state["sujet"],
                contexte_documentation=state["contexte_rag"]
            )
        elif tache == TACHE_CORRECTION:
            human_prompt = correction_prompt(
                code_soumis=state["code_soumis"],
                enonce_exercice=state["enonce_exercice"],
                technologie=state["technologie"],
                contexte_documentation=state["contexte_rag"]
            )
        else:
            # recommandation — pas de RAG nécessaire
            human_prompt = recommandation_prompt(
                competences_actuelles=state["competences_dev"],
                niveau=state["niveau_lisible"],
                domaine_interet=state.get("domaine_interet", "général")
            )

        reponse = llm.invoke(_messages_assistant(state, human_prompt))
        return {**state, "reponse": reponse.content.strip()}

    except Exception as e:
        logger.error(f"Erreur LLM avec RAG : {e}")
        return {**state, "reponse": ""}

# ─── Nœud 2b : génération sans RAG ────────────────────────────────────────────

def generer_sans_rag(state: AssistantState) -> AssistantState:
    """
    Génère une réponse basée uniquement sur la connaissance générale du LLM.
    Appelé quand le RAG n'a pas de documentation disponible.
    On prévient le dev que la réponse n'est pas basée sur la doc officielle.
    """
    try:
        llm = get_llm_assistant()
        tache = state["tache"]

        # Récupérer le contexte de cours s'il existe
        contexte_cours = state.get("contexte_cours")

        # contexte vide avec avertissement pour le LLM
        contexte_vide = (
            "Aucune documentation officielle disponible. "
            "Utilise tes connaissances générales mais précise-le dans ta réponse."
        )

        if tache == TACHE_QUESTION:
            human_prompt = question_prompt(
                question=state["question"],
                technologie=state.get("technologie", "général"),
                niveau=state["niveau_lisible"],
                contexte_documentation=contexte_vide,
                contexte_cours=contexte_cours
            )
        elif tache == TACHE_EXERCICE:
            human_prompt = exercice_prompt(
                technologie=state.get("technologie", "général"),
                niveau=state["niveau_lisible"],
                sujet=state["sujet"],
                contexte_documentation=contexte_vide
            )
        elif tache == TACHE_CORRECTION:
            human_prompt = correction_prompt(
                code_soumis=state["code_soumis"],
                enonce_exercice=state["enonce_exercice"],
                technologie=state.get("technologie", "général"),
                contexte_documentation=contexte_vide
            )
        else:
            human_prompt = recommandation_prompt(
                competences_actuelles=state["competences_dev"],
                niveau=state["niveau_lisible"],
                domaine_interet=state.get("domaine_interet", "général")
            )

        reponse = llm.invoke(_messages_assistant(state, human_prompt))
        return {**state, "reponse": reponse.content.strip()}

    except Exception as e:
        logger.error(f"Erreur LLM sans RAG : {e}")
        return {**state, "reponse": ""}

# ─── Nœud 3 : formatage de la réponse ────────────────────────────────────────

def formatter(state: AssistantState) -> AssistantState:
    """
    Dernier nœud — s'assure que la réponse est bien formatée.
    Ajoute une mention si la réponse n'est pas basée sur la doc officielle.
    """
    reponse = state.get("reponse", "")

    # si le RAG n'était pas disponible, ajoute une note en bas
    if reponse and not state["rag_disponible"] and state.get("technologie"):
        technologie = state["technologie"]
        note = (
            f"This answer is based on the model's general knowledge. The official {technologie} documentation was unavailable."
            if state.get("langue") == "en"
            else f"Cette réponse s’appuie sur les connaissances du modèle. La documentation officielle de {technologie} était indisponible."
        )
        reponse += f"\n\n---\n*{note}*"

    return {**state, "reponse": reponse}

# ─── Arête conditionnelle ──────────────────────────────────────────────────────

def router_apres_contexte(state: AssistantState) -> str:
    """
    Décide vers quel nœud aller après preparer_contexte.
    Si le RAG a des passages → utilise le RAG.
    Sinon → génère sans RAG (connaissance générale).
    """
    if state["rag_disponible"]:
        return "generer_avec_rag"
    return "generer_sans_rag"

# ─── Construction du graphe ────────────────────────────────────────────────────

def build_assistant_graph():
    """
    Construit et compile le graphe de l'agent assistant.
    """
    graphe = StateGraph(AssistantState)

    # ajoute les nœuds
    graphe.add_node("preparer_contexte", preparer_contexte)
    graphe.add_node("generer_avec_rag", generer_avec_rag)
    graphe.add_node("generer_sans_rag", generer_sans_rag)
    graphe.add_node("formatter", formatter)

    # point d'entrée
    graphe.add_edge(START, "preparer_contexte")

    # arête conditionnelle après préparation du contexte
    graphe.add_conditional_edges(
        "preparer_contexte",
        router_apres_contexte,
        {
            "generer_avec_rag": "generer_avec_rag",
            "generer_sans_rag": "generer_sans_rag",
        }
    )

    # les deux nœuds de génération convergent vers formatter
    graphe.add_edge("generer_avec_rag", "formatter")
    graphe.add_edge("generer_sans_rag", "formatter")

    # formatter → fin
    graphe.add_edge("formatter", END)

    return graphe.compile()

# ─── Instance singleton ────────────────────────────────────────────────────────

_assistant_graph = None

def get_assistant_graph():
    """
    Retourne l'instance compilée du graphe (singleton).
    """
    global _assistant_graph
    if _assistant_graph is None:
        _assistant_graph = build_assistant_graph()
    return _assistant_graph

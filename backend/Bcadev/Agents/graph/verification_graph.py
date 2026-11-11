# graphe agent vérification (nœuds + arêtes)

"""
agents/graph/verification_graph.py

Graphe LangGraph pour l'agent de vérification du contenu.

Architecture du graphe :
                    ┌─────────────────────────────┐
                    │           START              │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         pre_filtrer          │
                    │  (check_mots_interdits,      │
                    │   check_lien_suspect,        │
                    │   get_historique_signalements)│
                    └──────────────┬──────────────┘
                                   │
               ┌───────────────────▼──────────────────┐
               │          arête conditionnelle         │
               │  mots interdits trouvés ?             │
               └─────────┬──────────────────┬─────────┘
                          │ OUI              │ NON
           ┌──────────────▼──┐    ┌──────────▼──────────────┐
           │    finaliser    │    │    analyser_avec_llm     │
           │  (refus direct) │    │    (Groq + contexte)     │
           └──────────┬──────┘    └──────────┬──────────────┘
                      │                      │
                      └──────────┬───────────┘
                    ┌────────────▼────────────┐
                    │        finaliser        │
                    │  (construit le résultat)│
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │          END            │
                    └─────────────────────────┘

Avantage vs appel LLM direct :
- Si des mots interdits sont détectés → refus immédiat SANS appeler Groq
  → économie de tokens et réponse plus rapide
- L'historique des signalements du dev enrichit la décision du LLM
- Le graphe est réutilisable pour posts, offres et commentaires
"""

import json
import logging
from typing import TypedDict, Optional


from langgraph.graph import StateGraph, END, START
from langchain_core.messages import SystemMessage, HumanMessage

from Agents.llm.client import get_llm_verification
from Agents.prompt.verification_prompts import VERIFICATION_SYSTEM_PROMPT
from Agents.tools.moderation_tools import (
    check_mots_interdits,
    check_lien_suspect,
    get_historique_signalements,
)

logger = logging.getLogger(__name__)

# ─── État partagé entre les nœuds ─────────────────────────────────────────────
# TypedDict définit la structure de l'état — chaque nœud lit et écrit dans cet état
# C'est comme un "contexte" qui voyage de nœud en nœud tout au long du graphe

class VerificationState(TypedDict):
    # ── entrées (fournies au départ) ──
    contenu: str                    # texte du post, offre ou commentaire
    lien: Optional[str]             # URL optionnel joint au contenu
    email_auteur: Optional[str]     # email du dev qui soumet le contenu

    # ── résultats intermédiaires (remplis par les nœuds) ──
    mots_interdits: list            # mots interdits trouvés par pre_filtrer
    lien_suspect: bool              # True si le lien est suspect
    profil_risque: bool             # True si le dev a un historique suspect
    refus_immediat: bool            # True si on refuse sans appeler le LLM

    # ── décision finale ──
    approuve: bool                  # True si le contenu est approuvé
    raison: Optional[str]           # raison du refus si approuve=False
    niveau_confiance: str           # "faible", "moyen" ou "élevé"

# ─── Nœud 1 : pré-filtrage avec les outils ────────────────────────────────────

def pre_filtrer(state: VerificationState) -> VerificationState:
    """
    Premier nœud — analyse rapide avec les outils de modération.
    N'appelle PAS le LLM — utilise uniquement les outils locaux.

    Avantage : si des mots interdits sont trouvés ici, on n'a pas besoin
    d'appeler Groq → plus rapide et économise des tokens.
    """
    # 1. vérifie les mots interdits dans le contenu
    resultat_mots = check_mots_interdits.invoke({"texte": state["contenu"]})
    mots_trouves = resultat_mots.get("mots_trouves", [])

    # 2. vérifie le lien si présent
    lien_suspect = False
    if state.get("lien"):
        resultat_lien = check_lien_suspect.invoke({"url": state["lien"]})
        lien_suspect = resultat_lien.get("suspect", False)

    # 3. vérifie le profil du dev si l'email est fourni
    profil_risque = False
    if state.get("email_auteur"):
        resultat_profil = get_historique_signalements.invoke(
            {"email": state["email_auteur"]}
        )
        profil_risque = resultat_profil.get("profil_risque", False)

    # décision : refus immédiat si mots interdits trouvés
    # le lien suspect et le profil risque enrichissent le LLM mais ne bloquent pas seuls
    refus_immediat = len(mots_trouves) > 0

    return {
        **state,  # conserve tout l'état existant
        "mots_interdits": mots_trouves,
        "lien_suspect": lien_suspect,
        "profil_risque": profil_risque,
        "refus_immediat": refus_immediat,
    }

# ─── Nœud 2 : analyse avec le LLM ─────────────────────────────────────────────

def analyser_avec_llm(state: VerificationState) -> VerificationState:
    """
    Deuxième nœud — appelle le LLM avec le contexte enrichi par les outils.
    Ce nœud est appelé UNIQUEMENT si pre_filtrer n'a pas trouvé de mots interdits.

    On enrichit le prompt avec les résultats des outils pour que le LLM
    ait plus de contexte pour prendre sa décision.
    """
    try:
        llm = get_llm_verification()

        # on enrichit le prompt avec les résultats du pré-filtrage
        contexte_outils = ""
        if state["lien_suspect"]:
            contexte_outils += "\n⚠️ ATTENTION : Le lien joint semble suspect."
        if state["profil_risque"]:
            contexte_outils += "\n⚠️ ATTENTION : L'auteur a un historique de signalements."

        human_prompt = f"""
Analyse ce contenu soumis sur la plateforme :

CONTENU : {state["contenu"]}
{f"LIEN JOINT : {state['lien']}" if state.get("lien") else ""}
{contexte_outils}

Réponds uniquement avec le JSON demandé.
"""
        messages = [
            SystemMessage(content=VERIFICATION_SYSTEM_PROMPT),
            HumanMessage(content=human_prompt),
        ]

        reponse = llm.invoke(messages)
        contenu_reponse = reponse.content.strip()

        # nettoie le JSON si le LLM a ajouté des backticks
        if contenu_reponse.startswith("```"):
            contenu_reponse = contenu_reponse.split("```")[1]
            if contenu_reponse.startswith("json"):
                contenu_reponse = contenu_reponse[4:]

        resultat = json.loads(contenu_reponse)

        return {
            **state,
            "approuve": bool(resultat.get("approuve", True)),
            "raison": resultat.get("raison", None),
            "niveau_confiance": resultat.get("niveau_confiance", "moyen"),
        }

    except Exception as e:
        logger.error(f"Erreur LLM dans verification_graph : {e}")
        # en cas d'erreur, on approuve par défaut pour ne pas bloquer les devs
        return {
            **state,
            "approuve": True,
            "raison": None,
            "niveau_confiance": "faible",
        }

# ─── Nœud 3 : finalisation ────────────────────────────────────────────────────

def finaliser(state: VerificationState) -> VerificationState:
    """
    Dernier nœud — construit la décision finale.
    Appelé soit après le refus immédiat, soit après l'analyse LLM.

    Si refus_immediat=True, construit le message de refus à partir
    des mots interdits trouvés par les outils.
    """
    if state.get("refus_immediat"):
        # refus direct basé sur les outils — pas besoin du LLM
        mots = ", ".join(state["mots_interdits"])
        return {
            **state,
            "approuve": False,
            "raison": f"Contenu refusé automatiquement : mots interdits détectés ({mots}).",
            "niveau_confiance": "élevé",
        }

    # sinon la décision vient déjà de analyser_avec_llm
    return state

# ─── Arête conditionnelle ──────────────────────────────────────────────────────

def router_apres_filtrage(state: VerificationState) -> str:
    """
    Décide vers quel nœud aller après pre_filtrer.

    Si des mots interdits sont trouvés → on va directement à "finaliser"
    sans appeler le LLM (économie de tokens).

    Sinon → on va à "analyser_avec_llm" pour une analyse plus fine.
    """
    if state["refus_immediat"]:
        return "finaliser"
    return "analyser_avec_llm"

# ─── Construction du graphe ────────────────────────────────────────────────────

def build_verification_graph():
    """
    Construit et compile le graphe de vérification.
    La compilation valide la structure du graphe et l'optimise.

    Retourne un graphe compilé prêt à être invoqué.
    """
    # initialise le graphe avec notre état
    graphe = StateGraph(VerificationState)

    # ajoute les nœuds
    graphe.add_node("pre_filtrer", pre_filtrer)
    graphe.add_node("analyser_avec_llm", analyser_avec_llm)
    graphe.add_node("finaliser", finaliser)

    # définit le point d'entrée
    graphe.add_edge(START, "pre_filtrer")

    # arête conditionnelle après pre_filtrer
    graphe.add_conditional_edges(
        "pre_filtrer",          # nœud source
        router_apres_filtrage,  # fonction qui décide
        {
            "finaliser": "finaliser",           # si refus immédiat
            "analyser_avec_llm": "analyser_avec_llm"  # si analyse LLM
        }
    )

    # après l'analyse LLM → toujours vers finaliser
    graphe.add_edge("analyser_avec_llm", "finaliser")

    # finaliser → fin du graphe
    graphe.add_edge("finaliser", END)

    # compile le graphe
    return graphe.compile()

# ─── Instance singleton du graphe ─────────────────────────────────────────────
# On compile le graphe une seule fois au chargement du module
# pour ne pas le recompiler à chaque requête

_verification_graph = None

def get_verification_graph():
    """
    Retourne l'instance compilée du graphe (singleton).
    Compile le graphe au premier appel puis le réutilise.
    """
    global _verification_graph
    if _verification_graph is None:
        _verification_graph = build_verification_graph()
    return _verification_graph

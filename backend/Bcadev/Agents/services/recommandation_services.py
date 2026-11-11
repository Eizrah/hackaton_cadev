# recommandations offres/posts
"""
agents/services/recommandation_services.py

Service de recommandation personnalisée.
Recommande des offres d'emploi et des posts de forum
selon le profil du dev connecté (compétences, niveau, pays).

Flux complet :
    Django view → recommandation_service → base de données Django
                → LLM (scoring/matching) → résultats triés

Contrairement aux autres services, celui-ci fait aussi
des requêtes directes en base Django pour récupérer
les offres et posts avant de les scorer avec le LLM.

Exemple d'utilisation dans une vue Django :
    from Agents.services.recommandation_services import (
        recommander_offres,
        recommander_posts
    )

    offres = recommander_offres(dev)
    posts = recommander_posts(dev)
"""

import logging

from langchain_core.messages import SystemMessage, HumanMessage

from Forum.models import Forum_post
from Forum.serializers import ForumPostListSerializer
# import ici pour éviter les imports circulaires
from Jobs.models import Offre_Emploi, Candidature
from Jobs.serializers import OffreEmploiListSerializer
# client LLM
from Agents.llm.client import get_llm_assistant

logger = logging.getLogger(__name__)

# ─── Prompt système pour les recommandations ──────────────────────────────────
RECOMMANDATION_SYSTEM_PROMPT = """
Tu es un système de recommandation pour une plateforme de développeurs.
Tu analyses le profil d'un développeur et une liste de contenus disponibles
(offres d'emploi ou posts de forum) pour identifier les plus pertinents.

CRITÈRES DE PERTINENCE pour les offres :
- Correspondance entre les compétences du dev et celles requises
- Adéquation du niveau (débutant/intermédiaire/avancé)
- Localisation et type de travail (remote, sur site, hybride)

CRITÈRES DE PERTINENCE pour les posts :
- Correspondance avec les compétences et domaines du dev
- Niveau technique adapté au dev

FORMAT DE RÉPONSE OBLIGATOIRE :
Retourne uniquement une liste JSON d'IDs triés du plus pertinent au moins pertinent :
["id1", "id2", "id3", ...]
Ne réponds jamais autre chose que ce JSON.
"""

def _scorer_avec_llm(profil_dev: str, liste_contenus: str) -> list[str]:
    """
    Utilise le LLM pour scorer et trier une liste de contenus
    selon la pertinence par rapport au profil du dev.

    Retourne une liste d'IDs triés du plus pertinent au moins pertinent.
    En cas d'erreur, retourne une liste vide.
    """
    try:
        llm = get_llm_assistant(temperature=0.1)

        human_prompt = f"""
Voici le profil du développeur :
{profil_dev}

Voici les contenus disponibles :
{liste_contenus}

Trie ces contenus par pertinence pour ce développeur.
Retourne uniquement la liste JSON des IDs dans l'ordre de pertinence.
"""
        messages = [
            SystemMessage(content=RECOMMANDATION_SYSTEM_PROMPT),
            HumanMessage(content=human_prompt),
        ]

        reponse = llm.invoke(messages)
        contenu = reponse.content.strip()

        # nettoie le JSON si le LLM a ajouté des backticks
        if contenu.startswith("```"):
            contenu = contenu.split("```")[1]
            if contenu.startswith("json"):
                contenu = contenu[4:]

        import json
        ids_tries = json.loads(contenu)
        return ids_tries if isinstance(ids_tries, list) else []

    except Exception as e:
        logger.error(f"Erreur scoring recommandation : {e}")
        return []

def recommander_offres(dev, limite: int = 10) -> list:
    """
    Recommande des offres d'emploi pertinentes pour un dev.

    1. Récupère les offres validées en base Django
    2. Filtre les offres dont le dev n'est pas le créateur
    3. Filtre les offres auxquelles il n'a pas encore postulé
    4. Utilise le LLM pour trier par pertinence selon son profil
    5. Retourne les offres triées

    Paramètres :
    - dev : instance Developper (request.user)
    - limite : nombre max d'offres à retourner (défaut 10)
    """
    

    # récupère les offres validées que le dev n'a pas créées
    offres = Offre_Emploi.objects.filter(
        feu_vert=True
    ).exclude(
        developper=dev  # pas ses propres offres
    ).exclude(
        # pas les offres auxquelles il a déjà postulé
        candidature__developpeur=dev
    )[:50]  # on prend max 50 pour limiter la taille du prompt

    if not offres:
        return []

    # construit le profil du dev pour le LLM
    competences = list(dev.possessions.values_list('competence__nom_competence', flat=True))
    profil_dev = f"""
Niveau : {dev.get_niveau_display()}
Pays : {dev.pays}
Compétences : {', '.join(competences) if competences else 'non renseignées'}
"""

    # construit la liste des offres pour le LLM
    liste_contenus = ""
    offres_dict = {}
    for offre in offres:
        id_str = str(offre.id_publication)
        offres_dict[id_str] = offre
        liste_contenus += f"""
ID: {id_str}
Poste: {offre.nom_poste}
Localisation: {offre.localisation}
Type travail: {offre.type_travail}
Compétences requises: {offre.competence_requise}
---"""

    # demande au LLM de trier par pertinence
    ids_tries = _scorer_avec_llm(profil_dev, liste_contenus)

    # reconstruit la liste triée
    offres_triees = []
    for id_str in ids_tries[:limite]:
        if id_str in offres_dict:
            offres_triees.append(offres_dict[id_str])

    # si le LLM n'a pas retourné de résultats, retourne les offres sans tri
    if not offres_triees:
        offres_triees = list(offres[:limite])

    return OffreEmploiListSerializer(offres_triees, many=True).data

def recommander_posts(dev, limite: int = 10) -> list:
    """
    Recommande des posts de forum pertinents pour un dev.

    1. Récupère les posts validés en base Django
    2. Exclut les posts du dev lui-même
    3. Utilise le LLM pour trier par pertinence selon son profil
    4. Retourne les posts triés

    Paramètres :
    - dev : instance Developper (request.user)
    - limite : nombre max de posts à retourner (défaut 10)
    """


    # récupère les posts validés que le dev n'a pas créés
    posts = Forum_post.objects.filter(
        feu_vert=True
    ).exclude(
        developper=dev
    ).order_by('-date_publication')[:50]

    if not posts:
        return []

    # profil du dev
    competences = list(dev.possessions.values_list('competence__nom_competence', flat=True))
    profil_dev = f"""
Niveau : {dev.get_niveau_display()}
Compétences : {', '.join(competences) if competences else 'non renseignées'}
"""

    # liste des posts pour le LLM
    liste_contenus = ""
    posts_dict = {}
    for post in posts:
        id_str = str(post.id_publication)
        posts_dict[id_str] = post
        # on tronque la description à 200 caractères pour ne pas surcharger le prompt
        description_courte = post.description[:200] + "..." if len(post.description) > 200 else post.description
        liste_contenus += f"""
ID: {id_str}
Description: {description_courte}
---"""

    # trie par pertinence avec le LLM
    ids_tries = _scorer_avec_llm(profil_dev, liste_contenus)

    # reconstruit la liste triée
    posts_tries = []
    for id_str in ids_tries[:limite]:
        if id_str in posts_dict:
            posts_tries.append(posts_dict[id_str])

    # fallback si le LLM n'a rien retourné
    if not posts_tries:
        posts_tries = list(posts[:limite])

    return ForumPostListSerializer(posts_tries, many=True).data

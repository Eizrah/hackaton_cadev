"""
Agents/services/session_service.py

Service de conversation avec l'agent IA dans le contexte d'une session.
Contrairement à assistant_service.py qui répond à une seule question,
ce service garde l'historique complet de la conversation.

Flux :
    Dev envoie message → session_service récupère l'historique
    → construit le contexte complet → LLM répond
    → réponse sauvegardée en base comme Message(role='assistant')

L'agent analyse le profil du dev (niveau, compétences, expériences)
pour personnaliser ses réponses.
"""

import logging
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from Agents.llm.client import get_llm_assistant

logger = logging.getLogger(__name__)

# ─── Prompt système de l'agent de session ─────────────────────────────────────
SESSION_SYSTEM_PROMPT = """
Tu es un assistant spécialisé en informatique et développement logiciel.
Tu discutes avec un développeur sur une plateforme dédiée aux développeurs.

TON RÔLE :
- Répondre aux questions techniques liées à la programmation
- Aider à comprendre des concepts informatiques
- Expliquer des erreurs de code et proposer des solutions
- Adapter tes explications au niveau du développeur

DOMAINE STRICT :
- Tu réponds UNIQUEMENT aux questions liées à l'informatique,
  la programmation, le développement logiciel, les bases de données,
  les réseaux, le DevOps, la cybersécurité et les métiers du numérique.
- Si une question est hors sujet, réponds :
  "Je suis spécialisé en informatique. Je ne peux pas t'aider sur ce sujet,
   mais je serais ravi de répondre à toutes tes questions techniques !"

PERSONNALISATION :
- Tu connais le profil du développeur (fourni ci-dessous)
- Adapte tes réponses à son niveau et ses compétences
- Encourage-le dans son apprentissage

FORMAT :
- Utilise le markdown pour structurer tes réponses
- Mets le code dans des blocs ```langage ... ```
- Sois concis mais complet
- Tu peux répondre en français ou en anglais selon la langue du dev
"""

def _construire_profil_dev(dev) -> str:
    """
    Construit une description textuelle du profil du dev
    pour que l'agent puisse personnaliser ses réponses.
    """
    niveaux = {"D": "débutant", "I": "intermédiaire", "A": "avancé"}
    niveau = niveaux.get(dev.niveau, "intermédiaire")

    competences = list(
        dev.possessions.values_list('competence__nom_competence', flat=True)
    )

    # récupère les expériences
    try:
        experiences = list(
            dev.experience_set.values_list('nom_poste', flat=True)
        )
    except Exception:
        experiences = []

    profil = f"""
PROFIL DU DÉVELOPPEUR :
- Pseudo : {dev.pseudo}
- Niveau : {niveau}
- Pays : {dev.pays}
- Compétences : {', '.join(competences) if competences else 'non renseignées'}
- Expériences : {', '.join(experiences) if experiences else 'non renseignées'}
"""
    return profil

def _recuperer_historique(session) -> list:
    """
    Récupère l'historique des messages de la session
    et les convertit en format LangChain.

    LangChain comprend 3 types de messages :
    - HumanMessage → message du dev (role='user')
    - AIMessage → réponse de l'agent (role='assistant')
    - SystemMessage → instructions système (envoyé une seule fois au début)
    """
    from Messaging.models import Message

    messages_db = Message.objects.filter(
        session=session
    ).order_by('date_envoie')

    historique = []
    for msg in messages_db:
        if msg.contenu and not msg.supprime:
            if msg.role == 'user':
                historique.append(HumanMessage(content=msg.contenu))
            elif msg.role == 'assistant':
                historique.append(AIMessage(content=msg.contenu))

    return historique

def discuter(session, dev, message_user: str) -> str:
    """
    Envoie un message dans une session et retourne la réponse de l'agent.

    1. Sauvegarde le message du dev en base (role='user')
    2. Récupère l'historique de la session
    3. Appelle le LLM avec le profil du dev + historique + nouveau message
    4. Sauvegarde la réponse de l'agent en base (role='assistant')
    5. Retourne la réponse

    Paramètres :
    - session : instance Session
    - dev : instance Developper (request.user)
    - message_user : texte du message envoyé par le dev
    """
    from Messaging.models import Message

    # 1. sauvegarde le message du dev
    Message.objects.create(
        contenu=message_user,
        envoyeur=dev,
        session=session,
        role='user',
        etat='envoye'
    )

    # 2. récupère l'historique complet de la session
    historique = _recuperer_historique(session)

    # 3. construit le profil du dev pour personnaliser la réponse
    profil_dev = _construire_profil_dev(dev)

    # 4. construit la liste de messages pour le LLM
    # SystemMessage = instructions + profil du dev
    # historique = tous les messages précédents
    messages_llm = [
        SystemMessage(content=SESSION_SYSTEM_PROMPT + profil_dev),
        *historique,  # déploie l'historique dans la liste
    ]

    # 5. appelle le LLM
    try:
        llm = get_llm_assistant()
        reponse = llm.invoke(messages_llm)
        contenu_reponse = reponse.content.strip()
    except Exception as e:
        logger.error(f"Erreur LLM session : {e}")
        contenu_reponse = "L'assistant est temporairement indisponible. Réessaie dans quelques instants."

    # 6. sauvegarde la réponse de l'agent en base
    # envoyeur est le dev mais role='assistant' distingue les messages IA
    Message.objects.create(
        contenu=contenu_reponse,
        envoyeur=dev,       # techniquement l'envoyeur est le dev (owner de la session)
        session=session,
        role='assistant',
        etat='envoye'
    )

    return contenu_reponse

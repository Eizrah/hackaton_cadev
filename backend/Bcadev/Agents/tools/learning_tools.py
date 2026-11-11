# générer exercices, corriger code, recommander

"""
agents/tools/learning_tools.py

Outils pédagogiques pour l'agent assistant.
Ces outils permettent à l'agent de :
- Vérifier ce que le dev sait déjà avant de générer un exercice
- Charger la documentation si elle n'est pas encore dans ChromaDB
- Chercher une compétence dans la base Django

Comme pour moderation_tools.py, chaque fonction est décorée
avec @tool pour que LangGraph puisse les appeler automatiquement.
"""

from langchain_core.tools import tool

@tool
def chercher_competence(nom_competence: str) -> dict:
    """
    Vérifie si une compétence existe dans la base de données de la plateforme.
    Utilise cet outil avant de générer un exercice pour t'assurer que la
    compétence demandée est bien référencée dans le système.
    Retourne les détails de la compétence si elle existe.
    """
    try:
        import django
        import os
        if not os.environ.get('DJANGO_SETTINGS_MODULE'):
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
            django.setup()

        from Learning.models import Competence
        from django.db.models import Q

        # recherche insensible à la casse
        competence = Competence.objects.filter(
            Q(nom_competence__icontains=nom_competence)
        ).first()

        if not competence:
            return {
                "existe": False,
                "nom": nom_competence,
                "message": f"Compétence '{nom_competence}' non trouvée dans la base."
            }

        return {
            "existe": True,
            "id": str(competence.id_competence),
            "nom": competence.nom_competence,
            "domaine": competence.domaine,
            "difficulte": competence.difficulte,
        }

    except Exception as e:
        return {
            "existe": False,
            "nom": nom_competence,
            "erreur": str(e)
        }

@tool
def dev_a_competence(email: str, nom_competence: str) -> dict:
    """
    Vérifie si un développeur possède déjà une compétence spécifique.
    Utilise cet outil pour adapter le niveau des exercices générés.
    Si le dev possède déjà la compétence, génère un exercice avancé.
    Sinon, commence par les bases.
    """
    try:
        import django
        import os
        if not os.environ.get('DJANGO_SETTINGS_MODULE'):
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
            django.setup()

        from Accounts.models import Developper, Possession
        from Learning.models import Competence
        from django.db.models import Q

        dev = Developper.objects.get(email=email)

        # vérifie dans les possessions du dev
        possession = Possession.objects.filter(
            developper=dev,
            competence__nom_competence__icontains=nom_competence
        ).first()

        # vérifie aussi dans les apprentissages terminés
        from Learning.models import Apprentissage
        apprentissage_termine = Apprentissage.objects.filter(
            id_apprenant=dev,
            id_competence__nom_competence__icontains=nom_competence,
            avancement='termine'
        ).first()

        possede = possession is not None or apprentissage_termine is not None

        return {
            "email": email,
            "competence": nom_competence,
            "possede": possede,
            "via_possession": possession is not None,
            "via_apprentissage": apprentissage_termine is not None,
            # conseil pour l'agent sur le niveau d'exercice à générer
            "conseil": "Génère un exercice avancé" if possede else "Commence par les bases"
        }

    except Exception as e:
        return {
            "email": email,
            "competence": nom_competence,
            "possede": False,
            "erreur": str(e)
        }

@tool
def charger_doc_technologie(technologie: str) -> dict:
    """
    Charge la documentation officielle d'une technologie dans ChromaDB
    si elle n'est pas encore disponible.
    Utilise cet outil quand un dev pose une question sur une technologie
    dont la documentation n'est pas encore indexée.
    Retourne le nombre de passages indexés ou un message d'erreur.
    """
    try:
        # import depuis le RAG — dans le même venv agents
        from Agents.rag.vectorstore import charger_documentation, get_vectorstore

        # vérifie d'abord si la collection existe déjà dans ChromaDB
        vectorstore = get_vectorstore(technologie)
        collection = vectorstore._collection
        count = collection.count()

        if count > 0:
            # la doc est déjà chargée — pas besoin de recharger
            return {
                "technologie": technologie,
                "deja_chargee": True,
                "nombre_passages": count,
                "message": f"Documentation {technologie} déjà disponible ({count} passages)"
            }

        # charge la documentation depuis le web
        nombre_chunks = charger_documentation(technologie)

        return {
            "technologie": technologie,
            "deja_chargee": False,
            "nombre_passages": nombre_chunks,
            "message": f"Documentation {technologie} chargée avec succès ({nombre_chunks} passages)"
        }

    except ValueError as e:
        # technologie non supportée
        return {
            "technologie": technologie,
            "erreur": str(e),
            "message": f"Technologie '{technologie}' non supportée dans le RAG"
        }
    except Exception as e:
        return {
            "technologie": technologie,
            "erreur": str(e),
            "message": "Erreur lors du chargement de la documentation"
        }

@tool
def get_niveau_dev(email: str) -> dict:
    """
    Récupère le niveau et les informations pédagogiques d'un développeur.
    Utilise cet outil pour adapter le contenu généré au niveau réel du dev.
    Retourne le niveau, les compétences possédées et les apprentissages en cours.
    """
    try:
        import django
        import os
        if not os.environ.get('DJANGO_SETTINGS_MODULE'):
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Bcadev.settings')
            django.setup()

        from Accounts.models import Developper
        from Learning.models import Apprentissage

        dev = Developper.objects.get(email=email)

        # compétences déjà possédées
        competences_possedees = list(
            dev.possessions.values_list('competence__nom_competence', flat=True)
        )

        # apprentissages en cours
        apprentissages_en_cours = list(
            Apprentissage.objects.filter(
                id_apprenant=dev,
                avancement='en_cours'
            ).values_list('id_competence__nom_competence', flat=True)
        )

        niveaux = {"D": "débutant", "I": "intermédiaire", "A": "avancé"}

        return {
            "email": email,
            "niveau": dev.niveau,
            "niveau_lisible": niveaux.get(dev.niveau, "intermédiaire"),
            "competences_possedees": competences_possedees,
            "apprentissages_en_cours": apprentissages_en_cours,
            "nombre_competences": len(competences_possedees)
        }

    except Exception as e:
        return {
            "email": email,
            "niveau": "I",
            "niveau_lisible": "intermédiaire",
            "competences_possedees": [],
            "apprentissages_en_cours": [],
            "erreur": str(e)
        }

# ─── Liste des outils disponibles pour l'agent assistant ──────────────────────
LEARNING_TOOLS = [
    chercher_competence,
    dev_a_competence,
    charger_doc_technologie,
    get_niveau_dev,
]

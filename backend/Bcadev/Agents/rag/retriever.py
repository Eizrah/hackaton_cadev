 # récupération documents pertinents

"""

Récupération des passages pertinents depuis ChromaDB.
Utilisé par les agents pour enrichir leurs réponses avec
la documentation officielle.
"""
from langchain_core.vectorstores import VectorStoreRetriever
from .vectorstore import get_vectorstore

def get_retriever(technologie: str, k: int = 3) -> VectorStoreRetriever:
    """
    Retourne un retriever pour une technologie donnée.

    Paramètres :
    - technologie : "react", "vue", "django", "python", "typescript"
    - k : nombre de passages pertinents à retourner (défaut 3)

    Exemple :
        retriever = get_retriever("react")
        passages = retriever.invoke("Comment fonctionne useEffect ?")
    """
    vectorstore = get_vectorstore(technologie)
    return vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k}
    )

def rechercher_passages(technologie: str, question: str, k: int = 3) -> list[str]:
    """
    Raccourci pour récupérer directement les passages pertinents.
    Retourne une liste de textes à injecter dans le prompt de l'agent.
    Retourne une liste vide si la technologie n'est pas supportée.
    """
    from Agents.rag.vectorstore import DOCS_URLS
    # si la technologie n'est pas dans notre liste, on retourne vide
    # le LLM utilisera sa connaissance générale
    if technologie.lower() not in DOCS_URLS:
        return []
    try:
        retriever = get_retriever(technologie.lower(), k)
        documents = retriever.invoke(question)
        return [doc.page_content for doc in documents]
    except Exception:
        return []

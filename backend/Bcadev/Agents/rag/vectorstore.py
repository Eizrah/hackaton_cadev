# initialisation et gestion de ChromaDB

"""
agents/rag/vectorstore.py
Gestion de ChromaDB — stockage et récupération des vecteurs.
Chaque technologie (React, Vue, Django...) a sa propre collection.
"""
from pathlib import Path
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .embeddings import get_embeddings

# dossier où ChromaDB stocke les vecteurs sur le disque
CHROMA_DIR = str(Path(__file__).resolve().parent.parent.parent / "chroma_db")

# URLs officielles des documentations par technologie
DOCS_URLS = {
    "react": [
        "https://react.dev/reference/react",
        "https://react.dev/learn",
    ],
    "vue": [
        "https://vuejs.org/guide/introduction",
    ],
    "angular": [
        "https://angular.dev/overview",
        "https://angular.dev/tutorials",
    ],
    "django": [
        "https://docs.djangoproject.com/en/5.0/topics/",
    ],
    "python": [
        "https://docs.python.org/3/tutorial/",
    ],
    "typescript": [
        "https://www.typescriptlang.org/docs/handbook/intro.html",
    ],
    "javascript": [
        "https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide",
    ],
    "nodejs": [
        "https://nodejs.org/en/docs/",
    ],
}

def get_vectorstore(collection_name: str) -> Chroma:
    """
    Retourne la collection ChromaDB pour une technologie donnée.
    Si la collection n'existe pas encore, elle sera créée lors
    du premier chargement de la documentation.
    """
    return Chroma(
        collection_name=collection_name,
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_DIR,
    )

def charger_documentation(technologie: str) -> int:
    """
    Charge la documentation officielle d'une technologie dans ChromaDB.
    Retourne le nombre de chunks indexés.
    À appeler une seule fois par technologie (ou pour mettre à jour).
    """
    if technologie not in DOCS_URLS:
        raise ValueError(f"Technologie '{technologie}' non supportée. Disponibles : {list(DOCS_URLS.keys())}")

    # charge les pages de documentation
    loader = WebBaseLoader(DOCS_URLS[technologie])
    documents = loader.load()

    # découpe en morceaux de 500 caractères avec chevauchement de 50
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_documents(documents)

    # stocke dans ChromaDB
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        collection_name=technologie,
        persist_directory=CHROMA_DIR,
    )

    return len(chunks)

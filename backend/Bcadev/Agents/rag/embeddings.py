# génération embeddings avec HuggingFace

"""
Génération des embeddings avec sentence-transformers (HuggingFace).

"""
from langchain_huggingface import HuggingFaceEmbeddings

# modèle léger ~90MB, rapide et efficace pour du texte technique
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Retourne le modèle d'embeddings.
    Le modèle est téléchargé automatiquement au premier appel
    puis mis en cache localement.
    """
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )

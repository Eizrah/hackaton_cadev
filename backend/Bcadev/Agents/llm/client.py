"""
agents/llm/client.py
Client LLM partagé avec fallback automatique Groq → OpenRouter.
"""
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from .config import (
    GROQ_API_KEY,
    OPENROUTER_API_KEY,
    GROQ_MODEL_VERIFICATION,
    GROQ_MODEL_ASSISTANT,
    OPENROUTER_MODEL_FALLBACK,
)

def get_llm_verification(temperature: float = 0.1):
    """
    LLM pour l'agent vérification.
    Temperature très basse — réponses déterministes et structurées.
    Fallback automatique vers OpenRouter si Groq est indisponible.
    """
    llm_principal = ChatGroq(
        model=GROQ_MODEL_VERIFICATION,
        api_key=GROQ_API_KEY,
        temperature=temperature,
    )
    llm_backup = ChatOpenAI(
        model=OPENROUTER_MODEL_FALLBACK,
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
        temperature=temperature,
    )
    return llm_principal.with_fallbacks([llm_backup])

def get_llm_assistant(temperature: float = 0.4):
    """
    LLM pour l'agent assistant pédagogique.
    Temperature plus haute — réponses variées et pédagogiques.
    Fallback automatique vers OpenRouter si Groq est indisponible.
    """
    llm_principal = ChatGroq(
        model=GROQ_MODEL_ASSISTANT,
        api_key=GROQ_API_KEY,
        temperature=temperature,
    )
    llm_backup = ChatOpenAI(
        model=OPENROUTER_MODEL_FALLBACK,
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
        temperature=temperature,
    )
    return llm_principal.with_fallbacks([llm_backup])

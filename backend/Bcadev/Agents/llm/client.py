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


def _get_llm(modele_groq, temperature):
    # Charge uniquement les fournisseurs configurés. Groq garde la priorité.
    if not GROQ_API_KEY and not OPENROUTER_API_KEY:
        raise RuntimeError("Aucun fournisseur IA n'est configuré.")

    groq = ChatGroq(
        model=modele_groq,
        api_key=GROQ_API_KEY,
        temperature=temperature,
        timeout=20,
        max_retries=0,
    ) if GROQ_API_KEY else None
    openrouter = ChatOpenAI(
        model=OPENROUTER_MODEL_FALLBACK,
        api_key=OPENROUTER_API_KEY,
        base_url="https://openrouter.ai/api/v1",
        temperature=temperature,
        timeout=20,
        max_retries=0,
    ) if OPENROUTER_API_KEY else None
    if groq is not None and openrouter is not None:
        return groq.with_fallbacks([openrouter])
    return groq if groq is not None else openrouter


def get_llm_verification(temperature: float = 0.1):
    return _get_llm(GROQ_MODEL_VERIFICATION, temperature)


def get_llm_assistant(temperature: float = 0.4):
    return _get_llm(GROQ_MODEL_ASSISTANT, temperature)

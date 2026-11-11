"""
agents/llm/config.py
Charge les variables d'environnement pour les LLMs.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# remonte jusqu'au .env à la racine du projet Django
ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GROQ_MODEL_VERIFICATION = os.getenv("GROQ_MODEL_VERIFICATION", "llama-3.3-70b-versatile")
GROQ_MODEL_ASSISTANT = os.getenv("GROQ_MODEL_ASSISTANT", "llama-3.3-70b-versatile")
OPENROUTER_MODEL_FALLBACK = os.getenv("OPENROUTER_MODEL_FALLBACK", "mistralai/mistral-7b-instruct")

if not GROQ_API_KEY:
    raise RuntimeError(f"GROQ_API_KEY manquante dans {ENV_PATH}")

if not OPENROUTER_API_KEY:
    raise RuntimeError(f"OPENROUTER_API_KEY manquante dans {ENV_PATH}")

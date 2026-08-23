from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
# Root .env first, then local overrides
load_dotenv(ROOT.parent / ".env", override=True)
load_dotenv(ROOT / ".env", override=True)

DATA_DIR = ROOT / "data"
VECTOR_DIR = ROOT / "vector_db"
PROMPTS_DIR = ROOT / "prompts"

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
LLM_MODEL = os.getenv("AURA_LLM_MODEL", os.getenv("VITE_OLLAMA_MODEL", "llama3.2:1b"))
EMBED_MODEL = os.getenv("AURA_EMBED_MODEL", "nomic-embed-text")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_MAX_TOKENS = int(os.getenv("GROQ_MAX_TOKENS", "180"))
GROQ_TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", "0.15"))

# groq = cloud LLM (fast, cheap) | ollama = local fallback
_default_provider = "groq" if GROQ_API_KEY else "ollama"
LLM_PROVIDER = os.getenv("AURA_LLM_PROVIDER", _default_provider).lower()

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY", "")

HOST = os.getenv("AURA_CHATBOT_HOST", "127.0.0.1")
PORT = int(os.getenv("AURA_CHATBOT_PORT", "8000"))

PRODUCTS_COLLECTION = "aura_products"
KNOWLEDGE_COLLECTION = "aura_knowledge"

RAG_TOP_K = int(os.getenv("AURA_RAG_TOP_K", "3"))

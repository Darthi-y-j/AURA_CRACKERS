# AURA RAG Chatbot Backend

FastAPI + ChromaDB + Ollama RAG server for the Aura Crackers website.

## Architecture

```
Website (Chatbot UI)
       ↓
FastAPI (/chat)
       ↓
Intent Router + RAG (ChromaDB) + Live Supabase
       ↓
Ollama LLM (llama3.2:1b) + Embeddings (nomic-embed-text)
       ↓
Text response + product cards
```

## Setup

## LLM: Groq (recommended) or Ollama (fallback)

**Default: Groq `llama-3.1-8b-instant`** — cheapest Groq model (~$0.05/$0.08 per 1M tokens), very fast.

Add to root `.env`:

```
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
AURA_LLM_PROVIDER=groq
```

Embeddings still use local Ollama (`nomic-embed-text`) for RAG — only chat goes to Groq.

To use local Ollama for chat instead: `AURA_LLM_PROVIDER=ollama`

### 1. Ollama models (embeddings only)

```powershell
ollama pull llama3.2:1b
ollama pull nomic-embed-text
```

Optional larger LLM: `ollama pull gemma3`

### 2. Python environment

```powershell
cd aura-chatbot
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment

Copy `.env.example` to `.env` or use values from the root `.env`:

```
SUPABASE_URL=...
SUPABASE_KEY=...
AURA_LLM_MODEL=llama3.2:1b
AURA_EMBED_MODEL=nomic-embed-text
```

### 4. Export products & build vector index

```powershell
python scripts/export_products.py
python -m backend.embeddings
```

Re-run `python -m backend.embeddings` whenever products or FAQ change.

### 5. Start API

```powershell
# From aura-chatbot/ with venv active
python -m backend.main
```

Or from project root:

```powershell
npm run chatbot
```

API: `http://127.0.0.1:8000`  
Health: `GET /health`  
Chat: `POST /chat` `{ "message": "...", "history": [] }`  
Re-index: `POST /index`

## Frontend

The Vite dev server proxies `/api/chatbot` → FastAPI.  
Set `VITE_CHATBOT_API=/api/chatbot` in root `.env` (default).

The chatbot auto-detects the RAG backend; if offline, it falls back to direct Ollama.

## Custom Ollama model (optional)

See `ollama/Modelfile` in project root. After RAG works:

```powershell
ollama create aura-assistant -f ollama/Modelfile
```

Set `AURA_LLM_MODEL=aura-assistant` in `.env`.

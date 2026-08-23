from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .chatbot import get_llm_info, handle_chat
from .config import HOST, PORT
from .database import supabase_configured
from .embeddings import index_all

app = FastAPI(title="AURA Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def log_llm_config() -> None:
    llm = get_llm_info()
    print(f"AURA chatbot LLM: {llm['provider']} / {llm['model']}")


class HistoryTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[HistoryTurn] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str
    products: list[dict] = Field(default_factory=list)
    intent: str = "general"


class HealthResponse(BaseModel):
    status: str
    llm_provider: str
    llm_model: str
    supabase: bool
    vector_db: bool


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    from .config import VECTOR_DIR

    llm = get_llm_info()
    has_vectors = (VECTOR_DIR / "chroma.sqlite3").exists()
    return HealthResponse(
        status="ok",
        llm_provider=llm["provider"],
        llm_model=llm["model"],
        supabase=supabase_configured(),
        vector_db=has_vectors,
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        result = await handle_chat(
            request.message,
            [turn.model_dump() for turn in request.history],
        )
        return ChatResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/index")
async def rebuild_index() -> dict:
    try:
        counts = await index_all()
        return {"status": "ok", **counts}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def run() -> None:
    import uvicorn

    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=False)


if __name__ == "__main__":
    run()

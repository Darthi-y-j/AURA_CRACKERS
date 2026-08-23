from __future__ import annotations

import asyncio
from typing import Any

import chromadb
import ollama

from .config import EMBED_MODEL, KNOWLEDGE_COLLECTION, PRODUCTS_COLLECTION, RAG_TOP_K, VECTOR_DIR

_chroma_client: chromadb.PersistentClient | None = None


def get_chroma_client() -> chromadb.PersistentClient:
    global _chroma_client
    if _chroma_client is None:
        VECTOR_DIR.mkdir(parents=True, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=str(VECTOR_DIR))
    return _chroma_client


def _embed_query(query: str) -> list[float]:
    return ollama.embed(model=EMBED_MODEL, input=query)["embeddings"][0]


def _query_collection_with_embedding(
    name: str,
    embedding: list[float],
    n_results: int,
) -> list[dict[str, Any]]:
    client = get_chroma_client()
    try:
        collection = client.get_collection(name)
    except Exception:
        return []

    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    items: list[dict[str, Any]] = []
    docs = results.get("documents") or [[]]
    metas = results.get("metadatas") or [[]]
    for doc, meta in zip(docs[0], metas[0]):
        items.append({"document": doc, "metadata": meta or {}})
    return items


async def build_context(query: str) -> tuple[str, list[str]]:
    """One local embed + parallel Chroma lookups (Groq only sees the result)."""
    embedding = await asyncio.to_thread(_embed_query, query)

    product_hits, knowledge_hits = await asyncio.gather(
        asyncio.to_thread(
            _query_collection_with_embedding,
            PRODUCTS_COLLECTION,
            embedding,
            RAG_TOP_K,
        ),
        asyncio.to_thread(
            _query_collection_with_embedding,
            KNOWLEDGE_COLLECTION,
            embedding,
            2,
        ),
    )

    sections: list[str] = []
    product_ids: list[str] = []

    if product_hits:
        sections.append("=== RELEVANT PRODUCTS ===")
        for hit in product_hits:
            sections.append(hit["document"])
            pid = hit["metadata"].get("product_id")
            if pid:
                product_ids.append(str(pid))

    if knowledge_hits:
        sections.append("=== FAQ / POLICIES / SAFETY ===")
        for hit in knowledge_hits:
            sections.append(hit["document"])

    return "\n\n".join(sections), product_ids

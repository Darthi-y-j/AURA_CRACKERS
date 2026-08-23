from __future__ import annotations

import asyncio
import json
from typing import Any

import chromadb
import ollama

from .config import (
    DATA_DIR,
    EMBED_MODEL,
    KNOWLEDGE_COLLECTION,
    PRODUCTS_COLLECTION,
    VECTOR_DIR,
)
from .database import fetch_products, product_to_document, supabase_configured


def get_chroma_client() -> chromadb.PersistentClient:
    VECTOR_DIR.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(VECTOR_DIR))


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    response = ollama.embed(model=EMBED_MODEL, input=texts)
    return response["embeddings"]


def _load_json(name: str) -> Any:
    path = DATA_DIR / name
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def _knowledge_documents() -> tuple[list[str], list[str], list[dict[str, Any]]]:
    documents: list[str] = []
    ids: list[str] = []
    metadatas: list[dict[str, Any]] = []

    for i, item in enumerate(_load_json("faq.json")):
        text = f"FAQ\nQuestion: {item['question']}\nAnswer: {item['answer']}"
        documents.append(text)
        ids.append(f"faq-{i}")
        metadatas.append({"type": "faq", "topic": item["question"][:80]})

    for i, item in enumerate(_load_json("safety.json")):
        text = f"Safety — {item['topic']}\n{item['content']}"
        documents.append(text)
        ids.append(f"safety-{i}")
        metadatas.append({"type": "safety", "topic": item["topic"]})

    policies = _load_json("policies.json")
    policy_text = "\n".join(f"{k.replace('_', ' ').title()}: {v}" for k, v in policies.items())
    documents.append(f"Business Policies\n{policy_text}")
    ids.append("policies-0")
    metadatas.append({"type": "policies", "topic": "business policies"})

    return documents, ids, metadatas


async def index_products() -> int:
    products = await fetch_products(include_unavailable=True)
    if not products:
        print("No products found — run scripts/export_products.py or configure Supabase.")
        return 0

    client = get_chroma_client()
    try:
        client.delete_collection(PRODUCTS_COLLECTION)
    except Exception:
        pass
    collection = client.create_collection(name=PRODUCTS_COLLECTION)

    documents = [product_to_document(p) for p in products]
    ids = [str(p["id"]) for p in products]
    metadatas = [
        {
            "type": "product",
            "product_id": str(p["id"]),
            "slug": p.get("slug", ""),
            "name": p.get("name", ""),
        }
        for p in products
    ]

    batch_size = 32
    for start in range(0, len(documents), batch_size):
        end = start + batch_size
        batch_docs = documents[start:end]
        batch_ids = ids[start:end]
        batch_meta = metadatas[start:end]
        embeddings = embed_texts(batch_docs)
        collection.add(
            ids=batch_ids,
            documents=batch_docs,
            embeddings=embeddings,
            metadatas=batch_meta,
        )

    print(f"Indexed {len(products)} products into ChromaDB.")
    return len(products)


def index_knowledge() -> int:
    documents, ids, metadatas = _knowledge_documents()
    client = get_chroma_client()
    try:
        client.delete_collection(KNOWLEDGE_COLLECTION)
    except Exception:
        pass
    collection = client.create_collection(name=KNOWLEDGE_COLLECTION)

    embeddings = embed_texts(documents)
    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )
    print(f"Indexed {len(documents)} knowledge documents.")
    return len(documents)


async def index_all() -> dict[str, int]:
    product_count = await index_products()
    knowledge_count = index_knowledge()
    return {"products": product_count, "knowledge": knowledge_count}


def main() -> None:
    result = asyncio.run(index_all())
    print("AURA knowledge indexed:", result)


if __name__ == "__main__":
    main()

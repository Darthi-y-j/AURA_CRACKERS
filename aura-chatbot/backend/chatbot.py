from __future__ import annotations

import re
from typing import Any, Literal

import ollama

from .config import GROQ_MODEL, LLM_MODEL, LLM_PROVIDER, PROMPTS_DIR
from .database import (
    build_budget_collection,
    fetch_products,
    fetch_products_by_ids,
    product_to_card,
    product_to_document,
    search_products_live,
)
from .groq_llm import groq_chat, groq_configured
from .rag import build_context

Intent = Literal[
    "greeting",
    "budget_recommendation",
    "product_search",
    "availability",
    "general",
]

GREETING_REPLY = "Hello! How can I help you with products, ordering, or delivery?"

# Short few-shot — Groq 8B learns quickly; smaller prompt = faster
FEW_SHOT_MESSAGES: list[dict[str, str]] = [
    {"role": "user", "content": "hello"},
    {"role": "assistant", "content": GREETING_REPLY},
    {"role": "user", "content": "how do I order?"},
    {
        "role": "assistant",
        "content": "Add items to cart, then send a WhatsApp enquiry from the Cart page. Our team confirms price and delivery.",
    },
]


def detect_intent(message: str) -> tuple[Intent, dict[str, Any]]:
    text = message.lower().strip()
    meta: dict[str, Any] = {}

    if re.search(r"\b(hi|hello|hey|good morning|good evening|good afternoon|namaste)\b", text):
        return "greeting", meta

    budget_match = re.search(
        r"(?:₹|rs\.?|inr\s*)?\s*(\d[\d,]*)\s*(?:k|K|thousand)?|(?:budget|have)\s*(?:₹|rs\.?|inr\s*)?\s*(\d[\d,]*)\s*(?:k|K)?",
        text,
    )
    if budget_match:
        raw = (budget_match.group(1) or budget_match.group(2) or "").replace(",", "")
        if raw:
            amount = float(raw)
            if re.search(r"\d\s*k\b", text, re.I) or (amount < 100 and "k" in text):
                amount *= 1000
            meta["budget"] = amount
            return "budget_recommendation", meta

    if re.search(r"\b(available|in stock|do you have|is it available|stock)\b", text):
        return "availability", meta

    if re.search(
        r"\b(show|find|recommend|suggest|sparkler|cracker|wala|aerial|multi.?shot|fancy|rocket|flower pot|chakkar|atom bomb)\b",
        text,
    ):
        return "product_search", meta

    return "general", meta


def _load_system_prompt() -> str:
    path = PROMPTS_DIR / "aura_system.txt"
    return path.read_text(encoding="utf-8").strip()


async def _live_products_for_ids(product_ids: list[str]) -> list[dict[str, Any]]:
    products = await fetch_products_by_ids(product_ids)
    return [product_to_card(p) for p in products]


async def _products_for_search(query: str) -> list[dict[str, Any]]:
    products = await search_products_live(query, limit=5)
    return [product_to_card(p) for p in products]


def _active_model() -> str:
    if LLM_PROVIDER == "groq" and groq_configured():
        return GROQ_MODEL
    return LLM_MODEL


async def _call_llm(messages: list[dict[str, str]]) -> str:
    if LLM_PROVIDER == "groq" and groq_configured():
        return await groq_chat(messages)

    response = ollama.chat(
        model=LLM_MODEL,
        messages=messages,
        options={"temperature": 0.2, "num_predict": 120, "num_ctx": 4096},
    )
    return response["message"]["content"].strip()


async def generate_answer(
    question: str,
    context: str,
    history: list[dict[str, str]] | None = None,
    intent: Intent = "general",
) -> str:
    system = _load_system_prompt()

    intent_hints = {
        "budget_recommendation": "Recommend products from CONTEXT within budget.",
        "availability": "Answer availability using LIVE lines in CONTEXT only.",
        "product_search": "Briefly describe matching products. Cards show below.",
        "general": "Answer using CONTEXT. Be concise.",
    }
    intent_hint = intent_hints.get(intent, intent_hints["general"])

    user_content = f"""CONTEXT:
{context or "General AURA Crackers shop — Sivakasi, WhatsApp orders, all-India delivery."}

QUESTION: {question}
{intent_hint}"""

    messages: list[dict[str, str]] = [{"role": "system", "content": system}]
    messages.extend(FEW_SHOT_MESSAGES)

    for turn in (history or [])[-2:]:
        role = turn.get("role", "user")
        content = turn.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": user_content})

    return await _call_llm(messages)


async def handle_chat(
    message: str,
    history: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    intent, meta = detect_intent(message)

    # Instant reply — no local embed, no Groq call
    if intent == "greeting":
        return {
            "response": GREETING_REPLY,
            "products": [],
            "intent": intent,
        }

    product_cards: list[dict[str, Any]] = []
    context_parts: list[str] = []

    if intent == "budget_recommendation" and meta.get("budget"):
        budget = float(meta["budget"])
        products = await fetch_products()
        selected = build_budget_collection(products, budget)
        product_cards = [product_to_card(p) for p in selected]
        context_parts.append(f"Customer budget: ₹{budget:,.0f}")
        for product in selected:
            context_parts.append(product_to_document(product))
    elif intent in ("availability", "product_search", "general"):
        rag_context, product_ids = await build_context(message)
        if rag_context:
            context_parts.append(rag_context)

        if intent in ("availability", "product_search"):
            live_cards = await _live_products_for_ids(product_ids)
            if not live_cards and intent == "product_search":
                live_cards = await _products_for_search(message)
            product_cards = live_cards

            if intent == "availability":
                for card in live_cards:
                    status = "In Stock" if card.get("is_available") else "Out of Stock"
                    context_parts.append(
                        f"LIVE: {card.get('name')} — {status}, price ₹{card.get('price')}"
                    )
        elif product_ids:
            product_cards = await _live_products_for_ids(product_ids)

    context = "\n\n".join(context_parts)
    response = await generate_answer(message, context, history, intent)

    return {
        "response": response,
        "products": product_cards,
        "intent": intent,
    }


def get_llm_info() -> dict[str, str]:
    provider = "groq" if LLM_PROVIDER == "groq" and groq_configured() else "ollama"
    return {"provider": provider, "model": _active_model()}

from __future__ import annotations

import httpx

import os

from .config import GROQ_MAX_TOKENS, GROQ_MODEL, GROQ_TEMPERATURE

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

_groq_client: httpx.AsyncClient | None = None


def groq_configured() -> bool:
    return bool(os.getenv("GROQ_API_KEY", "").strip())


def _get_groq_client() -> httpx.AsyncClient:
    global _groq_client
    if _groq_client is None:
        _groq_client = httpx.AsyncClient(timeout=30)
    return _groq_client


async def groq_chat(messages: list[dict[str, str]]) -> str:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set")

    client = _get_groq_client()
    response = await client.post(
        GROQ_CHAT_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": GROQ_MODEL,
            "messages": messages,
            "temperature": GROQ_TEMPERATURE,
            "max_tokens": GROQ_MAX_TOKENS,
        },
    )
    response.raise_for_status()
    data = response.json()

    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError("Groq returned no choices")

    content = choices[0].get("message", {}).get("content", "")
    return content.strip()

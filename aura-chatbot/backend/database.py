from __future__ import annotations

import json
import time
from typing import Any

import httpx

from .config import DATA_DIR, SUPABASE_KEY, SUPABASE_URL

_products_cache: tuple[float, list[dict[str, Any]]] | None = None
_PRODUCTS_CACHE_TTL = 90.0


def _headers() -> dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


def supabase_configured() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY)


async def fetch_products(include_unavailable: bool = False) -> list[dict[str, Any]]:
    """Fetch live products from Supabase with category join (cached briefly)."""
    global _products_cache

    if not include_unavailable and _products_cache:
        cached_at, cached_products = _products_cache
        if time.time() - cached_at < _PRODUCTS_CACHE_TTL:
            return cached_products

    if not supabase_configured():
        products = _load_products_json()
    else:
        params = {
            "select": "*,category:categories(id,name,slug)",
            "order": "sort_order.asc",
        }
        if not include_unavailable:
            params["is_available"] = "eq.true"

        url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/products"

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(url, headers=_headers(), params=params)
            response.raise_for_status()
            products = response.json()

    if not include_unavailable:
        _products_cache = (time.time(), products)

    return products


async def fetch_products_by_ids(product_ids: list[str]) -> list[dict[str, Any]]:
    if not product_ids:
        return []
    products = await fetch_products()
    by_id = {str(p.get("id")): p for p in products}
    ordered: list[dict[str, Any]] = []
    for pid in product_ids[:5]:
        product = by_id.get(str(pid))
        if product:
            ordered.append(product)
    return ordered


async def fetch_product_by_id(product_id: str) -> dict[str, Any] | None:
    if not supabase_configured():
        products = _load_products_json()
        return next((p for p in products if p.get("id") == product_id), None)

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/products"
    params = {"select": "*,category:categories(id,name,slug)", "id": f"eq.{product_id}"}

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.get(url, headers=_headers(), params=params)
        response.raise_for_status()
        rows = response.json()
        return rows[0] if rows else None


async def search_products_live(
    query: str | None = None,
    max_price: float | None = None,
    limit: int = 20,
) -> list[dict[str, Any]]:
    products = await fetch_products()
    results = products

    if query:
        q = query.lower()
        results = [
            p
            for p in results
            if q in (p.get("name") or "").lower()
            or q in (p.get("description") or "").lower()
            or q in ((p.get("category") or {}).get("name") or "").lower()
        ]

    if max_price is not None:
        results = [p for p in results if _resolve_price(p) is not None and _resolve_price(p) <= max_price]

    return results[:limit]


def _resolve_price(product: dict[str, Any]) -> float | None:
    if product.get("price") is not None:
        return float(product["price"])
    original = product.get("original_price")
    discount = product.get("discount_percentage")
    if original is not None and discount:
        return round(float(original) * (1 - float(discount) / 100), 2)
    if original is not None:
        return float(original)
    return None


def product_to_document(product: dict[str, Any]) -> str:
    category = product.get("category") or {}
    price = _resolve_price(product)
    specs = product.get("specifications") or {}
    spec_text = ", ".join(f"{k}: {v}" for k, v in specs.items()) if specs else ""

    lines = [
        f"Product Name: {product.get('name', '')}",
        f"Product ID: {product.get('id', '')}",
        f"Slug: {product.get('slug', '')}",
    ]
    if category.get("name"):
        lines.append(f"Category: {category['name']}")
    if product.get("brand"):
        lines.append(f"Brand: {product['brand']}")
    if product.get("description"):
        lines.append(f"Description: {product['description']}")
    if price is not None:
        lines.append(f"Price: ₹{price} (indicative — confirm on WhatsApp)")
    if product.get("original_price"):
        lines.append(f"Original Price: ₹{product['original_price']}")
    if product.get("discount_percentage"):
        lines.append(f"Discount: {product['discount_percentage']}%")
    if product.get("pieces"):
        lines.append(f"Pieces: {product['pieces']}")
    if spec_text:
        lines.append(f"Specifications: {spec_text}")
    lines.append(f"Availability: {'In Stock' if product.get('is_available') else 'Out of Stock'}")
    lines.append(f"URL: /products/{product.get('slug', '')}")
    return "\n".join(lines)


def product_to_card(product: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": product.get("id"),
        "name": product.get("name"),
        "slug": product.get("slug"),
        "price": _resolve_price(product),
        "original_price": product.get("original_price"),
        "discount_percentage": product.get("discount_percentage"),
        "image_url": product.get("image_url"),
        "is_available": product.get("is_available", False),
        "category": (product.get("category") or {}).get("name"),
    }


def _load_products_json() -> list[dict[str, Any]]:
    path = DATA_DIR / "products.json"
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else data.get("products", [])


def build_budget_collection(products: list[dict[str, Any]], budget: float) -> list[dict[str, Any]]:
    """Greedy selection: pick diverse affordable products up to budget."""
    priced = [p for p in products if _resolve_price(p) is not None and _resolve_price(p) > 0]
    priced.sort(key=lambda p: _resolve_price(p) or 0)

    selected: list[dict[str, Any]] = []
    total = 0.0
    seen_categories: set[str] = set()

    for product in priced:
        price = _resolve_price(product) or 0
        category = (product.get("category") or {}).get("name") or "other"
        if total + price > budget:
            continue
        if category in seen_categories and len(selected) >= 3:
            continue
        selected.append(product)
        total += price
        seen_categories.add(category)
        if total >= budget * 0.75 and len(selected) >= 4:
            break

    if not selected and priced:
        affordable = [p for p in priced if (_resolve_price(p) or 0) <= budget]
        if affordable:
            selected = [max(affordable, key=lambda p: _resolve_price(p) or 0)]

    return selected

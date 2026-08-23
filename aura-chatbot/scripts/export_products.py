"""Export products from Supabase to data/products.json for offline RAG indexing."""

from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.database import fetch_products, supabase_configured  # noqa: E402


async def main() -> None:
    if not supabase_configured():
        print("Configure SUPABASE_URL and SUPABASE_KEY in aura-chatbot/.env or root .env")
        sys.exit(1)

    products = await fetch_products(include_unavailable=True)
    out = ROOT / "data" / "products.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f"Exported {len(products)} products to {out}")


if __name__ == "__main__":
    asyncio.run(main())

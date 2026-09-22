-- Product catalogue code (Excel S.No) — shown as "Code" in table/card views
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_code TEXT;

COMMENT ON COLUMN products.product_code IS 'Customer-facing product code (typically Excel S.No); falls back to sort_order in UI when null';

-- New Arrival & Kids Special badges for products (admin-controlled)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_kids_special BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_products_kids_special ON products(is_kids_special) WHERE is_kids_special = true;

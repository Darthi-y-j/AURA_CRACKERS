-- Enforce unique product codes (case-insensitive, trimmed)
-- Fix duplicate codes before adding the index

UPDATE products
SET product_code = sort_order::text
WHERE (product_code IS NULL OR trim(product_code) = '')
  AND sort_order > 0;

UPDATE products p
SET product_code = trim(p.product_code) || '-' || substr(replace(p.id::text, '-', ''), 1, 6)
FROM (
  SELECT id,
    row_number() OVER (
      PARTITION BY lower(trim(product_code))
      ORDER BY sort_order NULLS LAST, created_at
    ) AS rn
  FROM products
  WHERE product_code IS NOT NULL AND trim(product_code) <> ''
) d
WHERE p.id = d.id AND d.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS products_product_code_unique_idx
  ON products (lower(trim(product_code)))
  WHERE product_code IS NOT NULL AND trim(product_code) <> '';

COMMENT ON INDEX products_product_code_unique_idx IS 'Each product code must be unique (case-insensitive)';

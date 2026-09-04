-- Structured packaging: sell unit, inner units, pieces per inner (e.g. 1 bundle · 5 boxes · 10 pcs/box)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS packaging JSONB;

COMMENT ON COLUMN products.packaging IS 'Packaging breakdown: sellUnit, innerCount, innerLabel, piecesPerInner';

-- Backfill simple packs from legacy pieces column
UPDATE products
SET packaging = jsonb_build_object(
  'sellUnit', 'pack',
  'piecesPerInner', pieces
)
WHERE pieces IS NOT NULL
  AND pieces > 0
  AND packaging IS NULL;

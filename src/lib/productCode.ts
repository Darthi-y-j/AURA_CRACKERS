import type { Product } from '@/types/database'

export type ProductCodeSource = Pick<Product, 'sort_order'> & {
  product_code?: string | null
}

/** Catalogue item code (Excel S.No), stored as `product_code` or `sort_order`. */
export function formatProductCode(product: ProductCodeSource): string {
  const explicit = product.product_code?.trim()
  if (explicit) return explicit
  if (product.sort_order > 0) return String(product.sort_order)
  return '—'
}

export function hasProductCode(product: ProductCodeSource): boolean {
  return formatProductCode(product) !== '—'
}

/** Code shown on the site for conflict checks (explicit code or sort order fallback). */
export function getEffectiveProductCode(
  product: ProductCodeSource & { id?: string; name?: string },
): string | null {
  const code = formatProductCode(product)
  return code === '—' ? null : code
}

export function getProductCodeConflictMessage(
  items: (ProductCodeSource & { id?: string; name?: string })[],
  code: string,
  excludeId?: string,
): string | null {
  const normalized = code.trim()
  if (!normalized) return null

  const conflict = items.find((item) => {
    if (item.id === excludeId) return false
    return getEffectiveProductCode(item) === normalized
  })

  if (!conflict) return null
  const label = conflict.name ? `"${conflict.name}"` : 'another product'
  return `This product code is already in use by ${label}.`
}

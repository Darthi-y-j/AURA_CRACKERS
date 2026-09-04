import type { Product, ProductPackaging, PackagingUnit } from '@/types/database'

export const PACKAGING_UNITS: { value: PackagingUnit; label: string }[] = [
  { value: 'piece', label: 'Piece (single item)' },
  { value: 'pack', label: 'Pack' },
  { value: 'box', label: 'Box' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'carton', label: 'Carton' },
]

export const DEFAULT_INNER_LABEL = 'box'

const NESTED_SELL_UNITS = new Set<PackagingUnit>(['bundle', 'carton'])

export function isNestedPackaging(sellUnit: PackagingUnit): boolean {
  return NESTED_SELL_UNITS.has(sellUnit)
}

export function getSellUnitCount(packaging: ProductPackaging): number {
  const count = packaging.sellUnitCount ?? 1
  return count >= 1 ? count : 1
}

export function normalizePackaging(raw: unknown): ProductPackaging | null {
  if (!raw || typeof raw !== 'object') return null

  const data = raw as Record<string, unknown>
  const sellUnit = data.sellUnit
  if (typeof sellUnit !== 'string' || !PACKAGING_UNITS.some((u) => u.value === sellUnit)) {
    return null
  }

  const sellUnitCount = parseOptionalPositiveInt(data.sellUnitCount) ?? 1
  const innerCount = parseOptionalPositiveInt(data.innerCount)
  const piecesPerInner = parseOptionalPositiveInt(data.piecesPerInner)
  const innerLabel =
    typeof data.innerLabel === 'string' && data.innerLabel.trim()
      ? data.innerLabel.trim().toLowerCase()
      : null

  return {
    sellUnit: sellUnit as PackagingUnit,
    sellUnitCount,
    innerCount,
    innerLabel,
    piecesPerInner,
  }
}

function parseOptionalPositiveInt(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : parseInt(String(value), 10)
  if (Number.isNaN(n) || n < 1) return null
  return n
}

/** Resolve packaging from product — uses packaging JSON or legacy pieces field. */
export function resolveProductPackaging(product: {
  packaging?: ProductPackaging | null
  pieces?: number | null
}): ProductPackaging | null {
  const fromJson = normalizePackaging(product.packaging)
  if (fromJson) return fromJson

  if (product.pieces != null && product.pieces > 0) {
    return {
      sellUnit: product.pieces === 1 ? 'piece' : 'pack',
      sellUnitCount: 1,
      piecesPerInner: product.pieces,
    }
  }

  return null
}

export function computeTotalPieces(packaging: ProductPackaging | null): number | null {
  if (!packaging) return null

  const sellCount = getSellUnitCount(packaging)

  if (isNestedPackaging(packaging.sellUnit)) {
    if (packaging.innerCount != null && packaging.piecesPerInner != null) {
      return sellCount * packaging.innerCount * packaging.piecesPerInner
    }
    return null
  }

  if (packaging.piecesPerInner != null) return sellCount * packaging.piecesPerInner
  if (packaging.sellUnit === 'piece') return sellCount
  return null
}

function pluralize(word: string, count: number): string {
  if (count === 1) return word
  if (word.endsWith('s')) return word
  return `${word}es`
}

function formatSellUnits(count: number, sellUnit: PackagingUnit): string {
  return `${count} ${pluralize(sellUnit, count)}`
}

/** Compact label for product cards and badges. */
export function formatPackagingShort(
  packaging: ProductPackaging | null,
  legacyPieces?: number | null,
): string | null {
  const resolved = packaging ?? (legacyPieces ? resolveProductPackaging({ pieces: legacyPieces }) : null)
  if (!resolved) return null

  const { sellUnit, innerCount, innerLabel, piecesPerInner } = resolved
  const sellCount = getSellUnitCount(resolved)

  if (isNestedPackaging(sellUnit) && innerCount != null && piecesPerInner != null) {
    const inner = innerLabel || DEFAULT_INNER_LABEL
    const sellPart = sellCount > 1 ? `${formatSellUnits(sellCount, sellUnit)} · ` : ''
    return `${sellPart}${innerCount} ${pluralize(inner, innerCount)} · ${piecesPerInner} pcs/${inner}`
  }

  if (piecesPerInner != null) {
    if (sellUnit === 'piece' && piecesPerInner === 1 && sellCount === 1) return '1 pc'
    const unit = sellUnit === 'piece' ? 'pc' : sellUnit
    const sellPart = sellCount > 1 ? `${formatSellUnits(sellCount, sellUnit)} · ` : ''
    return `${sellPart}${piecesPerInner} pcs/${unit}`
  }

  return null
}

/** Stacked lines for narrow table cells (one level per line). */
export function formatPackagingTableLines(
  packaging: ProductPackaging | null,
  legacyPieces?: number | null,
): string[] {
  const resolved = packaging ?? (legacyPieces ? resolveProductPackaging({ pieces: legacyPieces }) : null)
  if (!resolved) return []

  const { sellUnit, innerCount, innerLabel, piecesPerInner } = resolved
  const sellCount = getSellUnitCount(resolved)

  if (isNestedPackaging(sellUnit) && innerCount != null && piecesPerInner != null) {
    const inner = innerLabel || DEFAULT_INNER_LABEL
    return [
      formatSellUnits(sellCount, sellUnit),
      `${innerCount} ${pluralize(inner, innerCount)}/${sellUnit}`,
      `${piecesPerInner} pcs/${inner}`,
    ]
  }

  if (piecesPerInner != null) {
    if (sellUnit === 'piece' && piecesPerInner === 1 && sellCount === 1) return ['1 pc']
    const lines: string[] = []
    if (sellCount > 1) lines.push(formatSellUnits(sellCount, sellUnit))
    lines.push(`${piecesPerInner} pcs/${sellUnit === 'piece' ? 'pc' : sellUnit}`)
    return lines
  }

  return []
}

/** Full breakdown for admin preview and product detail. */
export function formatPackagingDetail(packaging: ProductPackaging | null): string | null {
  if (!packaging) return null

  const { sellUnit, innerCount, innerLabel, piecesPerInner } = packaging
  const sellCount = getSellUnitCount(packaging)
  const total = computeTotalPieces(packaging)

  if (isNestedPackaging(sellUnit) && innerCount != null && piecesPerInner != null) {
    const inner = innerLabel || DEFAULT_INNER_LABEL
    const parts = [
      formatSellUnits(sellCount, sellUnit),
      `${innerCount} ${pluralize(inner, innerCount)}/${sellUnit}`,
      `${piecesPerInner} pcs/${inner}`,
    ]
    if (total != null) parts.push(`${total} pcs total`)
    return parts.join(' · ')
  }

  if (piecesPerInner != null) {
    const unit = sellUnit === 'piece' ? 'piece' : sellUnit
    const parts = [
      sellCount > 1 ? formatSellUnits(sellCount, sellUnit) : null,
      `${piecesPerInner} pcs per ${unit}`,
    ].filter(Boolean)
    if (total != null && sellCount > 1) parts.push(`${total} pcs total`)
    return parts.join(' · ')
  }

  return null
}

export interface PackagingFormState {
  sellUnit: PackagingUnit
  sellUnitCount: string
  innerCount: string
  innerLabel: string
  piecesPerInner: string
}

export function getPackagingFormState(product?: Product | null): PackagingFormState {
  const packaging = product ? resolveProductPackaging(product) : null

  if (!packaging) {
    return {
      sellUnit: 'pack',
      sellUnitCount: '1',
      innerCount: '',
      innerLabel: DEFAULT_INNER_LABEL,
      piecesPerInner: '',
    }
  }

  const sellCount = getSellUnitCount(packaging)

  return {
    sellUnit: packaging.sellUnit,
    sellUnitCount: sellCount.toString(),
    innerCount: packaging.innerCount?.toString() ?? '',
    innerLabel: packaging.innerLabel || DEFAULT_INNER_LABEL,
    piecesPerInner: packaging.piecesPerInner?.toString() ?? '',
  }
}

export function buildPackagingFromForm(
  form: PackagingFormState,
): { packaging: ProductPackaging | null; pieces: number | null; error?: string } {
  const sellUnit = form.sellUnit
  const sellUnitCountRaw = form.sellUnitCount.trim()
  const sellUnitCount = sellUnitCountRaw ? parseInt(sellUnitCountRaw, 10) : 1
  const innerCount = form.innerCount.trim() ? parseInt(form.innerCount, 10) : null
  const piecesPerInner = form.piecesPerInner.trim() ? parseInt(form.piecesPerInner, 10) : null
  const innerLabel = form.innerLabel.trim() || DEFAULT_INNER_LABEL

  if (sellUnit !== 'piece' && sellUnitCountRaw && (Number.isNaN(sellUnitCount) || sellUnitCount < 1)) {
    return { packaging: null, pieces: null, error: `Enter a valid number of ${sellUnit}s (1 or higher).` }
  }

  if (isNestedPackaging(sellUnit)) {
    if (innerCount == null || Number.isNaN(innerCount) || innerCount < 1) {
      return { packaging: null, pieces: null, error: `Enter how many ${innerLabel}s per ${sellUnit}.` }
    }
    if (piecesPerInner == null || Number.isNaN(piecesPerInner) || piecesPerInner < 1) {
      return { packaging: null, pieces: null, error: `Enter pieces per ${innerLabel}.` }
    }

    const packaging: ProductPackaging = {
      sellUnit,
      sellUnitCount,
      innerCount,
      innerLabel,
      piecesPerInner,
    }
    return { packaging, pieces: computeTotalPieces(packaging) }
  }

  if (sellUnit === 'piece') {
    const packaging: ProductPackaging = { sellUnit: 'piece', sellUnitCount: 1, piecesPerInner: 1 }
    return { packaging, pieces: 1 }
  }

  if (piecesPerInner == null || Number.isNaN(piecesPerInner) || piecesPerInner < 1) {
    return {
      packaging: null,
      pieces: null,
      error: `Enter pieces per ${sellUnit}, or leave packaging blank.`,
    }
  }

  const packaging: ProductPackaging = {
    sellUnit,
    sellUnitCount,
    piecesPerInner,
  }
  return { packaging, pieces: computeTotalPieces(packaging) }
}

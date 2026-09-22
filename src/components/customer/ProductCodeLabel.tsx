import type { ProductCodeSource } from '@/lib/productCode'
import { formatProductCode } from '@/lib/productCode'
import { cn } from '@/lib/utils'

type ProductCodeLabelProps = {
  product: ProductCodeSource
  className?: string
  /** Show "Code 12" vs "12" only */
  showLabel?: boolean
  variant?: 'table' | 'card' | 'cardLight' | 'overlay'
}

const VARIANT_CLASS: Record<NonNullable<ProductCodeLabelProps['variant']>, string> = {
  table: 'text-xs font-bold tabular-nums text-navy-950 lg:text-sm',
  card: 'text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-400/85 sm:text-[10px]',
  cardLight: 'text-[10px] font-semibold text-navy-700/55',
  overlay:
    'rounded-md border border-white/15 bg-black/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-200/95 backdrop-blur-sm',
}

export function ProductCodeLabel({
  product,
  className,
  showLabel = true,
  variant = 'card',
}: ProductCodeLabelProps) {
  const code = formatProductCode(product)
  if (code === '—') return null

  return (
    <span className={cn(VARIANT_CLASS[variant], className)}>
      {showLabel ? <>Code {code}</> : code}
    </span>
  )
}

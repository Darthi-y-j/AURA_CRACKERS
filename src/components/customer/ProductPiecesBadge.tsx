import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductPackaging } from '@/types/database'
import { formatPackagingShort } from '@/lib/productPackaging'

interface ProductPiecesBadgeProps {
  pieces?: number | null
  packaging?: ProductPackaging | null
  variant?: 'ember' | 'dark' | 'light' | 'silver' | 'elite' | 'table'
  suffix?: string
  className?: string
}

export function ProductPiecesBadge({
  pieces,
  packaging,
  variant = 'ember',
  suffix = '/ pack',
  className,
}: ProductPiecesBadgeProps) {
  const label = formatPackagingShort(packaging ?? null, pieces)
  if (!label) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-bold uppercase tracking-[0.12em]',
        variant === 'dark'
          ? 'shrink-0 rounded-md border border-cream-200/30 bg-white/5 px-1.5 py-0.5 text-[9px] tracking-wide text-cream-200'
          : variant === 'ember'
          ? 'shrink-0 rounded-md bg-festive-500/8 px-1.5 py-0.5 text-[9px] tracking-wide text-festive-700 ring-1 ring-inset ring-festive-500/20'
          : variant === 'table'
            ? 'shrink-0 rounded-md border border-orange-300/60 bg-white/70 px-2 py-0.5 text-[10px] tracking-[0.12em] text-festive-700 shadow-sm'
          : variant === 'silver'
            ? 'shrink-0 rounded-md bg-cream-100/10 px-1.5 py-0.5 text-[9px] tracking-wide text-cream-200 ring-1 ring-inset ring-cream-200/25'
            : variant === 'elite'
              ? 'shrink-0 rounded-md bg-festive-500/10 px-1.5 py-0.5 text-[9px] tracking-wide text-festive-700 ring-1 ring-inset ring-festive-500/25'
            : 'border-navy-900/10 bg-white px-1.5 py-0.5 text-[9px] font-semibold normal-case tracking-normal text-navy-700/85',
        className,
      )}
    >
      {variant === 'ember' || variant === 'dark' || variant === 'silver' || variant === 'elite' || variant === 'table' ? (
        <>
          <Package
            className={cn(
              'h-2.5 w-2.5 shrink-0',
              variant === 'table'
                ? 'text-festive-500'
                : variant === 'dark'
                  ? 'text-cream-200/90'
                : variant === 'elite'
                ? 'text-festive-600/85'
                : variant === 'silver'
                  ? 'text-festive-500/80'
                  : 'text-festive-600/85',
            )}
          />
          <span className="normal-case tracking-normal">{label}</span>
        </>
      ) : (
        <>
          <Package className="h-3 w-3 shrink-0 text-festive-500" />
          <span className="normal-case tracking-normal">{label}</span>
          {suffix && !label.includes('/') && (
            <span className="font-semibold normal-case tracking-normal text-festive-500/80">
              {suffix}
            </span>
          )}
        </>
      )}
    </span>
  )
}

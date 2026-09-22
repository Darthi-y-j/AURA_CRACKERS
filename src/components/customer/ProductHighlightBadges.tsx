import { Sparkles, Star } from 'lucide-react'
import type { Product } from '@/types/database'
import { cn } from '@/lib/utils'

type HighlightProduct = Pick<
  Product,
  'is_recommended' | 'is_best_seller' | 'is_new_arrival' | 'is_kids_special'
>

interface ProductHighlightBadgesProps {
  product: HighlightProduct
  className?: string
  compact?: boolean
  /** Tiny stacked pills on mobile table thumbnails */
  variant?: 'default' | 'thumbOverlay'
}

const badgeSize = (compact: boolean, overlay: boolean) => {
  if (overlay) {
    return 'max-w-full truncate px-1 py-px text-[6px] leading-tight shadow-[0_1px_4px_rgba(0,0,0,0.35)]'
  }
  return compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px] sm:px-3 sm:py-1 sm:text-[11px]'
}

export function ProductHighlightBadges({
  product,
  className,
  compact = false,
  variant = 'default',
}: ProductHighlightBadgesProps) {
  const isRecommended = Boolean(product.is_recommended)
  const isBestSeller = Boolean(product.is_best_seller)
  const isNewArrival = Boolean(product.is_new_arrival)
  const isKidsSpecial = Boolean(product.is_kids_special)
  const overlay = variant === 'thumbOverlay'

  if (!isRecommended && !isBestSeller && !isNewArrival && !isKidsSpecial) return null

  return (
    <div
      className={cn(
        overlay
          ? 'flex flex-col items-start gap-0.5'
          : 'flex flex-row flex-wrap items-center gap-1',
        !overlay && compact ? 'gap-1' : !overlay ? 'gap-1.5' : null,
        className,
      )}
    >
      {isBestSeller && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-[#e91e8c] font-bold text-white',
            !overlay && 'animate-best-seller-pop shadow-[0_4px_14px_rgba(233,30,140,0.45)]',
            badgeSize(compact, overlay),
          )}
        >
          <span aria-hidden="true">🔥</span>
          {overlay ? 'Best' : 'Best Selling'}
        </span>
      )}
      {isNewArrival && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 font-bold text-white',
            !overlay && 'shadow-[0_4px_14px_rgba(14,165,233,0.4)]',
            badgeSize(compact, overlay),
          )}
        >
          {!overlay && <Star className={cn('shrink-0', compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} aria-hidden="true" />}
          {overlay ? 'New' : 'New Arrival'}
        </span>
      )}
      {isKidsSpecial && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-white',
            !overlay && 'shadow-[0_4px_14px_rgba(139,92,246,0.4)]',
            badgeSize(compact, overlay),
          )}
        >
          <span aria-hidden="true">🎈</span>
          {overlay ? 'Kids' : 'Kids Special'}
        </span>
      )}
      {isRecommended && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full bg-gradient-to-r from-festive-500 to-gold-400 font-bold text-white',
            !overlay && 'animate-recommended-badge shadow-[0_4px_14px_rgba(245,158,11,0.4)]',
            badgeSize(compact, overlay),
          )}
        >
          {!overlay && (
            <Sparkles className={cn('shrink-0', compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} aria-hidden="true" />
          )}
          {overlay && <span aria-hidden="true">✨</span>}
          {overlay ? 'Rec' : 'Recommended'}
        </span>
      )}
    </div>
  )
}


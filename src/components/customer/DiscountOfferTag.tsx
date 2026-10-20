import { cn } from '@/lib/utils'

interface DiscountOfferTagProps {
  percentage: number
  variant?: 'festive' | 'elite' | 'premium-plus'
  className?: string
}

const DISCOUNT_TAG_STYLES = {
  festive: 'bg-gradient-to-b from-red-500 to-orange-500 text-white shadow-[0_4px_14px_rgba(234,88,12,0.45)]',
  elite: 'bg-gradient-to-b from-festive-600 to-festive-500 text-cream-50 shadow-[0_4px_14px_rgba(234,88,12,0.4)]',
  'premium-plus':
    'bg-gradient-to-b from-amber-700 to-festive-500 text-cream-50 shadow-[0_4px_14px_rgba(234,88,12,0.4)]',
} as const

/** Vertical ribbon with fishtail — pinned top-right */
export function DiscountOfferTag({
  percentage,
  variant = 'festive',
  className,
}: DiscountOfferTagProps) {
  return (
    <div
      className={cn(
        'absolute right-0 top-0 z-10 flex w-[42px] flex-col items-center pt-2 pb-3.5 text-center',
        DISCOUNT_TAG_STYLES[variant],
        className,
      )}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), 50% 100%, 0 calc(100% - 10px))',
      }}
      aria-label={`${percentage}% off`}
    >
      <span className="text-[13px] font-bold leading-none tabular-nums">{percentage}%</span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.08em]">Off</span>
    </div>
  )
}

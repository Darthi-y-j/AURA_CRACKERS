import { cn } from '@/lib/utils'

interface ProductBrandBadgeProps {
  brand?: string | null
  variant?: 'overlay' | 'dark' | 'light' | 'silver' | 'elite'
  /** Allow long names to wrap up to 2 lines instead of truncating */
  wrap?: boolean
  className?: string
}

export function ProductBrandBadge({
  brand,
  variant = 'dark',
  wrap = false,
  className,
}: ProductBrandBadgeProps) {
  const name = brand?.trim()
  if (!name) return null

  return (
    <span
      className={cn(
        'max-w-full font-bold uppercase tracking-wide',
        wrap
          ? 'line-clamp-2 inline-block w-max max-w-full whitespace-normal rounded-lg border px-2 py-1 text-left text-[9px] leading-snug sm:text-[10px]'
          : 'inline-flex w-max max-w-full items-center justify-center truncate rounded-full border px-2 py-1 text-[9px] leading-none sm:px-2.5 sm:text-[10px]',
        variant === 'overlay' &&
          'border-amber-200/80 bg-black/85 text-amber-50 shadow-[0_2px_12px_rgba(0,0,0,0.55)] backdrop-blur-md',
        variant === 'dark' &&
          'border-amber-200/75 bg-black/80 text-amber-50 shadow-[0_2px_10px_rgba(0,0,0,0.45)] backdrop-blur-sm',
        variant === 'light' &&
          'border-gold-500/35 bg-gold-500/15 text-festive-600',
        variant === 'silver' &&
          'border-slate-300/45 bg-slate-400/15 text-slate-200',
        variant === 'elite' &&
          'border-slate-300/40 bg-indigo-500/12 text-slate-100',
        className,
      )}
    >
      {name}
    </span>
  )
}

import { cn } from '@/lib/utils'

interface ProductBrandBadgeProps {
  brand?: string | null
  variant?: 'overlay' | 'dark' | 'light' | 'silver' | 'elite'
  className?: string
}

export function ProductBrandBadge({
  brand,
  variant = 'dark',
  className,
}: ProductBrandBadgeProps) {
  const name = brand?.trim()
  if (!name) return null

  return (
    <span
      className={cn(
        'inline-flex items-center max-w-full truncate rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide sm:px-2.5 sm:text-[10px]',
        variant === 'overlay' &&
          'border-gold-400/60 bg-navy-950/90 text-gold-300 shadow-[0_2px_10px_rgba(0,0,0,0.5)] backdrop-blur-md',
        variant === 'dark' &&
          'border-gold-400/40 bg-gold-500/15 text-gold-300',
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

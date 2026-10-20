import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QuantitySelector } from './QuantitySelector'

interface CartQuantityControlProps {
  value: number
  onChange: (value: number) => void
  variant?: 'default' | 'ember' | 'dark' | 'silver' | 'elite' | 'table'
  compact?: boolean
  min?: number
  className?: string
}

export function CartQuantityControl({
  value,
  onChange,
  variant = 'ember',
  compact = true,
  min = 0,
  className,
}: CartQuantityControlProps) {
  const isEmber = variant === 'ember'
  const isDark = variant === 'dark'
  const isSilver = variant === 'silver'
  const isElite = variant === 'elite'

  return (
    <div className={cn('flex min-w-0 items-stretch gap-1', className)}>
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-lg border',
          compact ? 'w-8 sm:w-9' : 'w-10',
          isDark
            ? 'border-festive-500/35 bg-white/5 text-festive-400'
            : isEmber
            ? 'border-festive-500/25 bg-festive-500/10 text-festive-600'
            : isElite
              ? 'border-cream-200/30 bg-white/5 text-cream-200'
              : isSilver
                ? 'border-cream-200/30 bg-white/5 text-cream-200'
                : 'border-navy-800/12 bg-gold-500/10 text-festive-600',
        )}
        aria-hidden="true"
      >
        <ShoppingCart className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </span>
      <QuantitySelector
        value={value}
        onChange={onChange}
        variant={variant}
        compact={compact}
        min={min}
        className="min-w-[4.5rem] shrink-0 animate-fade-up"
      />
    </div>
  )
}

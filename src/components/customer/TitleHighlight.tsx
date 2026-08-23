import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TitleHighlightProps {
  children: ReactNode
  /** `light` = general; `premium` / `premium-plus` / `silver` = tagged collections on white bg */
  variant?: 'light' | 'dark' | 'premium' | 'premium-plus' | 'silver'
  className?: string
}

/** Dual-tone gradient text — inline-block scopes the gradient to the word only. */
export function TitleHighlight({ children, variant = 'light', className }: TitleHighlightProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        variant === 'dark'
          ? 'bg-gradient-to-b from-gold-300 via-gold-400 to-festive-500'
          : variant === 'silver'
            ? 'bg-gradient-to-r from-slate-700 via-slate-600 to-cyan-700'
            : variant === 'premium-plus'
              ? 'bg-[linear-gradient(90deg,#7a5c0f_0%,#c9a227_48%,#7a5c0f_100%)]'
              : variant === 'premium'
                ? 'bg-gradient-to-r from-amber-900 via-festive-700 to-amber-800'
                : 'bg-gradient-to-br from-festive-500 via-gold-500 to-gold-400',
        className,
      )}
    >
      {children}
    </span>
  )
}

import type { ReactNode } from 'react'
import {
  TITLE_HIGHLIGHT_PREMIUM,
  TITLE_HIGHLIGHT_PREMIUM_PLUS,
  TITLE_HIGHLIGHT_SILVER,
} from '@/lib/productCardThemes'
import { cn } from '@/lib/utils'

interface TitleHighlightProps {
  children: ReactNode
  /** `light` = general; `premium` / `premium-plus` / `silver` = tagged collections on white bg */
  variant?: 'light' | 'dark' | 'hero' | 'premium' | 'premium-plus' | 'silver'
  className?: string
}

/** Dual-tone gradient text — inline-block scopes the gradient to the word only. */
export function TitleHighlight({ children, variant = 'light', className }: TitleHighlightProps) {
  return (
    <span
      className={cn(
        'bg-clip-text text-transparent',
        variant === 'hero'
          ? 'inline-block bg-gradient-to-b from-[#ff7800] via-[#ffb300] to-[#ffe566] drop-shadow-[0_0_18px_rgba(255,160,0,0.85)]'
          : variant === 'dark'
            ? 'inline bg-gradient-to-b from-[#ff8c00] via-[#ffa726] to-[#ffd700]'
          : variant === 'silver'
            ? TITLE_HIGHLIGHT_SILVER
            : variant === 'premium-plus'
              ? TITLE_HIGHLIGHT_PREMIUM_PLUS
              : variant === 'premium'
                ? TITLE_HIGHLIGHT_PREMIUM
                : 'bg-gradient-to-br from-festive-500 via-gold-500 to-gold-400',
        className,
      )}
    >
      {children}
    </span>
  )
}

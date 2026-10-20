import { Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD_VISIBLE_PRODUCT_TAGS, type ProductTag } from '@/lib/productTags'
import { UNIFIED_CARD_TAG_OVERLAY } from '@/lib/productCardThemes'
interface ProductTagBadgeProps {
  tag?: string | null
  variant?: 'overlay' | 'dark' | 'light'
  className?: string
  /** Compact label for small card overlays */
  compact?: boolean
}

const VISIBLE_TAGS = CARD_VISIBLE_PRODUCT_TAGS

const TAG_STYLES: Record<
  Extract<ProductTag, 'Premium' | 'Premium Plus' | 'Elite Setout'>,
  {
    label: string
    compactLabel: string
    icon: typeof Crown
    overlay: string
    dark: string
    light: string
  }
> = {
  Premium: {
    label: 'Premium',
    compactLabel: 'Premium',
    icon: Crown,
    overlay: UNIFIED_CARD_TAG_OVERLAY,
    dark: 'border-festive-500/35 bg-festive-500/12 text-festive-500',
    light: 'border-festive-500/30 bg-festive-500/8 text-festive-600',
  },
  'Premium Plus': {
    label: 'Premium Plus',
    compactLabel: 'Premium+',
    icon: Sparkles,
    overlay: UNIFIED_CARD_TAG_OVERLAY,
    dark: 'border-festive-500/35 bg-festive-500/12 text-festive-500',
    light: 'border-festive-500/30 bg-festive-500/8 text-festive-600',
  },
  'Elite Setout': {
    label: 'Elite',
    compactLabel: 'Elite',
    icon: Crown,
    overlay: UNIFIED_CARD_TAG_OVERLAY,
    dark: 'border-festive-500/35 bg-festive-500/12 text-festive-500',
    light: 'border-festive-500/30 bg-festive-500/8 text-festive-600',
  },
}

function getTagStyle(tag: string) {
  if (!VISIBLE_TAGS.has(tag as ProductTag)) return null
  return TAG_STYLES[tag as keyof typeof TAG_STYLES] ?? null
}

export function ProductTagBadge({
  tag,
  variant = 'dark',
  className,
  compact = false,
}: ProductTagBadgeProps) {
  const name = tag?.trim()
  if (!name) return null

  const style = getTagStyle(name)
  if (!style) return null

  const Icon = style.icon
  const label = compact ? style.compactLabel : style.label

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:gap-1.5 sm:px-2.5 sm:text-[10px]',
        variant === 'overlay' && style.overlay,
        variant === 'dark' && style.dark,
        variant === 'light' && style.light,
        className,
      )}
    >
      <Icon className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" strokeWidth={2.5} />
      {label}
    </span>
  )
}

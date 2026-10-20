/** Pearl silver — secondary text & outlines on dark cards (warm, not cyan/slate) */
export const ACCENT_SILVER_TEXT = 'text-cream-200'
export const ACCENT_SILVER_MUTED = 'text-cream-100/62'
export const ACCENT_SILVER_BORDER = 'border-cream-200/38'

/** Bright gold — titles, prices, primary accents on dark cards */
export const ACCENT_GOLD_TEXT = 'text-gold-400'
export const ACCENT_GOLD_TITLE =
  'bg-gradient-to-r from-gold-300 via-gold-400 to-festive-400 bg-clip-text text-transparent group-hover:from-gold-200 group-hover:via-gold-300 group-hover:to-festive-300'

/** Collection section title gradients (on light page background) */
export const TITLE_HIGHLIGHT_SILVER =
  'bg-gradient-to-r from-navy-800 via-gold-500 to-festive-500'
export const TITLE_HIGHLIGHT_PREMIUM_PLUS =
  'bg-gradient-to-r from-gold-400 via-gold-300 to-festive-400'
export const TITLE_HIGHLIGHT_PREMIUM =
  'bg-gradient-to-r from-festive-500 via-gold-500 to-gold-400'

/** Elite tier badge — pearl silver (card shell unchanged) */
export const ELITE_TAG_BADGE =
  'border-cream-200/45 bg-navy-900/92 text-cream-100 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md'

/** Primary CTA fill on cards */
export const FESTIVE_CTA_BG = 'bg-gradient-to-r from-festive-500 via-gold-500 to-gold-400'

/** Premium+ accent fill */
export const PREMIUM_PLUS_ACCENT_BG = 'bg-gradient-to-r from-gold-500 via-gold-400 to-festive-500'

/** @deprecated Use FESTIVE_CTA_BG — kept for imports */
export const SILVER_METALLIC_BG = FESTIVE_CTA_BG

/** @deprecated Use PREMIUM_PLUS_ACCENT_BG */
export const GOLD_METALLIC_BG = PREMIUM_PLUS_ACCENT_BG

/** Featured marquee cards — warm bronze into deep charcoal */
export const FEATURED_CARD_GRADIENT = 'bg-gradient-to-r from-[#43302b] to-[#140f0d]'

/** Elite cards — festive glow (no cool silver) */
export const ELITE_BORDER_GLOW =
  'bg-gradient-to-br from-festive-500/35 via-gold-400/22 to-festive-600/30'

/** Default / Premium ticket body — warm cream (readable on light page bg) */
export const EMBER_CARD_INNER =
  'bg-gradient-to-b from-cream-50 via-cream-100 to-[#ebe3d6]'

/** Elite ticket body — same warm cream as default (no pearl silver) */
export const ELITE_CARD_INNER = EMBER_CARD_INNER

/** Dark product card shell — legacy / detail panels */
export const CATALOGUE_CARD_SHELL =
  'border border-white/[0.07] bg-gradient-to-b from-navy-900 via-navy-950 to-[#0a0705]'

/** Unified light product card (home grid + catalogue) — plain white */
export const UNIFIED_CARD_SHELL =
  'border border-navy-900/[0.06] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]'

export const UNIFIED_CARD_BODY = 'bg-white'

export const UNIFIED_CARD_TAG_OVERLAY =
  'border-[#5c4033]/35 bg-gradient-to-r from-[#3d2a1f] via-[#2a1a12] to-[#1f1410] text-cream-50 shadow-[0_4px_14px_rgba(0,0,0,0.32)] backdrop-blur-md'

/** Soft orange–yellow wash (lighter than Add to Cart CTA) */
export const UNIFIED_CARD_PRICE_PANEL =
  'border border-festive-500/20 bg-[linear-gradient(90deg,rgba(255,247,237,0.95)_0%,rgba(254,243,199,0.9)_55%,rgba(253,230,138,0.35)_100%)]'

export const UNIFIED_CARD_ADD_TO_CART = `${FESTIVE_CTA_BG} text-cream-50 shadow-[0_2px_10px_rgba(234,88,12,0.35)] hover:brightness-110`

export const UNIFIED_CARD_VIEW_BUTTON =
  'border-navy-800/15 bg-white text-navy-900 hover:border-festive-500/35 hover:bg-white'

export const CATALOGUE_CARD_PRICE_PANEL = UNIFIED_CARD_PRICE_PANEL

export function isEliteProductTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Elite Setout'
}

export function isPremiumProductTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Premium'
}

export function isPremiumPlusProductTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Premium Plus'
}

function isSkyworksFunctionTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Special Function Skyshots'
}

function isSkyworksColorsTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Special Colors Skyshot'
}

export function isSkyworksProductTag(tag: string | null | undefined): boolean {
  return isSkyworksFunctionTag(tag) || isSkyworksColorsTag(tag)
}

export function getCardDescriptionClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'text-navy-700/78'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'text-navy-700/75'
  }
  if (isPremiumProductTag(tag)) {
    return 'text-navy-700/72'
  }
  return 'text-navy-700/70'
}

/** Description on dark catalogue cards */
export function getCatalogueCardDescriptionClass(): string {
  return 'text-navy-700/72'
}

export function getCardCategoryClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'text-festive-500/75'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'text-festive-500/70'
  }
  if (isPremiumProductTag(tag)) {
    return 'text-festive-600/70'
  }
  return 'text-festive-600/65'
}

export function getCatalogueCardCategoryClass(): string {
  return 'text-festive-600/70'
}

export function getCardTitleClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'text-navy-900 group-hover:text-festive-700'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'text-navy-900 group-hover:text-festive-700'
  }
  if (isPremiumProductTag(tag)) {
    return 'text-navy-900 group-hover:text-festive-700'
  }
  if (isSkyworksProductTag(tag)) {
    return 'text-navy-900 group-hover:text-festive-700'
  }
  return 'text-navy-900 group-hover:text-festive-700'
}

export function getCatalogueCardTitleClass(): string {
  return 'text-navy-900 group-hover:text-festive-600'
}

/** Shared product title sizing + emphasis on cards */
export const CARD_TITLE_BASE_CLASS =
  'font-product-name text-[15px] font-extrabold leading-tight tracking-[0.01em] line-clamp-2 sm:text-[17px]'

export function getCardPricePanelClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'bg-white/75 ring-festive-300/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'bg-white/70 ring-festive-300/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
  }
  if (isPremiumProductTag(tag)) {
    return 'bg-white/72 ring-festive-300/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
  }
  return 'bg-white/68 ring-festive-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]'
}

export function getCardViewButtonClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'border-festive-500/35 text-navy-900 hover:border-festive-500/50 hover:bg-festive-50/80'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'border-festive-500/35 text-navy-900 hover:border-festive-500/50 hover:bg-festive-50/90'
  }
  if (isPremiumProductTag(tag)) {
    return 'border-festive-500/35 text-navy-900 hover:border-festive-500/50 hover:bg-festive-50/80'
  }
  return 'border-navy-900/12 text-navy-800 hover:border-festive-500/35 hover:bg-cream-50'
}

export function getCatalogueCardViewButtonClass(): string {
  return UNIFIED_CARD_VIEW_BUTTON
}

export function getCardAddToCartButtonClass(_tag?: string | null | undefined): string {
  return UNIFIED_CARD_ADD_TO_CART
}

export type DiscountOfferTagVariant = 'festive' | 'elite' | 'premium-plus'

export function getDiscountOfferTagVariant(_tag?: string | null | undefined): DiscountOfferTagVariant {
  return 'festive'
}

const CARD_PERFORATION_DOT =
  'bg-gradient-to-br from-festive-400 via-gold-400 to-festive-500 shadow-[0_0_6px_rgba(234,88,12,0.45)]'

/** Ticket-style perforation dots between image and content panel */
export function getCardPerforationDotClass(_tag: string | null | undefined): string {
  return CARD_PERFORATION_DOT
}

export function getCardPerforationLineClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) return 'border-festive-500/35'
  if (isPremiumPlusProductTag(tag)) return 'border-festive-500/40'
  if (isPremiumProductTag(tag)) return 'border-festive-500/35'
  return 'border-festive-500/35'
}

/** Perforation strip between image and body — matches card inner */
export function getCardPerforationStripClass(_tag: string | null | undefined): string {
  return 'bg-cream-100'
}

export type SectionAccent = 'gold' | 'premium' | 'premium-plus' | 'silver'

export function getSectionAccentForTag(tag: string): SectionAccent {
  const normalized = tag.trim()
  if (normalized === 'Elite Setout') return 'silver'
  if (normalized === 'Premium Plus') return 'premium-plus'
  if (normalized === 'Premium') return 'premium'
  return 'gold'
}

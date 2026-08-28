import { Eye, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, truncate, cn } from '@/lib/utils'
import { useProductCartState } from '@/hooks/useProductCartState'
import { EmptyState } from './EmptyState'
import { WishlistButton } from './WishlistButton'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'
import { ProductLink } from './ProductLink'
import { DiscountOfferTag } from './DiscountOfferTag'
import { CartQuantityControl } from './CartQuantityControl'
import { QuantitySelector } from './QuantitySelector'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import {
  isEliteProductTag,
  ELITE_BORDER_GLOW,
  ELITE_CARD_INNER,
  getCardTitleClass,
  CARD_TITLE_BASE_CLASS,
  getCardViewButtonClass,
  getCardCategoryClass,
  SILVER_METALLIC_BG,
} from '@/lib/productCardThemes'
import { isCardVisibleProductTag } from '@/lib/productTags'
import { Link } from 'react-router-dom'

interface ProductTableProps {
  products: Product[]
  emptyTitle?: string
  emptyDescription?: string
  showHeader?: boolean
}

const DESKTOP_ROW_GRID =
  'grid grid-cols-[minmax(0,1.6fr)_4.75rem_9rem_4.75rem_4.25rem_5.5rem_minmax(11.5rem,1fr)] items-center gap-x-2'

/** Sits below fixed navbar + sticky search toolbar on the products page */
const TABLE_HEADER_STICKY_CLASS = 'sticky top-[6.75rem] z-30 sm:top-32'

function ProductTableHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        DESKTOP_ROW_GRID,
        TABLE_HEADER_STICKY_CLASS,
        'hidden rounded-xl border border-gold-500/15 bg-navy-950/95 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm md:grid lg:px-5',
        className,
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400/90 lg:text-[11px]">
        Product
      </span>
      <span className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 lg:text-[11px]">
        Pcs
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-festive-400/90 lg:text-[11px]">
        Brand
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400/90 lg:text-[11px]">
        Price
      </span>
      <span className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-festive-400/80 lg:text-[11px]">
        Off
      </span>
      <span className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/80 lg:text-[11px]">
        Status
      </span>
      <span className="text-right text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 lg:text-[11px]">
        Action
      </span>
    </div>
  )
}

export { ProductTableHeader }

function TablePrice({
  price,
  originalPrice,
  hasDiscount,
}: {
  price: string | null
  originalPrice: string | null
  hasDiscount: boolean
}) {
  if (!price) {
    return (
      <span className="bg-gradient-to-r from-gold-300 to-amber-400 bg-clip-text text-xs font-semibold text-transparent sm:text-sm">
        Enquire
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          'text-xs font-bold tabular-nums leading-none',
          hasDiscount
            ? 'bg-gradient-to-r from-gold-300 via-amber-400 to-orange-400 bg-clip-text text-transparent'
            : 'text-gold-300',
        )}
      >
        {price}
      </span>
      {originalPrice && (
        <span className="text-[10px] tabular-nums leading-none text-white/35 line-through sm:text-[11px]">
          {originalPrice}
        </span>
      )}
    </div>
  )
}

function MobileTablePrice({
  price,
  originalPrice,
  hasDiscount,
}: {
  price: string | null
  originalPrice: string | null
  hasDiscount: boolean
}) {
  if (!price) {
    return <span className="text-[11px] font-semibold text-festive-400">Enquire</span>
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={cn(
          'text-sm font-bold tabular-nums leading-none sm:text-xs',
          hasDiscount ? 'text-festive-400' : 'text-gold-300',
        )}
      >
        {price}
      </span>
      {originalPrice && (
        <span className="text-[10px] tabular-nums leading-none text-white/35 line-through sm:text-[9px]">{originalPrice}</span>
      )}
    </div>
  )
}

function MobileProductTableRow({ product }: { product: Product }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const isElite = isEliteProductTag(product.tag)
  const brandName = product.brand?.trim() ?? ''
  const brandWrap = brandName.length > 16

  return (
    <article
      className={cn(
        'flex items-center gap-2.5 border-b border-white/[0.06] px-3.5 py-3 last:border-b-0 sm:gap-2.5 sm:px-3.5 sm:py-3',
        inCart && 'bg-gold-500/[0.06]',
      )}
    >
      <ProductLink product={product} className="flex min-w-0 flex-1 items-center gap-3 active:opacity-80 sm:gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#1a120e] ring-1 ring-white/10 sm:h-11 sm:w-11">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
            alt=""
            className="h-full w-full object-cover"
          />
          {hasDiscount && (
            <span className="absolute inset-x-0 top-0 bg-gradient-to-r from-festive-500 to-gold-500 py-px text-center text-[8px] font-bold leading-none text-navy-950 sm:text-[7px]">
              {product.discount_percentage}%
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-product-name truncate text-sm font-bold leading-tight text-cream-100 sm:text-[13px]">
            {product.name}
          </h3>
          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            {product.brand?.trim() ? (
              <ProductBrandBadge
                brand={product.brand}
                variant="overlay"
                wrap={brandWrap}
                className={cn(
                  'min-w-0 shrink text-[9px] sm:text-[9px]',
                  brandWrap ? 'max-w-full' : 'max-w-[calc(100%-3.5rem)]',
                )}
              />
            ) : null}
            {product.pieces != null && product.pieces >= 1 ? (
              <span className="shrink-0 text-[11px] tabular-nums text-white/40 sm:text-[10px]">{product.pieces} pcs</span>
            ) : null}
          </div>
        </div>

      </ProductLink>

      <div className="relative z-[1] flex shrink-0 items-center gap-1.5">
        <MobileTablePrice price={price} originalPrice={originalPrice} hasDiscount={hasDiscount} />
        <WishlistButton product={product} size="sm" className="rounded-full bg-white/[0.06] hover:bg-white/10" />

        {product.is_available ? (
          inCart ? (
            <QuantitySelector
              value={quantity}
              onChange={handleQuantityChange}
              variant="table"
              min={0}
              className="shrink-0 rounded-lg border border-gold-500/25 bg-white/[0.04] p-0 [&_button]:h-8 [&_button]:w-8 [&_button]:text-gold-400 [&_span]:min-w-[1.25rem] [&_span]:text-sm [&_span]:text-cream-50"
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy-950 transition-all active:scale-95 sm:h-8 sm:w-8',
                isElite ? SILVER_METALLIC_BG : 'bg-gradient-to-r from-festive-500 to-gold-500',
              )}
            >
              <ShoppingCart className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </button>
          )
        ) : null}
      </div>
    </article>
  )
}

function TableStatus({ available }: { available: boolean }) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" aria-hidden="true" />
        In stock
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-white/45 sm:text-[11px]">
      Sold out
    </span>
  )
}

function ProductTableRowCard({ product }: { product: Product }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const isElite = isEliteProductTag(product.tag)
  const showCategory = product.category && !isCardVisibleProductTag(product.tag)
  const brandName = product.brand?.trim() ?? ''
  const brandWrap = brandName.length > 18

  return (
    <article
      className={cn(
        'product-grid-item group relative hidden md:block',
        inCart && 'ring-1 ring-gold-400/35 ring-offset-2 ring-offset-cream-50',
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-2xl',
          isElite ? ELITE_BORDER_GLOW : 'bg-gradient-to-br from-gold-400/45 via-festive-500/25 to-gold-600/35',
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 sm:rounded-2xl sm:hover:-translate-y-0.5 sm:hover:shadow-[0_14px_40px_rgba(0,0,0,0.42)]',
          isElite ? ELITE_CARD_INNER : 'bg-navy-950',
        )}
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent opacity-80" aria-hidden="true" />

        {/* Desktop — horizontal card row */}
        <div className={cn(DESKTOP_ROW_GRID, 'px-4 py-3.5 lg:px-5 lg:py-4')}>
          <div className="flex min-w-0 items-center gap-3 lg:gap-4">
            <ProductLink product={product} className="relative shrink-0">
              <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl bg-[#1a120e] ring-1 ring-white/10 lg:h-20 lg:w-20">
                <img
                  src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                {hasDiscount && (
                  <DiscountOfferTag
                    percentage={product.discount_percentage!}
                    variant={isElite ? 'elite' : 'festive'}
                    className="w-7 pt-1 pb-2 [&_span:first-child]:text-[9px] [&_span:last-child]:text-[7px]"
                  />
                )}
              </div>
            </ProductLink>

            <div className="min-w-0 flex-1">
              <ProductLink product={product} className="block min-w-0">
                <h3 className={cn(CARD_TITLE_BASE_CLASS, getCardTitleClass(product.tag), 'text-sm lg:text-[15px]')}>
                  {product.name}
                </h3>
              </ProductLink>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <ProductTagBadge tag={product.tag} variant="overlay" compact />
                {showCategory && (
                  <span className={cn('text-[9px] font-semibold uppercase tracking-[0.14em]', getCardCategoryClass(product.tag))}>
                    {product.category!.name}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="mt-1 hidden line-clamp-1 text-[11px] text-white/40 lg:block">
                  {truncate(product.description, 72)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ProductPiecesBadge pieces={product.pieces} variant={isElite ? 'elite' : 'ember'} />
          </div>

          <div className="min-w-0 justify-self-start">
            {product.brand?.trim() ? (
              <ProductBrandBadge
                brand={product.brand}
                variant="overlay"
                wrap={brandWrap}
              />
            ) : (
              <span className="text-[11px] text-white/25">—</span>
            )}
          </div>

          <div className="min-w-0">
            <TablePrice
              price={price}
              originalPrice={originalPrice}
              hasDiscount={hasDiscount}
            />
          </div>

          <div className="flex justify-center">
            {hasDiscount ? (
              <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-festive-500 to-gold-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-950 shadow-[0_2px_10px_rgba(234,88,12,0.35)]">
                {product.discount_percentage}%
              </span>
            ) : (
              <span className="text-[11px] text-white/20">—</span>
            )}
          </div>

          <div className="flex justify-center">
            <TableStatus available={product.is_available} />
          </div>

          <div className="flex items-center justify-end gap-1.5">
            {product.is_available ? (
              <>
                <ProductLink
                  product={product}
                  className={cn(
                    'inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-all',
                    getCardViewButtonClass(product.tag),
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">View</span>
                </ProductLink>
                {inCart ? (
                  <CartQuantityControl
                    value={quantity}
                    onChange={handleQuantityChange}
                    variant={isElite ? 'elite' : 'ember'}
                    min={0}
                    className="min-w-[7.5rem]"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[11px] font-bold text-navy-950 transition-all hover:brightness-110 active:scale-[0.98]',
                      isElite ? SILVER_METALLIC_BG : 'bg-gradient-to-r from-festive-500 to-gold-500',
                    )}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline">Add</span>
                  </button>
                )}
                <WishlistButton
                  product={product}
                  size="sm"
                  className="rounded-full bg-white/[0.06] hover:bg-white/10"
                />
              </>
            ) : (
              <ProductLink
                product={product}
                className={cn(
                  'inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-[11px] font-semibold',
                  getCardViewButtonClass(product.tag),
                )}
              >
                View details
              </ProductLink>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProductTable({
  products,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or check back later.',
  showHeader = true,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link
            to="/products"
            className="btn-hover-lift rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
          >
            Browse All Products
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Mobile — compact table list */}
      <div className="border border-navy-900/10 border-x-0 bg-navy-950 shadow-[0_4px_24px_rgba(0,0,0,0.28)] max-md:-mx-4 max-md:rounded-none md:hidden">
        <div className="h-0.5 bg-gradient-to-r from-gold-400 via-festive-500 to-gold-400" aria-hidden="true" />
        <div
          className={cn(
            'flex items-center justify-between gap-2 border-b border-white/[0.08] bg-navy-950/95 px-3.5 py-2.5 backdrop-blur-sm sm:px-3.5',
            TABLE_HEADER_STICKY_CLASS,
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-400/85 sm:text-[9px]">Product</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 sm:text-[9px]">Price · Add</span>
        </div>
        {products.map((product) => (
          <MobileProductTableRow key={product.id} product={product} />
        ))}
      </div>

      {showHeader ? <ProductTableHeader /> : null}

      <div className="hidden space-y-3 md:block">
        {products.map((product) => (
          <ProductTableRowCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

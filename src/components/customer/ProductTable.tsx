import { Eye, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, truncate, cn } from '@/lib/utils'
import { useProductCartState } from '@/hooks/useProductCartState'
import { EmptyState } from './EmptyState'
import { WishlistButton } from './WishlistButton'
import { ProductTagBadge } from './ProductTagBadge'
import { ProductLink } from './ProductLink'
import { DiscountOfferTag } from './DiscountOfferTag'
import { QuantitySelector } from './QuantitySelector'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductHighlightBadges } from './ProductHighlightBadges'
import {
  isEliteProductTag,
  CARD_TITLE_BASE_CLASS,
  SILVER_METALLIC_BG,
  isPremiumProductTag,
  isPremiumPlusProductTag,
} from '@/lib/productCardThemes'
import { isCardVisibleProductTag } from '@/lib/productTags'
import { Link } from 'react-router-dom'

interface ProductTableGroup {
  id: string
  name: string
  products: Product[]
}

interface ProductTableProps {
  products?: Product[]
  groups?: ProductTableGroup[]
  emptyTitle?: string
  emptyDescription?: string
  showHeader?: boolean
}

const DESKTOP_ROW_GRID =
  'grid grid-cols-[minmax(0,1.5fr)_4.75rem_8.5rem_4.75rem_4rem_5.25rem_minmax(15rem,1.25fr)] items-center gap-x-2'

/** Below fixed navbar */
const TABLE_STICKY_HEADER = 'sticky top-14 z-40 sm:top-[4.25rem]'
/** Must match header row height (min-h-11) so no white gap when both stick */
const TABLE_HEADER_ROW_CLASS = 'min-h-11 items-center'
const TABLE_STICKY_CATEGORY =
  'sticky top-[calc(3.5rem+2.75rem)] z-30 sm:top-[calc(4.25rem+2.75rem)]'
const TABLE_STICKY_CATEGORY_MOBILE = TABLE_STICKY_CATEGORY

const TABLE_VIEW_BUTTON_CLASS = 'border-stone-200 text-stone-700'

function getTableViewButtonClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'border-slate-300/60 text-slate-700'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'border-amber-300/60 text-amber-800'
  }
  if (isPremiumProductTag(tag)) {
    return 'border-orange-300/50 text-orange-800'
  }
  return TABLE_VIEW_BUTTON_CLASS
}

/** Highlighted sticky chrome — stronger than product row stripes */
const TABLE_TITLE_CLASS = 'font-product-name font-bold text-navy-950'
const TABLE_DESC_CLASS = 'text-[11px] leading-snug text-stone-500'
const TABLE_META_CLASS = 'text-stone-400'
const TABLE_SHELL_CLASS =
  'border-stone-200/90 bg-white shadow-[0_4px_24px_rgba(26,16,12,0.06)]'
const TABLE_TOP_BAR_CLASS = 'h-1 bg-gradient-to-r from-festive-500 via-gold-400 to-festive-500'
/** Rich orange–gold bar (mirrors category gradient, stays fully saturated) */
const TABLE_HEADER_HIGHLIGHT =
  'border-b border-orange-500/30 bg-gradient-to-r from-gold-500 to-festive-500'
const TABLE_CATEGORY_HIGHLIGHT =
  'border-b border-orange-400/35 bg-gradient-to-r from-festive-500 via-amber-500 to-festive-500'
const TABLE_HEADER_LABEL =
  'text-[10px] font-bold uppercase tracking-[0.14em] text-navy-950 lg:text-[11px]'
const TABLE_HEADER_LABEL_MUTED = TABLE_HEADER_LABEL
const TABLE_HEADER_LABEL_ACCENT = TABLE_HEADER_LABEL
const TABLE_HEADER_LABEL_STATUS = TABLE_HEADER_LABEL
const TABLE_CATEGORY_TEXT_CLASS = 'text-navy-950 drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]'
const TABLE_PRODUCT_CATEGORY_CLASS =
  'inline-flex w-fit max-w-full shrink-0 items-center whitespace-nowrap rounded-md border border-orange-300/50 bg-gradient-to-r from-festive-500/12 to-gold-500/18 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-orange-700'
const TABLE_STRIPE_EVEN = 'bg-white'
const TABLE_STRIPE_ODD = 'bg-[#fffbf2]'
const TABLE_BORDER = 'border-stone-200/90'
const TABLE_IN_CART_BG = 'bg-festive-50/90'
const TABLE_THUMB_CLASS = 'bg-stone-100 ring-1 ring-stone-200/90'

function getTableStripeClass(index: number): string {
  return index % 2 === 0 ? TABLE_STRIPE_EVEN : TABLE_STRIPE_ODD
}

function ProductTableHeader({ className, sticky = true }: { className?: string; sticky?: boolean }) {
  return (
    <div
      className={cn(
        DESKTOP_ROW_GRID,
        sticky && TABLE_STICKY_HEADER,
        sticky && TABLE_HEADER_HIGHLIGHT,
        TABLE_HEADER_ROW_CLASS,
        'hidden border-0 px-4 py-0 md:grid lg:px-5',
        className,
      )}
    >
      <span className={TABLE_HEADER_LABEL}>Product</span>
      <span className={cn('text-center', TABLE_HEADER_LABEL_MUTED)}>Pcs</span>
      <span className={TABLE_HEADER_LABEL}>Brand</span>
      <span className={TABLE_HEADER_LABEL_ACCENT}>Price</span>
      <span className={cn('text-center', TABLE_HEADER_LABEL_ACCENT)}>Off</span>
      <span className={cn('text-center', TABLE_HEADER_LABEL_STATUS)}>Status</span>
      <span className={cn('text-right', TABLE_HEADER_LABEL_MUTED)}>Action</span>
    </div>
  )
}

export { ProductTableHeader }

function ProductTableCategoryRow({
  id,
  name,
  className,
  sticky = true,
  variant = 'mobile',
}: {
  id: string
  name: string
  className?: string
  sticky?: boolean
  variant?: 'mobile' | 'desktop'
}) {
  return (
    <div
      id={`category-${id}`}
      className={cn(
        'scroll-mt-20 flex min-h-11 items-center justify-center border-b border-l-4 border-l-orange-700 px-4 py-0 text-center sm:scroll-mt-[4.5rem] lg:px-5',
        sticky && TABLE_CATEGORY_HIGHLIGHT,
        sticky && variant === 'mobile' && TABLE_STICKY_CATEGORY_MOBILE,
        sticky && variant === 'desktop' && TABLE_STICKY_CATEGORY,
        className,
      )}
    >
      <h2
        className={cn(
          'w-full font-display text-[15px] font-bold uppercase tracking-[0.08em] sm:text-base lg:text-[17px]',
          TABLE_CATEGORY_TEXT_CLASS,
        )}
      >
        {name}
      </h2>
    </div>
  )
}

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
      <span className="text-xs font-semibold text-festive-600 sm:text-sm">
        Enquire
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          'text-xs font-bold tabular-nums leading-none',
          hasDiscount ? 'text-festive-600' : 'text-navy-950',
        )}
      >
        {price}
      </span>
      {originalPrice && (
        <span className={cn('text-[10px] tabular-nums leading-none line-through sm:text-[11px]', TABLE_META_CLASS)}>
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
    return <span className="text-xs font-semibold text-festive-600">Enquire</span>
  }

  return (
    <div className="flex min-w-[3.25rem] flex-col items-end gap-0.5">
      <span
        className={cn(
          'text-base font-bold tabular-nums leading-none',
          hasDiscount ? 'text-festive-600' : 'text-navy-950',
        )}
      >
        {price}
      </span>
      {originalPrice && (
        <span className={cn('text-[11px] tabular-nums leading-none line-through', TABLE_META_CLASS)}>
          {originalPrice}
        </span>
      )}
    </div>
  )
}

function MobileProductTableRow({ product, index }: { product: Product; index: number }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const isElite = isEliteProductTag(product.tag)

  return (
    <article
      className={cn(
        'flex items-center gap-3 border-b px-4 py-3.5 last:border-b-0',
        TABLE_BORDER,
        inCart ? TABLE_IN_CART_BG : getTableStripeClass(index),
      )}
    >
      <ProductLink product={product} className="flex min-w-0 flex-1 items-center gap-3.5">
        <div className={cn('relative h-16 w-16 shrink-0 overflow-hidden rounded-xl', TABLE_THUMB_CLASS)}>
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
            alt=""
            className="h-full w-full object-cover"
          />
          {hasDiscount && (
            <span className="absolute inset-x-0 top-0 bg-gradient-to-r from-festive-500 to-gold-500 py-0.5 text-center text-[9px] font-bold leading-none text-navy-950">
              {product.discount_percentage}%
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={cn('line-clamp-2 text-base font-bold leading-snug', TABLE_TITLE_CLASS)}>
            {product.name}
          </h3>
          <ProductHighlightBadges product={product} className="mt-1.5" />
          <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
            {product.brand?.trim() ? (
              <ProductBrandBadge
                brand={product.brand}
                variant="table"
                className="px-2.5 py-1 text-[11px]"
              />
            ) : null}
            {product.pieces != null && product.pieces >= 1 ? (
              <span className="shrink-0 text-xs font-semibold text-stone-600">{product.pieces} pcs</span>
            ) : null}
          </div>
        </div>

      </ProductLink>

      <div className="relative z-[1] flex shrink-0 items-center gap-2">
        <MobileTablePrice price={price} originalPrice={originalPrice} hasDiscount={hasDiscount} />
        <WishlistButton
          product={product}
          size="md"
          className="h-10 w-10 rounded-full bg-stone-100"
        />

        {product.is_available ? (
          inCart ? (
            <QuantitySelector
              value={quantity}
              onChange={handleQuantityChange}
              variant="table"
              min={0}
              className="shrink-0 rounded-lg border border-stone-200 bg-white p-0 [&_button]:h-10 [&_button]:w-10 [&_button]:text-stone-600 [&_span]:min-w-[1.5rem] [&_span]:text-base [&_span]:text-navy-950"
            />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-navy-950 shadow-[0_2px_10px_rgba(234,88,12,0.25)]',
                isElite ? SILVER_METALLIC_BG : 'bg-gradient-to-r from-festive-500 to-gold-500',
              )}
            >
              <ShoppingCart className="h-5 w-5" />
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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.35)]" aria-hidden="true" />
        In stock
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold text-stone-500 sm:text-[11px]">
      Sold out
    </span>
  )
}

function ProductTableRowCard({
  product,
  index,
  showCategoryLabel = true,
}: {
  product: Product
  index: number
  showCategoryLabel?: boolean
}) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const isElite = isEliteProductTag(product.tag)
  const showCategory =
    showCategoryLabel && product.category && !isCardVisibleProductTag(product.tag)
  const brandName = product.brand?.trim() ?? ''
  const brandWrap = brandName.length > 18

  return (
    <article
      className={cn(
        'product-grid-item group relative hidden border-b md:grid md:items-center',
        TABLE_BORDER,
        DESKTOP_ROW_GRID,
        'px-4 py-3.5 lg:px-5 lg:py-4',
        inCart ? TABLE_IN_CART_BG : getTableStripeClass(index),
      )}
    >
          <div className="flex min-w-0 items-center gap-3 lg:gap-4">
            <ProductLink product={product} className="relative shrink-0">
              <div className={cn('relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl lg:h-20 lg:w-20', TABLE_THUMB_CLASS)}>
                <img
                  src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
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
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <ProductHighlightBadges product={product} compact />
              </div>
              <ProductLink product={product} className="block min-w-0">
                <h3 className={cn(CARD_TITLE_BASE_CLASS, TABLE_TITLE_CLASS, 'text-sm lg:text-[15px]')}>
                  {product.name}
                </h3>
              </ProductLink>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <ProductTagBadge tag={product.tag} variant="light" compact />
              </div>
              {showCategory && (
                <span className={cn('mt-1', TABLE_PRODUCT_CATEGORY_CLASS)}>
                  {product.category!.name}
                </span>
              )}
              {product.description && (
                <p className={cn('mt-1.5 hidden line-clamp-1 lg:block', TABLE_DESC_CLASS)}>
                  {truncate(product.description, 72)}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <ProductPiecesBadge pieces={product.pieces} variant="table" />
          </div>

          <div className="min-w-0 justify-self-start">
            {product.brand?.trim() ? (
              <ProductBrandBadge
                brand={product.brand}
                variant="table"
                wrap={brandWrap}
                className="text-[9px] sm:text-[10px]"
              />
            ) : (
              <span className={cn('text-[11px]', TABLE_META_CLASS)}>—</span>
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
              <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-festive-500 to-gold-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-950 shadow-[0_2px_10px_rgba(234,88,12,0.25)]">
                {product.discount_percentage}%
              </span>
            ) : (
              <span className={cn('text-[11px]', TABLE_META_CLASS)}>—</span>
            )}
          </div>

          <div className="flex min-w-0 justify-center overflow-hidden">
            <TableStatus available={product.is_available} />
          </div>

          <div className="flex min-w-0 items-center justify-end gap-1">
            {product.is_available ? (
              <>
                <ProductLink
                  product={product}
                  className={cn(
                    'inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border py-2 text-[11px] font-semibold',
                    inCart ? 'px-2' : 'px-2.5',
                    getTableViewButtonClass(product.tag),
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className={cn('hidden xl:inline', inCart && 'xl:hidden')}>View</span>
                </ProductLink>
                {inCart ? (
                  <QuantitySelector
                    value={quantity}
                    onChange={handleQuantityChange}
                    variant="table"
                    min={0}
                    className="w-auto shrink-0 [&_button]:h-7 [&_button]:w-7 [&_span]:min-w-7 [&_span]:text-sm [&_span]:font-semibold [&_span]:text-navy-950"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[11px] font-bold text-navy-950',
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
                  className="rounded-full bg-stone-100"
                />
              </>
            ) : (
              <ProductLink
                product={product}
                className={cn(
                  'inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-[11px] font-semibold',
                  getTableViewButtonClass(product.tag),
                )}
              >
                View details
              </ProductLink>
            )}
          </div>
    </article>
  )
}

export function ProductTable({
  products = [],
  groups,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or check back later.',
  showHeader = true,
}: ProductTableProps) {
  const resolvedProducts = groups?.flatMap((group) => group.products) ?? products

  if (resolvedProducts.length === 0) {
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

  let stripeIndex = 0

  const tableEntries = groups
    ? groups.flatMap((group) => [
        { kind: 'category' as const, group },
        ...group.products.map((product) => ({ kind: 'product' as const, product, index: stripeIndex++ })),
      ])
    : products.map((product, index) => ({ kind: 'product' as const, product, index }))

  const mobileRows = tableEntries.map((entry) =>
    entry.kind === 'category' ? (
      <ProductTableCategoryRow
        key={`cat-${entry.group.id}`}
        id={entry.group.id}
        name={entry.group.name}
      />
    ) : (
      <MobileProductTableRow key={entry.product.id} product={entry.product} index={entry.index} />
    ),
  )

  const desktopRows = tableEntries.map((entry) =>
    entry.kind === 'category' ? (
      <ProductTableCategoryRow
        key={`cat-${entry.group.id}`}
        id={entry.group.id}
        name={entry.group.name}
        variant="desktop"
        className="hidden md:flex"
      />
    ) : (
      <ProductTableRowCard
        key={entry.product.id}
        product={entry.product}
        index={entry.index}
        showCategoryLabel={!groups}
      />
    ),
  )

  return (
    <div className="space-y-3">
      {/* Mobile — compact table list */}
      <div className={cn('flex flex-col gap-0 border border-x-0 max-md:-mx-4 max-md:rounded-none md:hidden', TABLE_SHELL_CLASS)}>
        <div className={TABLE_TOP_BAR_CLASS} aria-hidden="true" />
        <div
          id="catalogue-table-header"
          className={cn(
            'flex min-h-12 items-center justify-between gap-2 px-4 py-0',
            TABLE_STICKY_HEADER,
            TABLE_HEADER_HIGHLIGHT,
          )}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-950">Product</span>
          <span className="text-right text-[11px] font-bold uppercase tracking-[0.14em] text-navy-950">
            Price · Add
          </span>
        </div>
        {mobileRows}
      </div>

      <div className={cn('hidden flex-col gap-0 rounded-xl md:flex', TABLE_SHELL_CLASS)}>
        <div className={TABLE_TOP_BAR_CLASS} aria-hidden="true" />
        {showHeader ? <ProductTableHeader /> : null}
        {desktopRows}
      </div>
    </div>
  )
}

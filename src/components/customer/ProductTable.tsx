import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, cn } from '@/lib/utils'
import { useProductCartState } from '@/hooks/useProductCartState'
import { QuantitySelector } from './QuantitySelector'
import { EmptyState } from './EmptyState'
import { WishlistButton } from './WishlistButton'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'

interface ProductTableProps {
  products: Product[]
  emptyTitle?: string
  emptyDescription?: string
}

/** Shared desktop grid — no column gap so row backgrounds stay continuous */
const DESKTOP_TABLE_GRID =
  'hidden md:grid md:grid-cols-[minmax(0,1.35fr)_5rem_7.5rem_5.5rem_5.5rem_6rem_minmax(10rem,1fr)] md:items-stretch'

const DESKTOP_CELL = 'flex min-w-0 items-center border-b border-cream-200/80 py-4 pr-3 lg:py-5 lg:pr-4'
const DESKTOP_HEADER_CELL =
  'flex min-w-0 items-center border-b border-cream-200 bg-cream-50 py-3.5 pr-3 text-[10px] font-bold uppercase tracking-wider lg:py-4 lg:pr-4'

function ProductTablePrice({
  price,
  originalPrice,
  hasDiscount,
  discountPercentage,
  compact = false,
  showDiscount = true,
}: {
  price: string | null
  originalPrice: string | null
  hasDiscount: boolean
  discountPercentage: number | null | undefined
  compact?: boolean
  showDiscount?: boolean
}) {
  if (!price) {
    return <p className={cn('font-semibold text-festive-600', compact ? 'text-xs' : 'text-sm')}>Enquire</p>
  }

  if (compact) {
    return (
      <div className="inline-flex flex-col gap-0.5">
        <span
          className={cn(
            'text-sm font-bold tabular-nums leading-none',
            hasDiscount ? 'text-festive-600' : 'text-navy-900',
          )}
        >
          {price}
        </span>
        {originalPrice && (
          <span className="text-[10px] tabular-nums leading-none text-navy-700/40 line-through">
            {originalPrice}
          </span>
        )}
        {hasDiscount && (
          <span className="inline-flex w-fit items-center rounded bg-gradient-to-r from-festive-500 to-gold-500 px-1 py-px text-[9px] font-bold uppercase leading-none text-white">
            {discountPercentage}% off
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <p
        className={cn(
          'text-sm font-bold leading-none tabular-nums',
          hasDiscount ? 'text-festive-600' : 'text-navy-900',
        )}
      >
        {price}
      </p>
      {originalPrice && (
        <p className="text-[11px] leading-none tabular-nums text-navy-700/40 line-through">{originalPrice}</p>
      )}
      {hasDiscount && showDiscount && (
        <span className="mt-0.5 inline-flex w-fit items-center rounded-md bg-gradient-to-r from-festive-500 to-gold-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-festive-500/25">
          {discountPercentage}% off
        </span>
      )}
    </div>
  )
}

function ProductTableActions({
  product,
  inCart,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  className,
  showWishlist = true,
}: {
  product: Product
  inCart: boolean
  quantity: number
  handleQuantityChange: (value: number) => void
  handleAddToCart: () => void
  className?: string
  showWishlist?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {product.is_available ? (
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-navy-900/10 bg-white p-0.5">
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            variant="table"
            compact
            min={0}
            className="border-0 bg-transparent p-0 shadow-none"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={inCart ? `Update ${product.name} in cart` : `Add ${product.name} to cart`}
            className={cn(
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-festive-500 to-gold-500 text-navy-950',
              inCart && 'ring-2 ring-gold-400/50 ring-offset-1',
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      {showWishlist ? <WishlistButton product={product} size="sm" /> : null}
    </div>
  )
}

function MobileProductMeta({
  price,
  originalPrice,
  hasDiscount,
  discountPercentage,
  pieces,
  available,
}: {
  price: string | null
  originalPrice: string | null
  hasDiscount: boolean
  discountPercentage: number | null | undefined
  pieces: number | null | undefined
  available: boolean
}) {
  const meta = [
    pieces != null && pieces >= 1 ? `${pieces} pcs` : null,
    available ? 'In stock' : 'Sold out',
  ].filter(Boolean)

  return (
    <div className="mt-1 space-y-1">
      {price ? (
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <span
            className={cn(
              'shrink-0 text-sm font-bold tabular-nums leading-none',
              hasDiscount ? 'text-festive-600' : 'text-navy-900',
            )}
          >
            {price}
          </span>
          {originalPrice && (
            <span className="shrink-0 text-[10px] tabular-nums leading-none text-navy-700/40 line-through">
              {originalPrice}
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex w-fit shrink-0 rounded bg-gradient-to-r from-festive-500 to-gold-500 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white">
              {discountPercentage}% off
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs font-semibold text-festive-600">Enquire</p>
      )}
      {meta.length > 0 && (
        <p className="text-[10px] leading-none text-navy-700/45">{meta.join(' · ')}</p>
      )}
    </div>
  )
}

function ProductTableDiscount({
  hasDiscount,
  discountPercentage,
}: {
  hasDiscount: boolean
  discountPercentage: number | null | undefined
}) {
  if (!hasDiscount) {
    return <span className="block text-[11px] leading-none text-navy-700/30">—</span>
  }

  return (
    <span className="inline-flex items-center rounded-md bg-gradient-to-r from-festive-500 to-gold-500 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-white shadow-sm shadow-festive-500/25">
      {discountPercentage}% off
    </span>
  )
}

function ProductTablePieces({ pieces }: { pieces: number | null | undefined }) {
  if (pieces == null || pieces < 1) {
    return <span className="block text-[11px] leading-none text-navy-700/30">—</span>
  }

  return <span className="block text-sm tabular-nums leading-none text-navy-700/70">{pieces} pcs</span>
}

function ProductTableBrand({ brand }: { brand: string | null | undefined }) {
  const name = brand?.trim()

  return (
    <div className="flex min-w-0 items-center">
      {!name ? (
        <span className="text-[11px] leading-none text-navy-700/30">—</span>
      ) : (
        <ProductBrandBadge
          brand={name}
          variant="light"
          className="h-6 max-w-full items-center justify-center whitespace-nowrap px-2.5 leading-none"
        />
      )}
    </div>
  )
}

function ProductTableStatus({ available, compact = false }: { available: boolean; compact?: boolean }) {
  if (available) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center whitespace-nowrap font-medium text-emerald-700',
          compact ? 'text-[10px]' : 'gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px]',
        )}
      >
        <span className={cn('rounded-full bg-emerald-500', compact ? 'h-1 w-1' : 'h-1.5 w-1.5')} aria-hidden="true" />
        In stock
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 whitespace-nowrap font-medium text-navy-700/50',
        compact ? 'text-[10px]' : 'rounded-full bg-navy-900/[0.06] px-2.5 py-0.5 text-[11px]',
      )}
    >
      Sold out
    </span>
  )
}

function ProductTableDesktopCells({
  product,
  index,
  inCart,
  quantity,
  price,
  originalPrice,
  hasDiscount,
  handleQuantityChange,
  handleAddToCart,
}: {
  product: Product
  index: number
  inCart: boolean
  quantity: number
  price: string | null
  originalPrice: string | null
  hasDiscount: boolean
  handleQuantityChange: (value: number) => void
  handleAddToCart: () => void
}) {
  const rowBg = cn(
    index % 2 === 0 ? 'bg-white' : 'bg-cream-50/60',
    inCart && 'bg-gold-500/[0.08]',
  )

  return (
    <>
      <div className={cn(DESKTOP_CELL, rowBg, 'pl-5 lg:pl-6')}>
        <Link to={`/products/${product.slug}`} className="flex w-full min-w-0 items-center gap-3 lg:gap-4">
          <div className="shrink-0 overflow-hidden rounded-xl bg-cream-100/80 p-1 ring-1 ring-navy-900/10">
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              className="h-16 w-16 rounded-lg object-cover lg:h-[4.75rem] lg:w-[4.75rem]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-product-name truncate text-sm font-bold text-navy-800">
              {product.name}
            </h3>
            {product.tag && (
              <div className="mt-1">
                <ProductTagBadge tag={product.tag} variant="light" compact />
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className={cn(DESKTOP_CELL, rowBg)}>
        <ProductTablePieces pieces={product.pieces} />
      </div>

      <div className={cn(DESKTOP_CELL, rowBg)}>
        <ProductTableBrand brand={product.brand} />
      </div>

      <div className={cn(DESKTOP_CELL, rowBg)}>
        <ProductTablePrice
          price={price}
          originalPrice={originalPrice}
          hasDiscount={hasDiscount}
          discountPercentage={product.discount_percentage}
          showDiscount={false}
        />
      </div>

      <div className={cn(DESKTOP_CELL, rowBg)}>
        <ProductTableDiscount
          hasDiscount={hasDiscount}
          discountPercentage={product.discount_percentage}
        />
      </div>

      <div className={cn(DESKTOP_CELL, rowBg)}>
        <ProductTableStatus available={product.is_available} />
      </div>

      <div className={cn(DESKTOP_CELL, rowBg, 'pr-5 lg:pr-6')}>
        <div className="flex w-full justify-end">
          <ProductTableActions
            product={product}
            inCart={inCart}
            quantity={quantity}
            handleQuantityChange={handleQuantityChange}
            handleAddToCart={handleAddToCart}
            className="justify-end"
          />
        </div>
      </div>
    </>
  )
}

function ProductTableDesktopRow({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0

  return (
    <ProductTableDesktopCells
      product={product}
      index={index}
      inCart={inCart}
      quantity={quantity}
      price={price}
      originalPrice={originalPrice}
      hasDiscount={hasDiscount}
      handleQuantityChange={handleQuantityChange}
      handleAddToCart={handleAddToCart}
    />
  )
}

function ProductTableRow({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0

  const rowBg = cn(
    index % 2 === 0 ? 'bg-white' : 'bg-cream-50/60',
    inCart && 'bg-gold-500/[0.08]',
  )

  return (
    <>
      {/* Mobile — clean two-part card */}
      <article
        className={cn(
          'border-b border-cream-200/80 px-3 py-4 last:border-b-0 md:hidden',
          rowBg,
        )}
      >
        <div className="flex gap-4">
          <Link to={`/products/${product.slug}`} className="shrink-0">
            <div className="overflow-hidden rounded-xl bg-cream-100/80 p-1 ring-1 ring-navy-900/10">
              <img
                src={getImageUrl(product.image_url)}
                alt={product.name}
                className="h-[4.75rem] w-[4.75rem] rounded-lg object-cover sm:h-20 sm:w-20"
              />
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/products/${product.slug}`} className="min-w-0 flex-1">
                <h3 className="font-product-name line-clamp-2 text-sm font-bold leading-snug text-navy-800">
                  {product.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <ProductBrandBadge brand={product.brand} variant="light" />
                  <ProductTagBadge tag={product.tag} variant="light" compact />
                </div>
              </Link>
              <WishlistButton product={product} size="sm" />
            </div>

            <MobileProductMeta
              price={price}
              originalPrice={originalPrice}
              hasDiscount={hasDiscount}
              discountPercentage={product.discount_percentage}
              pieces={product.pieces}
              available={product.is_available}
            />
          </div>
        </div>

        {product.is_available && (
          <div className="mt-2.5 flex justify-end border-t border-cream-200/70 pt-2.5">
            <ProductTableActions
              product={product}
              inCart={inCart}
              quantity={quantity}
              handleQuantityChange={handleQuantityChange}
              handleAddToCart={handleAddToCart}
              showWishlist={false}
            />
          </div>
        )}
      </article>
    </>
  )
}

export function ProductTable({
  products,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or check back later.',
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
    <div className="overflow-hidden rounded-2xl border border-navy-900/8 bg-gradient-to-b from-white to-cream-50/80 shadow-[0_4px_24px_rgba(12,8,6,0.06)]">
      <div className="h-1 bg-gradient-to-r from-gold-400 via-festive-500 to-gold-400" aria-hidden="true" />

      {products.map((product, index) => (
        <ProductTableRow key={product.id} product={product} index={index} />
      ))}

      <div className={DESKTOP_TABLE_GRID}>
        <span className={cn(DESKTOP_HEADER_CELL, 'pl-5 text-navy-900 lg:pl-6')}>Product</span>
        <span className={cn(DESKTOP_HEADER_CELL, 'text-navy-700/70')}>Pieces</span>
        <span className={cn(DESKTOP_HEADER_CELL, 'text-festive-500')}>Brand</span>
        <span className={cn(DESKTOP_HEADER_CELL, 'text-festive-500')}>Price</span>
        <span className={cn(DESKTOP_HEADER_CELL, 'text-festive-500')}>Discount</span>
        <span className={cn(DESKTOP_HEADER_CELL, 'text-emerald-600')}>Status</span>
        <span className={cn(DESKTOP_HEADER_CELL, 'pr-5 justify-end text-right text-navy-700/70 lg:pr-6')}>
          Action
        </span>

        {products.map((product, index) => (
          <ProductTableDesktopRow key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}

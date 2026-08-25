import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check, Sparkles, MessageCircle } from 'lucide-react'
import type { Product } from '@/types/database'
import { cn, formatPrice } from '@/lib/utils'
import { ProductImage } from './ProductImage'
import { resolveProductPrice, resolveOriginalPriceForDisplay } from '@/lib/pricing'
import { QuantitySelector } from './QuantitySelector'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import { DiscountOfferTag } from './DiscountOfferTag'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { WishlistButton } from './WishlistButton'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { setCartItem, isInCart, getItemQuantity } = useCart()
  const { showToast } = useToast()
  const inCart = isInCart(product.id)
  const cartQty = getItemQuantity(product.id)

  const [quantity, setQuantity] = useState(inCart ? cartQty : 1)

  useEffect(() => {
    if (inCart) setQuantity(cartQty)
  }, [inCart, cartQty])

  const sellingPrice = resolveProductPrice(product)
  const price = formatPrice(sellingPrice)
  const originalPriceValue = resolveOriginalPriceForDisplay(product)
  const originalPrice = originalPriceValue != null ? formatPrice(originalPriceValue) : null
  const savings =
    originalPriceValue != null && sellingPrice != null
      ? formatPrice(originalPriceValue - sellingPrice)
      : null
  const specs = product.specifications ? Object.entries(product.specifications) : []
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty)
    if (inCart) {
      setCartItem({
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        imageUrl: product.image_url,
        price: sellingPrice,
        pieces: product.pieces ?? null,
        quantity: qty,
      })
    }
  }

  const handleAddToCart = () => {
    setCartItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: sellingPrice,
      pieces: product.pieces ?? null,
      quantity,
    })
    showToast(
      inCart ? `Updated ${product.name} quantity` : `Added ${product.name} to cart`,
      'success',
    )
  }

  return (
    <div className="grid items-start gap-4 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
      {/* Image stage */}
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-gold-400/45 via-festive-500/25 to-gold-600/35 opacity-80 sm:rounded-[1.35rem]"
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-[calc(0.875rem-1px)] bg-navy-950 shadow-[0_16px_40px_rgba(12,8,6,0.28)] sm:rounded-[1.32rem] sm:shadow-[0_24px_60px_rgba(12,8,6,0.35)]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#1a120e] sm:aspect-square">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              priority
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-navy-950/15" />

            {hasDiscount && (
              <DiscountOfferTag
                percentage={product.discount_percentage!}
                className="w-10 pt-1.5 pb-3.5 sm:w-[46px] sm:pt-2.5 sm:pb-4 [&_span:first-child]:text-xs sm:[&_span:first-child]:text-sm"
              />
            )}

            {product.tag && (
              <div className="absolute left-2.5 top-2.5 z-10 sm:left-4 sm:top-4">
                <ProductTagBadge tag={product.tag} variant="overlay" />
              </div>
            )}

            <div
              className="pointer-events-none absolute left-2.5 top-2.5 h-6 w-6 border-l-2 border-t-2 border-gold-400/70 sm:left-4 sm:top-4 sm:h-8 sm:w-8"
              aria-hidden="true"
            />
            {!hasDiscount && (
              <div
                className="pointer-events-none absolute right-2.5 top-2.5 h-6 w-6 border-r-2 border-t-2 border-gold-400/70 sm:right-4 sm:top-4 sm:h-8 sm:w-8"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-3 sm:space-y-5">
          {/* Header */}
          <div>
            {product.category && (
              <Link
                to={`/products?category=${product.category.id}`}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-festive-500 transition-colors hover:text-festive-400 sm:text-[11px] sm:tracking-[0.16em]"
              >
                <Sparkles className="h-3 w-3" />
                {product.category.name}
              </Link>
            )}
            <ProductBrandBadge brand={product.brand} variant="light" className="mt-1.5" />
            <ProductTagBadge tag={product.tag} variant="light" className="mt-1.5" />

            <div className="mt-1 flex items-start justify-between gap-3 sm:mt-2 sm:gap-4">
              <h1 className="font-product-name text-2xl font-bold leading-tight text-navy-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              <WishlistButton
                product={product}
                className="shrink-0 rounded-full border border-navy-900/10 bg-white shadow-sm hover:border-red-400/40 hover:bg-red-50"
              />
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
              {product.is_available ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 sm:px-3 sm:py-1 sm:text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Available
                </span>
              ) : (
                <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 sm:px-3 sm:py-1 sm:text-[11px]">
                  Out of Stock
                </span>
              )}
              {inCart && (
                <span className="rounded-full border border-gold-500/30 bg-gold-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 sm:px-3 sm:py-1 sm:text-[11px]">
                  In Cart · {cartQty}
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-festive-500/30 sm:px-3 sm:py-1 sm:text-[11px]">
                  {product.discount_percentage}% Off
                </span>
              )}
            </div>
          </div>

          {/* Price + description */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-navy-950 via-navy-900 to-[#241610] p-4 shadow-[0_12px_32px_rgba(12,8,6,0.24)] ring-1 ring-gold-500/20 sm:rounded-2xl sm:p-5 lg:p-6">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold-400/70 sm:text-[10px] sm:tracking-[0.18em]">
                  Your Price
                </p>
                {price ? (
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 sm:mt-1 sm:gap-x-3">
                    {originalPrice && (
                      <span className="text-sm text-cream-100/45 line-through sm:text-lg">
                        {originalPrice}
                      </span>
                    )}
                    <span className="font-display text-2xl font-bold tabular-nums text-gold-300 sm:text-3xl lg:text-4xl">
                      {price}
                    </span>
                  </div>
                ) : (
                  <span className="mt-0.5 block text-lg font-semibold text-gold-400 sm:mt-1 sm:text-xl">
                    Enquire for price
                  </span>
                )}
                {savings && (
                  <p className="mt-1 text-xs font-medium text-emerald-300/90 sm:mt-2 sm:text-sm">
                    You save {savings}
                  </p>
                )}
              </div>
              <ProductPiecesBadge pieces={product.pieces} variant="ember" suffix="/ pack" />
            </div>

            {product.description && (
              <div className="relative mt-3 border-t border-gold-500/15 pt-3 sm:mt-4 sm:pt-4">
                <p className="text-[13px] leading-relaxed text-cream-100/75 sm:text-[15px]">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Specifications */}
          {specs.length > 0 && (
            <div className="rounded-xl border border-navy-800/8 bg-white/80 p-3.5 shadow-sm sm:rounded-2xl sm:p-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy-700/55 sm:text-[11px] sm:tracking-[0.16em]">
                Specifications
              </h2>
              <dl className="mt-2.5 grid gap-2 sm:mt-3 sm:grid-cols-2 sm:gap-2.5">
                {specs.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-cream-200/80 bg-gradient-to-br from-cream-50 to-white px-3 py-2 sm:rounded-xl sm:px-4 sm:py-3"
                  >
                    <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-navy-700/50 sm:text-[10px] sm:tracking-[0.12em]">
                      {key}
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold text-navy-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Add to cart */}
          {product.is_available && (
            <div className="rounded-xl border border-gold-500/20 bg-gradient-to-br from-cream-50 via-white to-cream-100/80 p-3.5 shadow-[0_8px_28px_rgba(46,30,22,0.06)] sm:rounded-2xl sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-base font-bold text-navy-900 sm:text-lg">Add to Cart</h2>
                {inCart && (
                  <span className="text-[11px] font-semibold text-gold-600 sm:text-xs">In cart</span>
                )}
              </div>

              <div className="mt-2.5 grid grid-cols-[7.5rem_1fr] items-stretch gap-2 sm:mt-3 sm:flex sm:items-end sm:gap-3">
                <div className="sm:w-36">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.1em] text-navy-700/60 sm:mb-1.5 sm:text-[11px]">
                    Qty
                  </label>
                  <QuantitySelector
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={0}
                    compact
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    'btn-festive inline-flex items-center justify-center gap-1.5 self-end rounded-xl px-4 py-2.5 text-sm font-bold sm:flex-1 sm:gap-2 sm:px-6 sm:py-3 sm:text-base',
                    inCart && 'from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400',
                  )}
                >
                  {inCart ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />}
                  <span className="sm:hidden">{inCart ? 'Update' : 'Add'}</span>
                  <span className="hidden sm:inline">{inCart ? 'Update Cart' : 'Add to Cart'}</span>
                </button>
              </div>

              <p className="mt-2.5 hidden items-start gap-2 text-xs leading-relaxed text-navy-700/55 sm:mt-3 sm:flex">
                <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-festive-500/70" />
                Items appear in the cart button at the bottom-left. Send your enquiry on WhatsApp when
                ready.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

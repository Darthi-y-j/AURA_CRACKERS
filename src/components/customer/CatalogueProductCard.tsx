import { memo } from 'react'
import { ProductLink } from './ProductLink'
import { Eye, ShoppingCart, Tag } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, truncate, cn } from '@/lib/utils'
import { useProductCartState } from '@/hooks/useProductCartState'
import { CartQuantityControl } from './CartQuantityControl'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import { DiscountOfferTag } from './DiscountOfferTag'
import { WishlistButton } from './WishlistButton'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'
import { ProductHighlightBadges } from './ProductHighlightBadges'
import { ProductCodeLabel } from './ProductCodeLabel'
import {
  CARD_TITLE_BASE_CLASS,
  UNIFIED_CARD_BODY,
  UNIFIED_CARD_SHELL,
  getCatalogueCardCategoryClass,
  getCatalogueCardDescriptionClass,
  getCatalogueCardTitleClass,
  getCatalogueCardViewButtonClass,
  getCardAddToCartButtonClass,
  getDiscountOfferTagVariant,
  UNIFIED_CARD_PRICE_PANEL,
} from '@/lib/productCardThemes'
import { isCardVisibleProductTag } from '@/lib/productTags'

interface CatalogueProductCardProps {
  product: Product
  index?: number
}

export const CatalogueProductCard = memo(function CatalogueProductCard({ product }: CatalogueProductCardProps) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const showCategory = product.category && !isCardVisibleProductTag(product.tag)

  return (
    <article
      className={cn(
        'product-grid-item group relative flex h-full flex-col overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300 sm:rounded-2xl sm:hover:-translate-y-0.5 sm:hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]',
        UNIFIED_CARD_SHELL,
      )}
    >
      <ProductLink product={product} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.card)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          {hasDiscount && (
            <DiscountOfferTag
              percentage={product.discount_percentage!}
              variant={getDiscountOfferTagVariant(product.tag)}
              className="z-20 w-8 pt-1.5 pb-2.5 sm:w-[42px] sm:pt-2 sm:pb-3.5 [&_span:first-child]:text-[10px] sm:[&_span:first-child]:text-[13px]"
            />
          )}

          <div className="absolute left-2 top-2 z-20 flex max-w-[70%] flex-col items-start gap-1.5 sm:left-2.5 sm:top-2.5">
            <ProductHighlightBadges product={product} />
            {product.tag && <ProductTagBadge tag={product.tag} variant="overlay" compact />}
          </div>

          <div className="absolute right-2 top-12 z-20 sm:right-2.5 sm:top-14">
            <WishlistButton
              product={product}
              className="rounded-full bg-white/95 p-1 shadow-md hover:bg-white"
              size="sm"
            />
          </div>

          {product.brand && (
            <div className="absolute inset-x-2 bottom-2 z-10 sm:inset-x-3 sm:bottom-3">
              <ProductBrandBadge
                brand={product.brand}
                variant="light"
                className="!normal-case !border-navy-900/10 !bg-white/95 !text-navy-900 !shadow-sm"
              />
            </div>
          )}
        </div>
        <div className="h-px bg-navy-900/[0.06]" aria-hidden="true" />
      </ProductLink>

      <div className={cn('flex flex-1 flex-col px-2 pb-2 pt-1.5 sm:px-3 sm:pb-2.5 sm:pt-2', UNIFIED_CARD_BODY)}>
        <ProductLink product={product} className="block">
          <ProductCodeLabel product={product} variant="cardLight" className="mb-0.5 text-[8px] sm:text-[9px]" />
          <h3
            className={cn(
              CARD_TITLE_BASE_CLASS,
              'text-[13px] sm:text-[15px]',
              getCatalogueCardTitleClass(),
            )}
          >
            {product.name}
          </h3>
        </ProductLink>

        {showCategory && (
          <span
            className={cn(
              'mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
              getCatalogueCardCategoryClass(),
            )}
          >
            {product.category!.name}
          </span>
        )}

        {product.description && (
          <p
            className={cn(
              'mt-1 line-clamp-2 text-[11px] leading-snug sm:text-xs',
              getCatalogueCardDescriptionClass(),
            )}
          >
            {truncate(product.description, 90)}
          </p>
        )}

        <div
          className={cn(
            'mt-1.5 flex flex-col gap-1 rounded-md px-1.5 py-1 sm:mt-2 sm:px-2 sm:py-1.5',
            UNIFIED_CARD_PRICE_PANEL,
          )}
        >
          <div className="flex min-w-0 flex-wrap items-baseline gap-1">
            {price ? (
              <>
                {originalPrice && (
                  <span className="text-[9px] leading-none text-navy-700/45 line-through sm:text-[11px]">
                    {originalPrice}
                  </span>
                )}
                <span className="text-xs font-bold leading-none text-festive-600 sm:text-base">{price}</span>
                {hasDiscount && (
                  <span
                    className="inline-flex items-center gap-0.5 rounded-full border border-pink-200/90 bg-white px-1 py-px text-[7px] font-bold uppercase text-pink-600 sm:text-[8px]"
                  >
                    <Tag className="h-2 w-2 shrink-0" aria-hidden />
                    {product.discount_percentage}% off
                  </span>
                )}
              </>
            ) : (
              <span className="text-[10px] font-semibold text-festive-600 sm:text-xs">Enquire</span>
            )}
          </div>
          <ProductPiecesBadge
            pieces={product.pieces}
            packaging={product.packaging}
            variant="light"
            className="w-fit shrink-0 !border-navy-900/10 !bg-white/90 !px-1 !py-px !text-navy-800 text-[7px] sm:text-[8px] [&_svg]:!text-festive-500"
          />
        </div>

        {product.is_available ? (
          <div className="mt-auto pt-1.5 sm:pt-2">
            <div className="sm:hidden">
              {inCart ? (
                <CartQuantityControl
                  value={quantity}
                  onChange={handleQuantityChange}
                  variant="ember"
                  min={0}
                  className="w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-bold transition-all active:scale-[0.98]',
                    getCardAddToCartButtonClass(product.tag),
                  )}
                >
                  <ShoppingCart className="h-3 w-3" />
                  Add to Cart
                </button>
              )}
            </div>

            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-1.5">
                <ProductLink
                  product={product}
                  className={cn(
                    'inline-flex items-center justify-center gap-1 rounded-md border bg-white py-1.5 text-[10px] font-semibold transition-all sm:py-2 sm:text-[11px]',
                    getCatalogueCardViewButtonClass(),
                  )}
                >
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  View Details
                </ProductLink>
                {inCart ? (
                  <CartQuantityControl
                    value={quantity}
                    onChange={handleQuantityChange}
                    variant="ember"
                    min={0}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={cn(
                      'inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-bold transition-all hover:brightness-110 active:scale-[0.98] sm:py-2 sm:text-[11px]',
                      getCardAddToCartButtonClass(product.tag),
                    )}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Add to Cart
                  </button>
                )}
              </div>
              {inCart && (
                <p className="mt-1 flex items-center justify-center gap-1 text-center text-[9px] font-medium tracking-wide text-festive-600">
                  <ShoppingCart className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>Added to cart</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <ProductLink
            product={product}
            className={cn(
              'mt-auto inline-flex w-full items-center justify-center gap-1 rounded-md border bg-white py-1.5 text-[10px] font-semibold sm:mt-2 sm:py-2 sm:text-[11px]',
              getCatalogueCardViewButtonClass(),
            )}
          >
            View Details
          </ProductLink>
        )}
      </div>
    </article>
  )
})

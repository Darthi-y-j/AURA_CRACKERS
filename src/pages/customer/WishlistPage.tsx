import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { EmptyState } from '@/components/customer/EmptyState'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { formatPrice, getImageUrl } from '@/lib/utils'

export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { setCartItem } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = (item: (typeof items)[0]) => {
    setCartItem({
      productId: item.productId,
      productName: item.productName,
      slug: item.slug,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    })
    showToast(`Added ${item.productName} to cart`, 'success')
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Liked Products" description="Your saved favourite fireworks and crackers." />
        <EmptyState
          title="No liked products yet"
          description="Tap the heart on any product to save it here for later."
          action={
            <Link
              to="/products"
              className="btn-hover-lift rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
            >
              Browse Products
            </Link>
          }
        />
      </>
    )
  }

  return (
    <>
      <SEO title="Liked Products" description="Your saved favourite fireworks and crackers." />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1">
              <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-500">
                Liked
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Liked Products
            </h1>
            <p className="mt-1 text-sm text-navy-700/60">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs font-semibold text-navy-700/50 transition hover:text-red-500"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-navy-900/8 bg-white p-3 shadow-sm sm:p-4"
            >
              <Link to={`/products/${item.slug}`} className="shrink-0">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.productName}
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-navy-900/8 sm:h-20 sm:w-20"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/products/${item.slug}`}
                  className="line-clamp-2 font-semibold text-navy-900 hover:text-festive-600"
                >
                  {item.productName}
                </Link>
                {item.price != null && (
                  <p className="mt-1 text-sm font-bold text-gold-600">{formatPrice(item.price)}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-festive-500 to-orange-600 text-white shadow-sm hover:brightness-110"
                  aria-label={`Add ${item.productName} to cart`}
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-700/45 hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${item.productName} from liked`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}

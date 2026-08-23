import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gift, Plus, Minus, Trash2, Search, ArrowRight, ShoppingBag } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { CatalogueHero, CatalogueOverlap } from '@/components/customer/CatalogueHero'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { getProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { resolveProductPrice } from '@/lib/pricing'
import { createGiftBoxCartItem, giftBoxItemCount, giftBoxLineTotal } from '@/lib/giftBox'
import { formatPrice, getImageUrl } from '@/lib/utils'
import type { Category, GiftBoxContentItem, Product } from '@/types/database'

const DRAFT_KEY = 'aura-gift-box-draft'

function loadDraft(): GiftBoxContentItem[] {
  try {
    const stored = localStorage.getItem(DRAFT_KEY)
    return stored ? (JSON.parse(stored) as GiftBoxContentItem[]) : []
  } catch {
    return []
  }
}

function saveDraft(items: GiftBoxContentItem[]) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(items))
}

export function GiftBoxPage() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [boxItems, setBoxItems] = useState<GiftBoxContentItem[]>(loadDraft)

  useEffect(() => {
    let cancelled = false
    Promise.all([getCategories(), getProducts({ sortBy: 'sort_order' })])
      .then(([cats, prods]) => {
        if (cancelled) return
        setCategories(cats)
        setProducts(prods)
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([])
          setProducts([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    saveDraft(boxItems)
  }, [boxItems])

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((product) => {
      if (!product.is_available) return false
      if (categoryId && product.category_id !== categoryId) return false
      if (!q) return true
      return (
        product.name.toLowerCase().includes(q) ||
        (product.brand?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [products, categoryId, search])

  const boxCount = giftBoxItemCount(boxItems)
  const boxTotal = giftBoxLineTotal(boxItems)

  const addToBox = (product: Product) => {
    const price = resolveProductPrice(product)
    setBoxItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price,
          imageUrl: product.image_url,
        },
      ]
    })
    showToast(`Added ${product.name} to gift box`, 'success')
  }

  const updateBoxQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      setBoxItems((prev) => prev.filter((item) => item.productId !== productId))
      return
    }
    setBoxItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  const addBoxToCart = () => {
    if (boxItems.length === 0) {
      showToast('Add at least one product to the gift box.', 'error')
      return
    }
    addItem(createGiftBoxCartItem(boxItems), 1)
    setBoxItems([])
    saveDraft([])
    showToast('Gift box added to cart', 'success')
    navigate('/cart')
  }

  return (
    <>
      <SEO
        title="Build a Gift Box"
        description="Create a custom fireworks gift box. Choose your products, review the box, and send an enquiry on WhatsApp."
      />

      <CatalogueHero withWave>
        <div className="max-w-2xl pb-8 sm:pb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/50 px-4 py-1">
            <Gift className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              Custom Gift Box
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            <span className="text-white">Build Your </span>
            <span className="text-gold-400">Gift Box</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Pick the fireworks you want, pack them into a gift box, and add it to your enquiry cart.
          </p>
        </div>
      </CatalogueHero>

      <CatalogueOverlap>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading products..." />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products available"
              description="Add products in admin to start building gift boxes."
              action={
                <Link to="/products" className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950">
                  Browse Products
                </Link>
              }
            />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
              <div className="order-2 min-w-0 lg:order-1">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products to add..."
                      className="w-full rounded-xl border border-navy-900/10 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
                    />
                  </div>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="rounded-xl border border-navy-900/10 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="divide-y divide-navy-900/8 overflow-hidden rounded-2xl border border-navy-900/8 bg-white">
                  {filteredProducts.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-navy-700/60">No matching products.</p>
                  ) : (
                    filteredProducts.map((product) => {
                      const price = resolveProductPrice(product)
                      const inBox = boxItems.find((item) => item.productId === product.id)
                      return (
                        <div key={product.id} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
                          <img
                            src={getImageUrl(product.image_url)}
                            alt=""
                            className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-navy-900">{product.name}</p>
                            <p className="text-xs text-navy-700/55">
                              {product.category?.name || 'Uncategorized'}
                              {product.brand?.trim() ? ` · ${product.brand.trim()}` : ''}
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-festive-600">
                              {formatPrice(price) || 'Enquire'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToBox(product)}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-3 py-2 text-xs font-bold text-navy-950 sm:px-4"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            {inBox ? `Add (${inBox.quantity})` : 'Add'}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
                <div className="overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-[0_8px_32px_rgba(12,8,6,0.08)]">
                  <div className="flex items-center gap-3 border-b border-navy-900/8 bg-navy-950 px-4 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 ring-1 ring-gold-400/30">
                      <Gift className="h-5 w-5 text-gold-400" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-cream-50">Your Gift Box</h2>
                      <p className="text-xs text-cream-100/60">
                        {boxCount} item{boxCount === 1 ? '' : 's'} selected
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[28rem] overflow-y-auto p-4">
                    {boxItems.length === 0 ? (
                      <p className="py-8 text-center text-sm text-navy-700/55">
                        Add products from the list to pack your gift box.
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        {boxItems.map((item) => (
                          <li key={item.productId} className="flex gap-3 rounded-xl bg-cream-50 p-2.5">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt=""
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-navy-900">{item.productName}</p>
                              <p className="text-xs text-navy-700/55">
                                {formatPrice(item.price) || 'Enquire'}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateBoxQuantity(item.productId, item.quantity - 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-md border border-navy-900/10 bg-white"
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-5 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateBoxQuantity(item.productId, item.quantity + 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded-md border border-navy-900/10 bg-white"
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateBoxQuantity(item.productId, 0)}
                                  className="ml-auto text-navy-700/40 hover:text-red-500"
                                  aria-label={`Remove ${item.productName}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="border-t border-navy-900/8 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-navy-700/70">Estimated box total</span>
                      <span className="font-display text-lg font-bold text-navy-900">
                        {formatPrice(boxTotal) || 'Enquire'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={addBoxToCart}
                      disabled={boxItems.length === 0}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-festive-500 to-gold-500 py-3 text-sm font-bold text-navy-950 disabled:opacity-50"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add gift box to cart
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    {boxItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setBoxItems([])}
                        className="mt-2 w-full text-center text-xs font-medium text-navy-700/50 hover:text-red-600"
                      >
                        Clear box
                      </button>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </CatalogueOverlap>
    </>
  )
}

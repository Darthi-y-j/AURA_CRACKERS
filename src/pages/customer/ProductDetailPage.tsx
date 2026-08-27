import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { SEO } from '@/components/shared/SEO'
import { ProductDetails } from '@/components/customer/ProductDetails'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { getProductBySlug, getProductsByCategory } from '@/services/products'
import { readProductLinkState, preloadProductImage } from '@/lib/productLink'
import type { Product } from '@/types/database'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const previewProduct = readProductLinkState(location.state)
  const hasPreview = previewProduct?.slug === slug

  const [product, setProduct] = useState<Product | null>(hasPreview ? previewProduct : null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(!hasPreview)

  useEffect(() => {
    if (hasPreview && previewProduct) {
      preloadProductImage(previewProduct.image_url)
    }
  }, [hasPreview, previewProduct])

  useEffect(() => {
    async function load() {
      if (!slug) return

      const cachedPreview = readProductLinkState(location.state)
      const canShowPreview = cachedPreview?.slug === slug
      if (!canShowPreview) {
        setProduct(null)
        setLoading(true)
      }

      try {
        const data = await getProductBySlug(slug)
        setProduct(data)

        if (data?.category_id) {
          getProductsByCategory(data.category_id)
            .then((relatedProducts) => {
              setRelated(relatedProducts.filter((p) => p.id !== data.id).slice(0, 4))
            })
            .catch(() => setRelated([]))
        } else {
          setRelated([])
        }
      } catch {
        if (!canShowPreview) setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug, location.state])

  if (loading && !product) {
    return <LoadingState fullPage message="Loading product..." />
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The product you're looking for doesn't exist or has been removed."
        action={
          <Link to="/products" className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950">
            Browse Products
          </Link>
        }
      />
    )
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description || `${product.name} - Premium fireworks from Aura Crackers`}
        image={product.image_url || undefined}
        url={`/products/${slug}`}
        type="product"
      />

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-2xl border border-navy-800/6 bg-cream-50/50 p-3 shadow-[0_8px_40px_rgba(46,30,22,0.06)] sm:rounded-3xl sm:p-6 lg:p-8">
          <ProductDetails product={product} />
        </div>

        {related.length > 0 && (
          <section className="mt-14 sm:mt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-festive-500">
                  You may also like
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                  Related Products
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <ProductGrid products={related} columns={4} />
            </div>
          </section>
        )}
      </div>
    </>
  )
}

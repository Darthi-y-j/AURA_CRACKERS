import { useEffect, useState } from 'react'
import { SEO } from '@/components/shared/SEO'
import { Hero } from '@/components/customer/Hero'
import { ShopByCategorySection } from '@/components/customer/ShopByCategorySection'
import { FeaturedProductsShowcase } from '@/components/customer/FeaturedProductsShowcase'
import { TaggedProductsSection } from '@/components/customer/TaggedProductsSection'
import { ContactSection } from '@/components/customer/ContactSection'
import { DosAndDontsSection } from '@/components/customer/DosAndDontsSection'
import { InstagramFeedSection } from '@/components/customer/InstagramFeedSection'
import { TrustHighlightsBar } from '@/components/customer/TrustHighlightsBar'
import { LoadingState } from '@/components/customer/LoadingState'
import { HowItWorksSection } from '@/components/customer/HowItWorksSection'
import { WhyChooseUsSection } from '@/components/customer/WhyChooseUsSection'
import { BrandMarquee } from '@/components/customer/BrandMarquee'
import { GiftBoxPromoSection } from '@/components/customer/GiftBoxPromoSection'
import { LazySection } from '@/components/customer/LazySection'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import { getProducts, getCachedCatalogueProducts } from '@/services/products'
import { PRODUCT_TAGS } from '@/lib/productTags'
import { useSettings } from '@/contexts/SettingsContext'
import type { Category, Product } from '@/types/database'

const TAGGED_SECTION_LIMIT = 6

function buildTaggedSections(products: Product[]) {
  return PRODUCT_TAGS.map((tag) => ({
    tag,
    products: products
      .filter((product) => product.tag === tag)
      .slice(0, TAGGED_SECTION_LIMIT),
  })).filter((section) => section.products.length > 0)
}

export function HomePage() {
  const { settings } = useSettings()
  const cachedProducts = getCachedCatalogueProducts()
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories()?.slice(0, 6) ?? [])
  const [featured, setFeatured] = useState<Product[]>(
    () => cachedProducts?.filter((product) => product.is_featured).slice(0, 8) ?? [],
  )
  const [taggedSections, setTaggedSections] = useState<{ tag: string; products: Product[] }[]>(
    () => (cachedProducts?.length ? buildTaggedSections(cachedProducts) : []),
  )
  const [loading, setLoading] = useState(() => !cachedProducts?.length)

  useEffect(() => {
    let cancelled = false

    void getCategories()
      .then((items) => {
        if (!cancelled) setCategories(items.slice(0, 6))
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueCategories()?.length) setCategories([])
      })

    void getProducts({ sortBy: 'sort_order', lite: true })
      .then((products) => {
        if (cancelled) return
        setFeatured(products.filter((product) => product.is_featured).slice(0, 8))
        setTaggedSections(buildTaggedSections(products))
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueProducts()?.length) {
          setFeatured([])
          setTaggedSections([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const hasProductContent = featured.length > 0 || taggedSections.length > 0

  return (
    <div className="min-w-0 overflow-x-clip">
      <SEO
        title={settings.business_name}
        description={
          settings.tagline ||
          'Premium fireworks and crackers catalogue from Sivakasi. Browse products by category and send enquiries on WhatsApp — delivery across India.'
        }
        url="/"
      />

      <Hero categories={categories} />

      <LazySection minHeight="120px">
        <BrandMarquee />
      </LazySection>

      {categories.length > 0 && <ShopByCategorySection categories={categories} />}

      {loading && !hasProductContent ? (
        <div className="bg-white py-10">
          <LoadingState message="Loading products..." />
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <LazySection minHeight="320px">
              <FeaturedProductsShowcase products={featured} />
            </LazySection>
          )}

          {taggedSections.map((section) => (
            <LazySection key={section.tag} minHeight="280px">
              <TaggedProductsSection
                tag={section.tag}
                products={section.products}
                initialVisible={4}
                batchSize={6}
              />
            </LazySection>
          ))}
        </>
      )}

      <LazySection minHeight="200px">
        <GiftBoxPromoSection />
      </LazySection>

      <LazySection minHeight="240px">
        <WhyChooseUsSection />
      </LazySection>

      <LazySection minHeight="200px">
        <HowItWorksSection />
      </LazySection>

      <LazySection minHeight="200px">
        <DosAndDontsSection />
      </LazySection>

      <LazySection minHeight="180px">
        <InstagramFeedSection />
      </LazySection>

      <LazySection minHeight="80px">
        <TrustHighlightsBar />
      </LazySection>

      <LazySection minHeight="200px">
        <ContactSection />
      </LazySection>
    </div>
  )
}

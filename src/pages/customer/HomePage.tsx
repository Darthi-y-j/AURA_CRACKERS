import { useEffect, useState } from 'react'
import { SEO } from '@/components/shared/SEO'
import { JsonLd } from '@/components/shared/JsonLd'
import { Hero } from '@/components/customer/Hero'
import { ShopByCategorySection } from '@/components/customer/ShopByCategorySection'
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
import { pickHeroSelectionProducts } from '@/lib/heroSelection'
import { useSettings } from '@/contexts/SettingsContext'
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from '@/lib/siteConfig'
import { buildHomePageSchema } from '@/lib/structuredData'
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
  const [heroSelection, setHeroSelection] = useState<Product[]>(() =>
    cachedProducts ? pickHeroSelectionProducts(cachedProducts, 8) : [],
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
        setHeroSelection(pickHeroSelectionProducts(products, 8))
        setTaggedSections(buildTaggedSections(products))
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueProducts()?.length) {
          setHeroSelection([])
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

  const hasProductContent = heroSelection.length > 0 || taggedSections.length > 0

  return (
    <div className="min-w-0 overflow-x-clip">
      <SEO
        title={HOME_PAGE_TITLE}
        description={HOME_PAGE_DESCRIPTION}
        url="/"
        titleIsFull
      />
      <JsonLd data={buildHomePageSchema(settings)} />

      <Hero heroSelectionProducts={heroSelection} />

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

import { useEffect, useState } from 'react'
import { SEO } from '@/components/shared/SEO'
import { Hero } from '@/components/customer/Hero'
import { ShopByCategorySection } from '@/components/customer/ShopByCategorySection'
import { FeaturedProductsShowcase } from '@/components/customer/FeaturedProductsShowcase'
import { TaggedProductsSection } from '@/components/customer/TaggedProductsSection'
import { ContactSection } from '@/components/customer/ContactSection'
import { DosAndDontsSection } from '@/components/customer/DosAndDontsSection'
import { LoadingState } from '@/components/customer/LoadingState'
import { HowItWorksSection } from '@/components/customer/HowItWorksSection'
import { WhyChooseUsSection } from '@/components/customer/WhyChooseUsSection'
import { BrandMarquee } from '@/components/customer/BrandMarquee'
import { GiftBoxPromoSection } from '@/components/customer/GiftBoxPromoSection'
import { getCategories } from '@/services/categories'
import { getFeaturedProducts, getProducts } from '@/services/products'
import { PRODUCT_TAGS } from '@/lib/productTags'
import { useSettings } from '@/contexts/SettingsContext'
import type { Category, Product } from '@/types/database'

const TAGGED_SECTION_LIMIT = 8

export function HomePage() {
  const { settings } = useSettings()
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [taggedSections, setTaggedSections] = useState<{ tag: string; products: Product[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getCategories()
        .then((cats) => cats.slice(0, 6))
        .catch(() => [] as Category[]),
      getFeaturedProducts(8).catch(() => [] as Product[]),
      ...PRODUCT_TAGS.map((tag) =>
        getProducts({ tag, limit: TAGGED_SECTION_LIMIT, sortBy: 'sort_order' }).catch(
          () => [] as Product[],
        ),
      ),
    ]).then(([cats, featuredProducts, ...taggedProducts]) => {
      if (cancelled) return
      setCategories(cats)
      setFeatured(featuredProducts)
      setTaggedSections(
        PRODUCT_TAGS.map((tag, index) => ({
          tag,
          products: taggedProducts[index] ?? [],
        })).filter((section) => section.products.length > 0),
      )
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <SEO
        title={settings.business_name}
        description={settings.tagline || 'Premium fireworks and crackers catalogue. Browse products and send enquiries on WhatsApp.'}
      />

      <Hero categories={categories} />

      <BrandMarquee />

      {categories.length > 0 && <ShopByCategorySection categories={categories} />}

      {loading ? (
        <div className="bg-white py-10">
          <LoadingState message="Loading products..." />
        </div>
      ) : (
        <>
          {featured.length > 0 && <FeaturedProductsShowcase products={featured} />}

          {taggedSections.map((section) => (
            <TaggedProductsSection
              key={section.tag}
              tag={section.tag}
              products={section.products}
            />
          ))}
        </>
      )}

      <GiftBoxPromoSection />

      <WhyChooseUsSection />

      <HowItWorksSection />

      <DosAndDontsSection />

      <ContactSection />
    </>
  )
}

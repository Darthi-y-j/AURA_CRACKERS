import { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SEO } from '@/components/shared/SEO'
import { CatalogueHero, CatalogueOverlap } from '@/components/customer/CatalogueHero'
import { HeroSearchBar } from '@/components/customer/HeroSearchBar'
import { ShopByCategoryNav, FilterByPanel, MobileFilterDropdown } from '@/components/customer/ShopBySidebar'
import { CategoryIconStrip } from '@/components/customer/CategoryIconStrip'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { ProductTable } from '@/components/customer/ProductTable'
import { CategoryGroupedProducts, groupProductsByCategory } from '@/components/customer/CategoryGroupedProducts'
import { LoadingState } from '@/components/customer/LoadingState'
import {
  CatalogueToolbar,
  sortProducts,
  type CatalogueSort,
  type CatalogueView,
} from '@/components/customer/CatalogueToolbar'
import { getProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { scrollToCategorySectionReliable, scrollToElement } from '@/lib/scrollToCategory'
import type { Product, Category } from '@/types/database'

const MAX_PRICE = 5000

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<CatalogueView>('card')
  const [sort, setSort] = useState<CatalogueSort>('popular')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE])
  const [scrollCategoryId, setScrollCategoryId] = useState('')
  const [scrollRequest, setScrollRequest] = useState<{ categoryId: string; key: number } | null>(
    null,
  )

  const categoryId = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const tag = searchParams.get('tag') || ''
  const search = searchParams.get('q') || ''

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts({ sortBy: 'sort_order' }),
        ])
        setCategories(cats)
        setProducts(prods)
      } catch {
        setCategories([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const updateCategory = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set('category', value)
    else params.delete('category')
    setSearchParams(params)
  }

  const scrollToCatalogueTop = useCallback(() => {
    const anchor = document.getElementById('catalogue-products')
    if (anchor) scrollToElement(anchor)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const updateBrand = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set('brand', value)
    else params.delete('brand')
    setSearchParams(params)
  }

  const brands = useMemo(() => {
    const names = new Set<string>()
    for (const product of products) {
      const name = product.brand?.trim()
      if (name) names.add(name)
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [products])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1
    }
    return counts
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (categoryId) result = result.filter((p) => p.category_id === categoryId)
    if (brand) result = result.filter((p) => p.brand?.trim() === brand)
    if (tag) result = result.filter((p) => p.tag === tag)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false),
      )
    }
    const [, maxPrice] = priceRange
    if (maxPrice < MAX_PRICE) {
      result = result.filter((p) => p.price == null || p.price <= maxPrice)
    }
    return sortProducts(result, sort)
  }, [products, categoryId, brand, tag, search, priceRange, sort])

  const groupedProducts = useMemo(
    () => groupProductsByCategory(filteredProducts, categories),
    [filteredProducts, categories],
  )

  const handleCategoryNav = useCallback(
    (value: string) => {
      if (categoryId) {
        setScrollCategoryId('')
        setScrollRequest(null)
        updateCategory(value)
        return
      }

      if (!value) {
        setScrollCategoryId('')
        setScrollRequest(null)
        scrollToCatalogueTop()
        return
      }

      const hasSection = groupedProducts.some((group) => group.id === value)
      if (!hasSection) return

      setScrollCategoryId(value)
      setScrollRequest({ categoryId: value, key: Date.now() })
    },
    [categoryId, groupedProducts, scrollToCatalogueTop, searchParams, setSearchParams],
  )

  useLayoutEffect(() => {
    if (!scrollRequest) return

    const cleanup = scrollToCategorySectionReliable(scrollRequest.categoryId)
    const done = window.setTimeout(() => setScrollRequest(null), 750)

    return () => {
      cleanup()
      window.clearTimeout(done)
    }
  }, [scrollRequest])

  useEffect(() => {
    if (!categoryId) return
    setScrollCategoryId('')
    setScrollRequest(null)
  }, [categoryId])

  const showGrouped = !categoryId
  const navSelectedCategoryId = categoryId || scrollCategoryId

  const navProps = {
    categories,
    categoryCounts,
    totalCount: products.length,
    selectedCategoryId: navSelectedCategoryId,
    onCategoryChange: handleCategoryNav,
  }

  return (
    <>
      <SEO
        title="Products"
        description="Browse our complete catalogue of premium fireworks and crackers. Filter by category and send enquiries on WhatsApp."
      />

      <CatalogueHero withWave tall>
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex rounded-full border border-gold-500/50 px-4 py-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              {tag || 'Full Collection'}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.25rem]">
            {tag ? (
              <span className="text-gold-400">{tag}</span>
            ) : (
              <>
                <span className="text-white">All </span>
                <span className="text-gold-400">Products</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            {tag
              ? `Browse our ${tag.toLowerCase()} fireworks and crackers for every celebration.`
              : 'Browse our complete range of premium fireworks and crackers for every celebration.'}
          </p>
        </div>
        <div className="mt-8">
          <HeroSearchBar categories={categories} />
        </div>
      </CatalogueHero>

      <CatalogueOverlap>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-x-10 lg:grid-cols-[220px_1fr]">
            <aside className="scrollbar-hide hidden space-y-8 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto lg:overscroll-y-contain">
              <ShopByCategoryNav {...navProps} />
              <FilterByPanel
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                brands={brands}
                selectedBrand={brand}
                onBrandChange={updateBrand}
                maxPrice={MAX_PRICE}
              />
            </aside>

            <div className="min-w-0">
              <CatalogueToolbar
                itemCount={filteredProducts.length}
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={setView}
                filterSlot={
                  <MobileFilterDropdown
                    {...navProps}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    brands={brands}
                    selectedBrand={brand}
                    onBrandChange={updateBrand}
                    maxPrice={MAX_PRICE}
                    inline
                  />
                }
              />

              {!loading && categories.length > 0 && (
                <div className="mb-5 min-w-0 overflow-hidden">
                  <CategoryIconStrip
                    categories={categories}
                    selectedCategoryId={navSelectedCategoryId}
                    onCategoryChange={handleCategoryNav}
                  />
                </div>
              )}

              {loading ? (
                <LoadingState message="Loading products..." />
              ) : filteredProducts.length === 0 ? (
                <ProductGrid
                  products={[]}
                  emptyTitle="No products found"
                  emptyDescription="Try selecting a different category or adjusting your filters."
                />
              ) : showGrouped ? (
                <div id="catalogue-products" className="scroll-mt-32">
                  <CategoryGroupedProducts groups={groupedProducts} view={view} />
                </div>
              ) : view === 'table' ? (
                <ProductTable
                  products={filteredProducts}
                  emptyTitle="No products found"
                  emptyDescription="Try selecting a different category or adjusting your filters."
                />
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  columns={3}
                  variant="catalogue"
                  emptyTitle="No products found"
                  emptyDescription="Try selecting a different category or adjusting your filters."
                />
              )}
            </div>
          </div>
        </div>
      </CatalogueOverlap>
    </>
  )
}

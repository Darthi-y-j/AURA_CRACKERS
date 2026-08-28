import { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SEO } from '@/components/shared/SEO'
import { CatalogueHero, CatalogueOverlap } from '@/components/customer/CatalogueHero'
import { ShopByCategoryNav, FilterByPanel, MobileFilterDropdown } from '@/components/customer/ShopBySidebar'
import { CategoryIconStrip } from '@/components/customer/CategoryIconStrip'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { ProductTable } from '@/components/customer/ProductTable'
import { CategoryGroupedProducts, groupProductsByCategory } from '@/components/customer/CategoryGroupedProducts'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { SearchBar } from '@/components/customer/SearchBar'
import {
  CatalogueToolbar,
  sortProducts,
  type CatalogueSort,
} from '@/components/customer/CatalogueToolbar'
import { getProducts, getCachedCatalogueProducts } from '@/services/products'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import { scrollToCategorySectionReliable, scrollToElement } from '@/lib/scrollToCategory'
import { filterProductsByQuery } from '@/lib/productSearch'
import { useRestoreScrollAfterLoad } from '@/hooks/useRestoreScrollAfterLoad'
import { useProductViewMode } from '@/hooks/useProductViewMode'
import { cn } from '@/lib/utils'
import type { Product, Category } from '@/types/database'

const MAX_PRICE = 5000

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>(() => getCachedCatalogueProducts() ?? [])
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])
  const [loading, setLoading] = useState(() => !getCachedCatalogueProducts()?.length)
  const [view, setView] = useProductViewMode('table')
  const [sort, setSort] = useState<CatalogueSort>('popular')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE])
  const [scrollCategoryId, setScrollCategoryId] = useState('')
  const [scrollRequest, setScrollRequest] = useState<{ categoryId: string; key: number } | null>(
    null,
  )
  const [localSearch, setLocalSearch] = useState('')
  const [searchExpanded, setSearchExpanded] = useState(false)

  const categoryId = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const tag = searchParams.get('tag') || ''
  const search = searchParams.get('q') || ''

  useRestoreScrollAfterLoad(loading)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    let cancelled = false

    void getCategories()
      .then((cats) => {
        if (!cancelled) setCategories(cats)
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueCategories()?.length) setCategories([])
      })

    void getProducts({ sortBy: 'sort_order', lite: true })
      .then((prods) => {
        if (!cancelled) setProducts(prods)
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueProducts()?.length) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
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

  const applySearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    const trimmed = value.trim()
    if (trimmed) params.set('q', trimmed)
    else params.delete('q')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setLocalSearch('')
    setPriceRange([0, MAX_PRICE])
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters =
    Boolean(categoryId || brand || tag || localSearch.trim() || priceRange[1] < MAX_PRICE)

  const activeQuery = localSearch.trim().toLowerCase()

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
    const [, maxPrice] = priceRange
    if (maxPrice < MAX_PRICE) {
      result = result.filter((p) => p.price == null || p.price <= maxPrice)
    }
    if (activeQuery) {
      return filterProductsByQuery(result, activeQuery)
    }
    return sortProducts(result, sort)
  }, [products, categoryId, brand, tag, activeQuery, priceRange, sort])

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
        url="/products"
      />

      <CatalogueHero withWave>
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
              <div className="sticky top-14 z-40 mb-4 flex items-center gap-2 rounded-2xl border border-navy-900/8 bg-gradient-to-r from-cream-50 via-white to-cream-50/80 p-2 shadow-[0_4px_24px_rgba(12,8,6,0.06)] sm:gap-3 sm:p-2.5 sm:top-[4.25rem]">
                <SearchBar
                  value={localSearch}
                  onChange={setLocalSearch}
                  onSubmit={() => applySearch(localSearch)}
                  onFocus={() => setSearchExpanded(true)}
                  onBlur={() => setSearchExpanded(false)}
                  placeholder="Search crackers, sparklers..."
                  compact
                  className={cn(
                    'relative z-0 min-w-0 transition-[flex-grow,max-width] duration-300',
                    searchExpanded
                      ? 'max-sm:flex-[1_1_100%] max-sm:max-w-full'
                      : 'max-sm:max-w-[9.5rem] max-sm:flex-[0_1_9.5rem] sm:flex-1',
                  )}
                />

                <div
                  className={cn(
                    'relative z-10 shrink-0 transition-opacity duration-200',
                    searchExpanded && 'max-sm:pointer-events-none max-sm:invisible max-sm:w-0 max-sm:overflow-hidden max-sm:opacity-0',
                  )}
                >
                  <CatalogueToolbar
                    sort={sort}
                    onSortChange={setSort}
                    view={view}
                    onViewChange={setView}
                    inline
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
                </div>
              </div>

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
                <EmptyState
                  title={products.length === 0 ? 'Products unavailable' : 'No products found'}
                  description={
                    products.length === 0
                      ? 'We could not load the catalogue right now. Please refresh or try again shortly.'
                      : activeQuery
                        ? `No matches for "${localSearch.trim()}". Try another name, brand, or category.`
                        : 'Try selecting a different category or adjusting your filters.'
                  }
                  action={
                    products.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
                      >
                        Refresh page
                      </button>
                    ) : hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
                      >
                        Clear search & filters
                      </button>
                    ) : undefined
                  }
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

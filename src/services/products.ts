import { supabase, getSupabaseErrorMessage, isMissingColumnError } from '@/lib/supabase'
import { isLowStock } from '@/lib/stock'
import type { Product, ProductFilters } from '@/types/database'

const PRODUCT_CACHE_MS = 2 * 60 * 1000
const productCache = new Map<string, { data: Product[]; at: number }>()
const inflight = new Map<string, Promise<Product[]>>()

function getProductCacheKey(filters: ProductFilters): string {
  return JSON.stringify(filters)
}

async function withProductCache(
  filters: ProductFilters,
  fetcher: () => Promise<Product[]>,
): Promise<Product[]> {
  const key = getProductCacheKey(filters)
  const cached = productCache.get(key)
  if (cached && Date.now() - cached.at < PRODUCT_CACHE_MS) {
    return cached.data
  }

  const pending = inflight.get(key)
  if (pending) return pending

  const request = fetcher()
    .then((data) => {
      productCache.set(key, { data, at: Date.now() })
      inflight.delete(key)
      return data
    })
    .catch((error) => {
      inflight.delete(key)
      throw error
    })

  inflight.set(key, request)
  return request
}

function applyArchivedFilter<T extends { eq: (col: string, val: boolean) => T }>(
  query: T,
  archived: ProductFilters['archived'],
  withArchiveFilter: boolean,
) {
  if (!withArchiveFilter) return query
  if (archived === 'archived') return query.eq('is_archived', true)
  if (archived !== 'all') return query.eq('is_archived', false)
  return query
}

type SupabaseListQuery = PromiseLike<{ data: unknown; error: unknown }>

async function queryProductsWithArchiveFallback(
  archived: ProductFilters['archived'],
  buildQuery: (withArchiveFilter: boolean) => SupabaseListQuery,
): Promise<Product[]> {
  const { data, error } = await buildQuery(true)
  if (!error) return (data as Product[]) || []

  if (isMissingColumnError(error, 'is_archived')) {
    if (archived === 'archived') return []
    const { data: fallbackData, error: fallbackError } = await buildQuery(false)
    if (fallbackError) throw new Error(getSupabaseErrorMessage(fallbackError))
    return (fallbackData as Product[]) || []
  }

  throw new Error(getSupabaseErrorMessage(error))
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const archived = filters.archived ?? 'active'

  return withProductCache(filters, () =>
    queryProductsWithArchiveFallback(archived, (withArchiveFilter) => {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)

    query = applyArchivedFilter(query, archived, withArchiveFilter)

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters.featured) {
      query = query.eq('is_featured', true)
    }

    if (filters.tag) {
      query = query.eq('tag', filters.tag)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.availability === 'available') {
      query = query.eq('is_available', true)
    } else if (filters.availability === 'unavailable') {
      query = query.eq('is_available', false)
    }

    switch (filters.sortBy) {
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'price_asc':
        query = query.order('price', { ascending: true, nullsFirst: false })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false, nullsFirst: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default:
        query = query.order('sort_order', { ascending: true })
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    return query
  }),
  )
}

export async function getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const archived = filters.archived ?? 'active'

  return queryProductsWithArchiveFallback(archived, (withArchiveFilter) => {
    let query = supabase.from('products').select('*, category:categories(*)')

    query = applyArchivedFilter(query, archived, withArchiveFilter)

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters.tag) {
      query = query.eq('tag', filters.tag)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.availability === 'available') {
      query = query.eq('is_available', true)
    } else if (filters.availability === 'unavailable') {
      query = query.eq('is_available', false)
    }

    return query.order('sort_order', { ascending: true })
  })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const withArchive = async (useArchiveFilter: boolean) => {
    let query = supabase.from('products').select('*, category:categories(*)').eq('slug', slug)
    if (useArchiveFilter) query = query.eq('is_archived', false)
    return query.single()
  }

  const { data, error } = await withArchive(true)
  if (!error) return data as Product

  if (isMissingColumnError(error, 'is_archived')) {
    const { data: fallback, error: fallbackError } = await withArchive(false)
    if (fallbackError) return null
    return fallback as Product
  }

  return null
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Product
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return queryProductsWithArchiveFallback('active', (withArchiveFilter) => {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('is_available', true)

    if (withArchiveFilter) query = query.eq('is_archived', false)

    return query.order('sort_order', { ascending: true }).limit(limit)
  })
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  return queryProductsWithArchiveFallback('active', (withArchiveFilter) => {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('is_available', true)

    if (withArchiveFilter) query = query.eq('is_archived', false)

    return query.order('sort_order', { ascending: true })
  })
}

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'is_archived' | 'archived_at'> & {
    is_archived?: boolean
    archived_at?: string | null
  },
): Promise<{ data: Product | null; error: string | null }> {
  const { data, error } = await supabase.from('products').insert(product).select().single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Product, error: null }
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>>,
): Promise<{ data: Product | null; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Product, error: null }
}

export async function archiveProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await updateProduct(id, {
    is_archived: true,
    archived_at: new Date().toISOString(),
    is_available: false,
    is_featured: false,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Archive is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function restoreProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await updateProduct(id, {
    is_archived: false,
    archived_at: null,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Restore is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function updateProductsSortOrder(
  updates: { id: string; sort_order: number }[],
): Promise<{ error: string | null }> {
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('products').update({ sort_order }).eq('id', id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) return { error: getSupabaseErrorMessage(failed.error) }
  return { error: null }
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export async function getProductCount(): Promise<{ total: number; active: number }> {
  const countWithArchive = async (useArchiveFilter: boolean, availableOnly = false) => {
    let query = supabase.from('products').select('*', { count: 'exact', head: true })
    if (useArchiveFilter) query = query.eq('is_archived', false)
    if (availableOnly) query = query.eq('is_available', true)
    return query
  }

  let totalResult = await countWithArchive(true)
  if (totalResult.error && isMissingColumnError(totalResult.error, 'is_archived')) {
    totalResult = await countWithArchive(false)
  }

  let activeResult = await countWithArchive(true, true)
  if (activeResult.error && isMissingColumnError(activeResult.error, 'is_archived')) {
    activeResult = await countWithArchive(false, true)
  }

  return { total: totalResult.count || 0, active: activeResult.count || 0 }
}

export interface StockChangeResult {
  product: Product | null
  remaining: number | null
  hitLimit: boolean
  error: string | null
}

export async function getLowStockProducts(): Promise<Product[]> {
  try {
    const products = await getAllProducts({ archived: 'active' })
    return products.filter(isLowStock)
  } catch (err) {
    if (isMissingColumnError(err, 'stock_quantity') || isMissingColumnError(err, 'stock_alert_limit')) {
      return []
    }
    throw err
  }
}

export async function adjustProductStock(
  id: string,
  delta: number,
): Promise<StockChangeResult> {
  const product = await getProductById(id)
  if (!product) {
    return { product: null, remaining: null, hitLimit: false, error: 'Product not found' }
  }

  if (product.stock_quantity == null) {
    return { product, remaining: null, hitLimit: false, error: null }
  }

  const previous = product.stock_quantity
  const remaining = Math.max(0, previous + delta)
  const updates: Partial<Product> = { stock_quantity: remaining }
  if (remaining === 0) updates.is_available = false

  const { data, error } = await updateProduct(id, updates)
  if (error) {
    if (isMissingColumnError(error, 'stock_quantity')) {
      return {
        product,
        remaining: null,
        hitLimit: false,
        error: 'Stock tracking is not available yet. Run migration 017_product_stock.sql in Supabase.',
      }
    }
    return { product, remaining: previous, hitLimit: false, error }
  }

  const limit = data?.stock_alert_limit ?? product.stock_alert_limit
  const hitLimit =
    limit != null && previous > limit && remaining <= limit

  return { product: data, remaining, hitLimit, error: null }
}

export async function recordProductSale(id: string, quantity: number): Promise<StockChangeResult> {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { product: null, remaining: null, hitLimit: false, error: 'Enter a valid sold quantity (1 or higher).' }
  }

  const product = await getProductById(id)
  if (!product) {
    return { product: null, remaining: null, hitLimit: false, error: 'Product not found' }
  }
  if (product.stock_quantity == null) {
    return {
      product,
      remaining: null,
      hitLimit: false,
      error: 'Set available quantity for this product first.',
    }
  }

  return adjustProductStock(id, -Math.floor(quantity))
}

export async function applyEnquiryStockChange(
  items: { productId: string; quantity: number }[],
  direction: 'sold' | 'restore',
): Promise<StockChangeResult[]> {
  const results: StockChangeResult[] = []
  for (const item of items) {
    const delta = direction === 'sold' ? -item.quantity : item.quantity
    results.push(await adjustProductStock(item.productId, delta))
  }
  return results
}

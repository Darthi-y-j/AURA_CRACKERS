import { supabase, getSupabaseErrorMessage, isMissingColumnError } from '@/lib/supabase'
import type { Category } from '@/types/database'

export type CategoryArchiveFilter = 'active' | 'archived' | 'all'

export async function getCategories(
  activeOnly = true,
  archived: CategoryArchiveFilter = 'active',
): Promise<Category[]> {
  const buildQuery = (withArchiveFilter: boolean) => {
    let query = supabase.from('categories').select('*').order('sort_order', { ascending: true })

    if (activeOnly) {
      query = query.eq('is_active', true)
      if (withArchiveFilter) query = query.eq('is_archived', false)
    } else if (withArchiveFilter) {
      if (archived === 'archived') query = query.eq('is_archived', true)
      else if (archived !== 'all') query = query.eq('is_archived', false)
    }

    return query
  }

  const { data, error } = await buildQuery(true)
  if (!error) return (data as Category[]) || []

  if (isMissingColumnError(error, 'is_archived')) {
    if (archived === 'archived') return []
    const { data: fallbackData, error: fallbackError } = await buildQuery(false)
    if (fallbackError) throw new Error(getSupabaseErrorMessage(fallbackError))
    return (fallbackData as Category[]) || []
  }

  throw new Error(getSupabaseErrorMessage(error))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const withArchive = async (useArchiveFilter: boolean) => {
    let query = supabase.from('categories').select('*').eq('slug', slug).eq('is_active', true)
    if (useArchiveFilter) query = query.eq('is_archived', false)
    return query.single()
  }

  const { data, error } = await withArchive(true)
  if (!error) return data as Category

  if (isMissingColumnError(error, 'is_archived')) {
    const { data: fallback, error: fallbackError } = await withArchive(false)
    if (fallbackError) return null
    return fallback as Category
  }

  return null
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

  if (error) return null
  return data as Category
}

export async function createCategory(
  category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'is_archived' | 'archived_at'> & {
    is_archived?: boolean
    archived_at?: string | null
  },
): Promise<{ data: Category | null; error: string | null }> {
  const { data, error } = await supabase.from('categories').insert(category).select().single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Category, error: null }
}

export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>,
): Promise<{ data: Category | null; error: string | null }> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Category, error: null }
}

export async function archiveCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await updateCategory(id, {
    is_archived: true,
    archived_at: new Date().toISOString(),
    is_active: false,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Archive is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function restoreCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await updateCategory(id, {
    is_archived: false,
    archived_at: null,
    is_active: true,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Restore is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function updateCategoriesSortOrder(
  updates: { id: string; sort_order: number }[],
): Promise<{ error: string | null }> {
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('categories').update({ sort_order }).eq('id', id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) return { error: getSupabaseErrorMessage(failed.error) }
  return { error: null }
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

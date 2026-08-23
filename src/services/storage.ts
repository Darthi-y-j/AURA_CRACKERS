import { supabase, getSupabaseErrorMessage } from '@/lib/supabase'

export type StorageBucket = 'product-images' | 'category-images' | 'logos'

export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  path?: string
): Promise<{ url: string | null; error: string | null }> {
  const fileExt = file.name.split('.').pop()
  const fileName = path || `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (uploadError) {
    return { url: null, error: getSupabaseErrorMessage(uploadError) }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { url: data.publicUrl, error: null }
}

export async function deleteImage(
  bucket: StorageBucket,
  path: string
): Promise<{ error: string | null }> {
  const fileName = path.split('/').pop()
  if (!fileName) return { error: 'Invalid file path' }

  const { error } = await supabase.storage.from(bucket).remove([fileName])
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export function getStoragePathFromUrl(url: string, bucket: StorageBucket): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}

import { useCallback, useEffect, useState } from 'react'
import {
  getImagePlaceholderUrl,
  getImageUrl,
  IMAGE_WIDTH,
  isSupabaseStorageUrl,
  cn,
} from '@/lib/utils'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  priority?: boolean
  width?: number
  fallback?: string
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  width = IMAGE_WIDTH.detail,
  fallback = '/placeholder-product.svg',
  fetchPriority,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)
  const usePlaceholder = isSupabaseStorageUrl(src)
  const imageSrc = getImageUrl(src, fallback, width, width)
  const placeholderSrc = usePlaceholder ? getImagePlaceholderUrl(src, fallback) : null
  const resolvedFetchPriority = fetchPriority ?? (priority ? 'high' : 'auto')

  useEffect(() => {
    setLoaded(false)
  }, [imageSrc])

  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        setLoaded(true)
      }
    },
    [imageSrc],
  )

  return (
    <span className={cn('relative block h-full w-full overflow-hidden bg-[#1a1412]', className)}>
      {placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          className={cn(
            'absolute inset-0 h-full w-full object-cover object-center scale-110 blur-lg brightness-95',
            loaded && 'opacity-0 transition-opacity duration-300',
          )}
        />
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={resolvedFetchPriority}
        onLoad={() => setLoaded(true)}
        className={cn(
          'relative z-[1] h-full w-full object-cover object-center',
          loaded || priority ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300',
        )}
      />
    </span>
  )
}

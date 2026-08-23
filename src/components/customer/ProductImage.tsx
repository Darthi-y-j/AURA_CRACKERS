import { useCallback, useState } from 'react'
import { getImageUrl, cn } from '@/lib/utils'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  priority?: boolean
}

export function ProductImage({ src, alt, className, priority = false }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)
  const imageSrc = getImageUrl(src)

  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        setLoaded(true)
      }
    },
    [imageSrc],
  )

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      className={cn(
        priority ? 'opacity-100' : loaded ? 'opacity-100' : 'opacity-0',
        !priority && 'transition-opacity duration-200',
        className,
      )}
    />
  )
}

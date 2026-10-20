import type { Product } from '@/types/database'
import { pickHeroSelectionProducts } from '@/lib/heroSelection'
import { PRODUCT_TAGS } from '@/lib/productTags'
import { getImageUrl, IMAGE_WIDTH } from '@/lib/utils'

const prefetched = new Set<string>()

function prefetchUrl(url: string | null | undefined, width: number) {
  const src = getImageUrl(url, '', width)
  if (!src || src === '/placeholder-product.svg' || prefetched.has(src)) return
  prefetched.add(src)
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

/** Warm the browser cache for above-the-fold catalogue images. */
export function prefetchCatalogueProductImages(products: Product[]) {
  if (!products.length || typeof window === 'undefined') return

  const run = () => {
    const urls: { url: string | null; width: number }[] = []

    for (const product of pickHeroSelectionProducts(products, 8)) {
      urls.push({ url: product.image_url, width: IMAGE_WIDTH.thumb })
    }

    for (const tag of PRODUCT_TAGS) {
      const tagged = products.filter((p) => p.tag === tag).slice(0, 4)
      for (const product of tagged) {
        urls.push({ url: product.image_url, width: IMAGE_WIDTH.card })
      }
    }

    for (const { url, width } of urls.slice(0, 36)) {
      prefetchUrl(url, width)
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 1200 })
  } else {
    setTimeout(run, 0)
  }
}

export function prefetchProductImage(url: string | null | undefined, width = IMAGE_WIDTH.card) {
  prefetchUrl(url, width)
}

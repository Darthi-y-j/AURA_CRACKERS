export interface InstagramFeedImage {
  /** Optimized WebP served to modern browsers */
  webp: string
  /** Fallback for older browsers */
  src: string
  alt: string
  width: number
  height: number
}

/** Small, square thumbnails — keep each file under ~80 KB for smooth scrolling */
export const INSTAGRAM_FEED_IMAGES: InstagramFeedImage[] = [
  {
    webp: '/about-celebration-sparkler-instagram.webp',
    src: '/about-celebration-sparkler.jpg',
    alt: 'Festive sparkler celebration',
    width: 640,
    height: 640,
  },
  {
    webp: '/premium-quality-instagram.webp',
    src: '/premium-quality-card.webp',
    alt: 'Premium quality fireworks',
    width: 640,
    height: 640,
  },
  {
    webp: '/wide-variety-instagram.webp',
    src: '/wide-variety-card.webp',
    alt: 'Wide variety of crackers',
    width: 640,
    height: 640,
  },
  {
    webp: '/special-colors-skyshot-instagram.webp',
    src: '/special-colors-skyshot-bg.png',
    alt: 'Colour skyshot display',
    width: 640,
    height: 480,
  },
  {
    webp: '/instagram-product-showcase.webp',
    src: '/instagram-product-showcase.png',
    alt: 'Aura Crackers product showcase',
    width: 640,
    height: 640,
  },
]

export function getInstagramHandle(instagramUrl?: string): string {
  if (!instagramUrl) return '@aura_crackers'
  const match = instagramUrl.match(/instagram\.com\/([^/?#]+)/i)
  if (match?.[1]) return `@${match[1]}`
  return instagramUrl.startsWith('@') ? instagramUrl : `@${instagramUrl}`
}

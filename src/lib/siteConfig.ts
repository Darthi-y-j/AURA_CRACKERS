/** Canonical production site URL — used for SEO meta tags and sitemap generation. */
export const SITE_URL = 'https://www.auracrackers.com'

export const SITE_NAME = 'Aura Crackers'

/** Freelance / agency credit shown in the site footer. */
export const DEVELOPER_CREDIT = {
  label: 'Website designed & developed by',
  name: 'IHTRAD TECHNOLOGIES',
  url: 'https://www.ihtrad.com',
} as const

export const DEFAULT_DESCRIPTION =
  'Premium fireworks and crackers catalogue from Sivakasi. Browse products by category and send enquiries on WhatsApp — delivery across India.'

/** Homepage document title — includes official brand positioning for search. */
export const HOME_PAGE_TITLE =
  'Aura Crackers — Official Website | Premium Fireworks & Crackers'

/** Homepage meta description — natural brand + product intent without keyword stuffing. */
export const HOME_PAGE_DESCRIPTION =
  'Official Aura Crackers website. Browse fireworks and crackers products with prices from Sivakasi. Send enquiries on WhatsApp — delivery across India.'

/** Bump when favicon assets change — busts aggressive browser favicon cache. */
export const FAVICON_VERSION = '4'

/** Brand logo for navbar (full PNG in /public). */
export const SITE_LOGO_FILE = '/IMG_6850.PNG'
export const SITE_LOGO_PATH = `${SITE_LOGO_FILE}?v=${FAVICON_VERSION}`

/** Brand wordmark PNG in /public — used in navbar, footer, admin, and PDF. */
export const SITE_WORDMARK_FILE = '/Wordmark - Transparent-03.png'
export const SITE_WORDMARK_PATH = SITE_WORDMARK_FILE

/** Circular primary logo for enquiry PDF header. */
export const PDF_LOGO_FILE = '/Primary_Logo_-_BG-01-removebg-preview (1).png'
export const PDF_LOGO_PATH = PDF_LOGO_FILE

/** Trimmed favicons generated from SITE_LOGO_FILE — use for browser tab / PWA. */
export const FAVICON_PATH = `/favicon.png?v=${FAVICON_VERSION}`
export const FAVICON_32_PATH = `/favicon-32x32.png?v=${FAVICON_VERSION}`
export const FAVICON_192_PATH = `/favicon-192x192.png?v=${FAVICON_VERSION}`
export const APPLE_TOUCH_ICON_PATH = `/apple-touch-icon.png?v=${FAVICON_VERSION}`
export const OG_IMAGE_PATH = '/og-image.png'
export const FAVICON_URL = `${SITE_URL}${FAVICON_PATH.split('?')[0]}`
export const DEFAULT_OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`

/** Public social profiles for Organization schema (sameAs). */
export const BRAND_SOCIAL_PROFILES = [
  'https://www.youtube.com/@AuraCrackers',
  'https://www.facebook.com/share/192L4T2prh/?mibextid=wwXIfr',
  'https://www.instagram.com/aura_crackers?igsi=MTA0aHFzM3VwOHRpOA%3D%3D&utm_source=qr',
] as const

/** Static public routes included in the sitemap (no auth/admin/user-only pages). */
export const SITEMAP_STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/categories', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/safety', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.5' },
  { path: '/gift-box', changefreq: 'monthly', priority: '0.7' },
] as const

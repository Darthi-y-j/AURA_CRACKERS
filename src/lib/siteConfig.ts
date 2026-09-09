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
export const FAVICON_VERSION = '5'

export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`

/** Brand logo for navbar (full PNG in /public). */
const SITE_LOGO_FILE = '/IMG_6850.PNG'
export const SITE_LOGO_PATH = `${SITE_LOGO_FILE}?v=${FAVICON_VERSION}`

/** Brand wordmark PNG in /public — used in navbar, footer, admin, and PDF. */
export const SITE_WORDMARK_FILE = '/Wordmark - Transparent-03.png'
export const SITE_WORDMARK_PATH = SITE_WORDMARK_FILE

/** Circular primary logo for enquiry PDF header. */
export const PDF_LOGO_PATH = '/Primary_Logo_-_BG-01-removebg-preview (1).png'

/** Trimmed favicons generated from SITE_LOGO_FILE — use for browser tab / PWA. */
export const FAVICON_ICO_PATH = `/favicon.ico?v=${FAVICON_VERSION}`
export const FAVICON_PATH = `/favicon.png?v=${FAVICON_VERSION}`
export const FAVICON_32_PATH = `/favicon-32x32.png?v=${FAVICON_VERSION}`
export const FAVICON_192_PATH = `/favicon-192x192.png?v=${FAVICON_VERSION}`
export const APPLE_TOUCH_ICON_PATH = `/apple-touch-icon.png?v=${FAVICON_VERSION}`
const OG_IMAGE_PATH = '/og-image.png'
export const DEFAULT_OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`

/** Public social profiles for Organization schema (sameAs). */
export const BRAND_SOCIAL_PROFILES = [
  'https://www.youtube.com/@AuraCrackers',
  'https://www.facebook.com/share/192L4T2prh/?mibextid=wwXIfr',
  'https://www.instagram.com/aura_crackers?igsi=MTA0aHFzM3VwOHRpOA%3D%3D&utm_source=qr',
] as const

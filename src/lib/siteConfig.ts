/** Canonical production site URL — used for SEO meta tags and sitemap generation. */
export const SITE_URL = 'https://www.auracrackers.com'

export const SITE_NAME = 'Aura Crackers'

/** Freelance / agency credit shown in the site footer. */
export const DEVELOPER_CREDIT = {
  label: 'Website designed & developed by',
  name: 'IHTRAD TECHNOLOGIES',
  /** Set when you have a company site, e.g. https://ihtradtechnologies.com */
  url: null as string | null,
} as const

export const DEFAULT_DESCRIPTION =
  'Premium fireworks and crackers catalogue from Sivakasi. Browse products by category and send enquiries on WhatsApp — delivery across India.'

/** Default Open Graph / social share image (served from /public). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-slide-2.png`

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

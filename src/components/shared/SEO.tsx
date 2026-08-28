import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { buildCanonicalUrl } from '@/lib/seo'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/siteConfig'

interface SEOProps {
  title: string
  description?: string
  image?: string
  /** Pathname (e.g. `/about`) or full URL. Defaults to current route pathname. */
  url?: string
  type?: string
  /** When true, adds noindex/nofollow — use for login, account, cart, etc. */
  noIndex?: boolean
}

function resolveCanonical(url: string | undefined, pathname: string): string {
  return buildCanonicalUrl(pathname, url)
}

function resolveOgImage(image: string | undefined): string {
  if (!image) return DEFAULT_OG_IMAGE
  if (image.startsWith('http')) return image
  return `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const { pathname } = useLocation()
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const canonical = resolveCanonical(url, pathname)
  const ogImage = resolveOgImage(image)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}

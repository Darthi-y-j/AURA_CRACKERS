import { Link2, MessageCircle, Share2 } from 'lucide-react'
import { BRAND_SOCIAL_PROFILES, SITE_NAME, SITE_URL } from '@/lib/siteConfig'

function shareUrl(platform: 'facebook' | 'whatsapp'): string {
  const page = typeof window !== 'undefined' ? window.location.href : SITE_URL
  const text = `${SITE_NAME} — premium fireworks and crackers catalogue`
  if (platform === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(page)}`
  }
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${page}`)}`
}

export function FooterSocialShare() {
  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4 sm:mt-5 sm:pt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Share</h4>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <a
          href={shareUrl('whatsapp')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-300"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          WhatsApp
        </a>
        <a
          href={shareUrl('facebook')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-300"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          Facebook
        </a>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:border-gold-400/40 hover:text-gold-300"
        >
          <Link2 className="h-3.5 w-3.5" aria-hidden />
          Copy link
        </button>
        {BRAND_SOCIAL_PROFILES.slice(0, 2).map((href) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/50 underline-offset-2 hover:text-gold-400 hover:underline"
          >
            {href.includes('instagram') ? 'Instagram' : 'Social'}
          </a>
        ))}
      </div>
    </div>
  )
}

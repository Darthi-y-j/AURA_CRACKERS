import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpen,
  Gift,
  Grid3X3,
  HelpCircle,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Video,
} from 'lucide-react'
import { BRAND_SOCIAL_PROFILES, SITE_NAME, SITE_URL } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'
import { AnimateIn } from './AnimateIn'

type LinkTile = {
  to: string
  label: string
  hint: string
  icon: LucideIcon
  layout: 'hero' | 'wide' | 'compact' | 'accent'
}

const quickLinks: LinkTile[] = [
  { to: '/products', label: 'All products', hint: 'Full fireworks catalogue', icon: Package, layout: 'wide' },
  {
    to: '/categories',
    label: 'Categories',
    hint: 'Sparklers, aerials, gift packs & more',
    icon: Grid3X3,
    layout: 'hero',
  },
  { to: '/gift-box', label: 'Gift box', hint: 'Build a custom pack', icon: Gift, layout: 'accent' },
  { to: '/cart', label: 'Your cart', hint: 'WhatsApp quote in one tap', icon: ShoppingCart, layout: 'accent' },
  { to: '/about', label: 'About us', hint: 'Our story', icon: Sparkles, layout: 'compact' },
  { to: '/safety', label: 'Safety guide', hint: 'Celebrate responsibly', icon: Shield, layout: 'compact' },
  { to: '/faq', label: 'FAQ', hint: 'Orders & delivery', icon: HelpCircle, layout: 'compact' },
  { to: '/contact', label: 'Contact', hint: 'Talk to our team', icon: BookOpen, layout: 'compact' },
]

const productHighlights = ['Sparklers', 'Flower pots', 'Chakkars', 'Aerial shells', 'Gift boxes']

function socialLabel(url: string) {
  if (url.includes('youtube')) return 'YouTube'
  if (url.includes('facebook')) return 'Facebook'
  return 'Instagram'
}

function socialIcon(url: string) {
  if (url.includes('youtube')) return Video
  if (url.includes('instagram')) return Share2
  return Sparkles
}

function socialButtonClass(url: string): string {
  if (url.includes('youtube')) {
    return 'border-red-400/40 bg-red-600/90 text-white shadow-[0_4px_24px_rgba(220,38,38,0.4)] hover:bg-red-500'
  }
  if (url.includes('facebook')) {
    return 'border-blue-400/40 bg-blue-600/90 text-white shadow-[0_4px_24px_rgba(37,99,235,0.4)] hover:bg-blue-500'
  }
  if (url.includes('instagram')) {
    return 'border-fuchsia-400/40 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-[0_4px_24px_rgba(219,39,119,0.4)] hover:brightness-110'
  }
  return 'border-gold-400/40 bg-gold-600/80 text-white'
}

function CatalogueTile({ to, label, hint, icon: Icon, layout }: LinkTile) {
  const isHero = layout === 'hero'
  const isWide = layout === 'wide'
  const isAccent = layout === 'accent'

  return (
    <Link
      to={to}
      className={cn(
        'group relative flex h-full min-h-[5.5rem] flex-col justify-between overflow-hidden rounded-2xl border transition duration-300',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400',
        isHero &&
          'min-h-[11rem] border-gold-400/30 bg-gradient-to-br from-navy-900 via-festive-950 to-navy-950 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-gold-300/50 hover:shadow-[0_24px_60px_rgba(245,158,11,0.2)] sm:min-h-0 sm:p-6',
        isWide &&
          'flex-row items-center gap-4 border-gold-500/25 bg-gradient-to-r from-gold-500/15 via-festive-600/10 to-transparent p-4 hover:border-gold-400/45 hover:from-gold-500/25 sm:p-5',
        isAccent &&
          'border-festive-500/25 bg-white/[0.06] p-4 backdrop-blur-sm hover:border-gold-400/40 hover:bg-white/[0.1] sm:p-5',
        layout === 'compact' &&
          'border-white/10 bg-white/[0.04] p-4 hover:border-gold-400/35 hover:bg-white/[0.08]',
      )}
    >
      {isHero && (
        <>
          <span
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-festive-500/20 blur-3xl"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(245,158,11,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.9) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            aria-hidden
          />
        </>
      )}

      <div className={cn('relative flex items-start gap-3', isWide && 'flex-1 items-center')}>
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl shadow-md transition group-hover:scale-105',
            isHero && 'h-12 w-12 bg-gradient-to-br from-gold-300 to-festive-500 text-navy-950',
            isWide && 'h-11 w-11 bg-gradient-to-br from-gold-400/90 to-festive-500 text-navy-950',
            isAccent && 'h-10 w-10 bg-gradient-to-br from-gold-300 to-festive-500 text-navy-950',
            layout === 'compact' && 'h-9 w-9 bg-white/10 text-gold-300',
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          {isHero && (
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-gold-400/45 bg-gold-400/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream-50">
              <Sparkles className="h-3 w-3 text-gold-400" aria-hidden />
              Start here
            </span>
          )}
          <span
            className={cn(
              'block font-semibold leading-tight',
              isHero ? 'text-lg text-cream-50 sm:text-xl' : 'text-sm text-cream-50',
              isWide && 'text-base sm:text-lg',
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              'mt-0.5 block text-xs leading-snug',
              isHero ? 'text-cream-100/85' : 'text-cream-100/80',
            )}
          >
            {hint}
          </span>
        </div>
        {!isHero && (
          <ArrowRight
            className="relative mt-1 h-4 w-4 shrink-0 text-gold-400/70 transition group-hover:translate-x-0.5 group-hover:text-gold-300"
            aria-hidden
          />
        )}
      </div>

      {isWide && (
        <span
          className="relative hidden shrink-0 items-center gap-1.5 rounded-full bg-gold-400/20 px-3 py-1.5 text-xs font-bold text-cream-50 sm:inline-flex"
        >
          Browse
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      )}

      {isHero && (
        <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300">
          Explore lanes
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
        </span>
      )}
    </Link>
  )
}

/** SEO-rich homepage footer block — styled, placed last on the home page. */
export function HomeSeoIntroSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-gold-500/20 bg-navy-950 py-16 sm:py-22"
      aria-labelledby="home-about-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(245,158,11,0.22),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_80%,rgba(234,88,12,0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.45) 50%, transparent 50%), radial-gradient(1px 1px at 70% 20%, rgba(251,191,36,0.6) 50%, transparent 50%), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.35) 50%, transparent 50%), radial-gradient(1.5px 1.5px at 85% 55%, rgba(251,191,36,0.5) 50%, transparent 50%), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.3) 50%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateIn animation="fade-up">
          <SectionHeader
            label="About Aura Crackers"
            title="Premium fireworks and crackers from Sivakasi"
            description="Official catalogue for Diwali, weddings, and festivals — browse online and enquire on WhatsApp."
            align="center"
            theme="dark"
            accent="gold"
          />
        </AnimateIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-5">
          <AnimateIn animation="fade-up" delay={100} className="lg:col-span-5">
            <div
              className="relative h-full overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8"
            >
              <div
                className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-festive-500/15 blur-3xl"
                aria-hidden
              />
              <h2 id="home-about-heading" className="sr-only">
                {SITE_NAME} — premium fireworks and crackers
              </h2>

              <div className="relative flex flex-wrap gap-2">
                {[
                  { icon: MapPin, text: 'Sivakasi sourced' },
                  { icon: MessageCircle, text: 'WhatsApp quotes' },
                  { icon: Package, text: 'Pan-India dispatch' },
                ].map(({ icon: ChipIcon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/45 bg-gold-400/20 px-3 py-1 text-[11px] font-semibold text-cream-50"
                  >
                    <ChipIcon className="h-3.5 w-3.5 text-gold-400" aria-hidden />
                    {text}
                  </span>
                ))}
              </div>

              <p className="relative mt-6 text-base leading-relaxed text-cream-100/90">
                Welcome to the official <strong className="font-semibold text-gold-300">{SITE_NAME}</strong>{' '}
                website — your trusted catalogue for{' '}
                <strong className="font-semibold text-gold-300">premium fireworks and crackers</strong> sourced
                from Sivakasi. Plan Diwali, weddings, temple festivals, or corporate events: compare varieties
                by category and send a quick enquiry on WhatsApp with your cart.
              </p>
              <p className="relative mt-4 text-sm leading-relaxed text-cream-100/75">
                Our listings include clear pricing guidance, pack sizes, and safety notes — quality-checked
                stock, transparent quotes, and dispatch support across India.
              </p>

              <div className="relative mt-6 flex flex-wrap gap-2" aria-label="Product types">
                {productHighlights.map((name) => (
                  <span
                    key={name}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-cream-100/80"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={180} className="lg:col-span-7">
            <div className="mb-4 flex items-end justify-between gap-4 px-0.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400/90">
                  Navigate
                </p>
                <h3 className="font-display text-xl font-bold text-cream-50 sm:text-2xl">
                  Explore the catalogue
                </h3>
              </div>
              <p className="hidden max-w-[12rem] text-right text-xs leading-snug text-cream-100/55 sm:block">
                Every link stays on {SITE_NAME} — pick a destination below.
              </p>
            </div>

            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-3.5">
              {quickLinks.map((link) => (
                <div
                  key={link.to}
                  className={cn(
                    link.layout === 'wide' && 'col-span-2 sm:col-span-6',
                    link.layout === 'hero' && 'col-span-2 row-span-2 sm:col-span-4 sm:row-span-2',
                    link.layout === 'accent' && 'col-span-1 sm:col-span-3',
                    link.layout === 'compact' && 'col-span-1 sm:col-span-3',
                  )}
                >
                  <CatalogueTile {...link} />
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>

        <AnimateIn animation="fade-up" delay={260} className="mt-10">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-navy-900/80 via-navy-950/90 to-navy-900/80 px-6 py-8 sm:px-10"
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gold-500/10 to-transparent"
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <h3 className="font-display text-lg font-bold text-cream-50 sm:text-xl">
                  Follow {SITE_NAME}
                </h3>
                <p className="mt-1.5 max-w-md text-sm text-cream-100/75">
                  Festival offers, new arrivals, and celebration ideas on social media.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-end">
                {BRAND_SOCIAL_PROFILES.map((url) => {
                  const Icon = socialIcon(url)
                  return (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${socialButtonClass(url)}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {socialLabel(url)}
                    </a>
                  )
                })}
                <a
                  href={SITE_URL}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-cream-50 transition hover:border-gold-400/40 hover:bg-white/15"
                  rel="home"
                >
                  {SITE_URL.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

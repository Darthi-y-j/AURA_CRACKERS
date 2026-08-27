import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  Sparkles,
  Shield,
  Heart,
  ShoppingBag,
  Gift,
  Users,
  CheckCircle2,
  Flame,
  Star,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { SectionHeader } from '@/components/customer/SectionHeader'
import { TitleHighlight } from '@/components/customer/TitleHighlight'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { StoryTimeline } from '@/components/customer/StoryTimeline'
import { CollectionShowcase } from '@/components/customer/CollectionShowcase'
import { VisionPillars } from '@/components/customer/VisionPillars'
import { cn } from '@/lib/utils'

const storyTimeline = [
  {
    year: '01',
    title: 'The Idea',
    text: 'Make festive shopping easier, better, and more enjoyable — one place to explore every kind of cracker.',
    note: 'Festive shopping should feel exciting — not complicated.',
  },
  {
    year: '02',
    title: 'The Build',
    text: 'A curated space where customers understand what each product offers and choose what fits their celebration.',
    note: 'Clear product info helps you choose with confidence.',
  },
  {
    year: '03',
    title: 'The Growth',
    text: 'A brand shaped by quality, variety, convenience, and the trust of families who celebrate with us.',
    note: 'Quality, variety, convenience, and customer trust.',
  },
  {
    year: '04',
    title: 'Today',
    text: 'Products that add colour, excitement, and sparkle to Diwali, weddings, parties, and every special moment.',
    note: 'Colour, excitement, and sparkle for every occasion.',
  },
]

const collectionItems = [
  { emoji: '✨', name: 'Sparklers & Crackling Sparklers' },
  { emoji: '🎆', name: 'Aerial Crackers' },
  { emoji: '🌈', name: 'Multi-Shot Crackers' },
  { emoji: '💥', name: 'Sound Crackers' },
  { emoji: '🌸', name: 'Fancy Crackers' },
  { emoji: '🔥', name: 'Fountains & Ground Effects' },
  { emoji: '🚀', name: 'Rockets & Sky Shots' },
  { emoji: '🎨', name: 'Colourful Fireworks' },
  { emoji: '🎉', name: 'Novelty Crackers' },
  { emoji: '🌫️', name: 'Smoke & Special Effects' },
  { emoji: '🎁', name: 'Gift Packs & Combo Boxes' },
  { emoji: '🪔', name: 'Traditional Festival Favourites' },
]

const celebrations = [
  'Diwali',
  'Weddings',
  'Family Gatherings',
  'Festivals',
  'Parties',
  'Special Occasions',
  'Community Celebrations',
]

const whyChoose: { icon: LucideIcon; title: string; description: string; stat: string }[] = [
  {
    icon: Sparkles,
    title: 'Wide Variety',
    description:
      'Crackers and fireworks for different ages, occasions, preferences, and celebration styles.',
    stat: '50+',
  },
  {
    icon: ShoppingBag,
    title: 'Easy Online Shopping',
    description: 'Explore details, add to cart, and enquire — all from one simple experience.',
    stat: 'Simple',
  },
  {
    icon: Gift,
    title: 'Celebration-Ready',
    description: 'Collections and combos designed for a complete, colourful celebration.',
    stat: 'Combos',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'A smooth journey from your first visit to the moment your order arrives.',
    stat: 'Always',
  },
]

const whyChooseCardThemes = [
  'border-amber-500/25 hover:border-amber-400/45 hover:shadow-amber-500/10',
  'border-sky-500/25 hover:border-sky-400/45 hover:shadow-sky-500/10',
  'border-festive-500/25 hover:border-festive-400/45 hover:shadow-festive-500/10',
  'border-violet-500/25 hover:border-violet-400/45 hover:shadow-violet-500/10',
]

const visionPillars = [
  { icon: Shield, word: 'Trust', text: 'Dependable products and a shopping experience you can rely on.' },
  { icon: Star, word: 'Quality', text: 'Every item selected with appearance, performance, and reliability in mind.' },
  { icon: Flame, word: 'Celebration', text: 'Making every festive moment brighter, easier, and more memorable.' },
]

const ABOUT_QUALITY_IMAGE = '/about-quality-products.png'
const ABOUT_CELEBRATION_IMAGE = '/about-celebration-sparkler.jpg'
const STORY_SECTION_BG = '/how-it-works-bg.webp'
const STORY_SECTION_BG_FALLBACK = '/how-it-works-bg.png'
const PROMISE_CARD_BG = '/premium-quality-card.webp'
const PROMISE_CARD_BG_FALLBACK = '/premium-quality-card.png'
const SAFETY_CARD_BG = '/about-safety-bg.png'
const ABOUT_HEADER_QUOTE_BG = '/about-celebration-sparkler.jpg'

const headerHighlights = ['Premium Quality', 'Wide Range', 'Family Trusted']

function AboutPageHeader() {
  return (
    <header className="relative overflow-hidden border-b border-navy-900/8 bg-gradient-to-br from-cream-50 via-amber-50/40 to-rose-50/30">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(46,30,22,0.06) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-festive-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-12 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 left-1/3 h-48 w-48 rounded-full bg-rose-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/45 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-navy-700/55">
          <Link to="/" className="transition hover:text-festive-600">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-navy-900">About</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10">
          <AnimateIn animation="fade-up">
            <div className="flex items-center gap-2.5">
              <span
                className="h-0.5 w-10 rounded-full bg-gradient-to-r from-festive-500 to-gold-400 sm:w-12"
                aria-hidden="true"
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-festive-600 sm:text-[11px]">
                Our Brand Story
              </p>
            </div>
            <h1 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.08] text-navy-900 sm:text-5xl lg:text-[3.1rem]">
              Lighting Up Celebrations,{' '}
              <TitleHighlight variant="light">One Spark at a Time</TitleHighlight>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-700/80">
              At Aura, celebrations are memories waiting to be created — from choosing your favourite
              crackers to the sparkle that fills the sky. We bring quality fireworks and festive
              crackers for every kind of celebration.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {headerHighlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/25 bg-white/80 px-3 py-1.5 text-xs font-semibold text-navy-800 shadow-sm backdrop-blur-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                  {item}
                </span>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={120}>
            <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-gold-400/25 shadow-[0_20px_60px_rgba(46,30,22,0.18)] sm:min-h-[280px]">
              <img
                src={ABOUT_HEADER_QUOTE_BG}
                alt=""
                loading="eager"
                decoding="async"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_38%] blur-[2px] transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"
                aria-hidden="true"
              />
              <div className="relative z-[1] flex h-full flex-col justify-end p-6 sm:p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-gold-300" />
                </div>
                <blockquote className="mt-4 font-display text-lg font-semibold leading-snug text-cream-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-xl">
                  &ldquo;Whether you love aerial displays, bright fountains, or traditional favourites
                  —{' '}
                  <span className="text-gradient-gold">Aura brings the celebration closer to you.</span>
                  &rdquo;
                </blockquote>
                <p className="mt-4 text-sm leading-relaxed text-cream-100/80">
                  Buying crackers should be as exciting as using them — simple, clear, and built
                  around the joy of choosing together.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </header>
  )
}

export function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Aura Crackers — your trusted destination for quality fireworks and festive crackers from Sivakasi, Tamil Nadu."
        url="/about"
      />

      <AboutPageHeader />

      {/* Story — animated timeline (dark theme) */}
      <section id="our-story" className="relative overflow-hidden py-14 sm:py-20">
        <picture className="pointer-events-none absolute inset-0">
          <source srcSet={STORY_SECTION_BG} type="image/webp" />
          <img
            src={STORY_SECTION_BG_FALLBACK}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            aria-hidden="true"
            className="h-full w-full scale-[1.03] object-cover object-[center_35%] blur-[3px]"
          />
        </picture>
        <div
          className="pointer-events-none absolute inset-0 bg-black/55"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/85"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,rgba(245,158,11,0.14),transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <SectionHeader
              label="Our Story"
              title="Built Around Celebrations"
              description="From a simple idea to a brand families trust for every festive occasion."
              theme="dark"
              align="center"
            />
          </AnimateIn>

          <StoryTimeline items={storyTimeline} />
        </div>
      </section>

      <CollectionShowcase items={collectionItems} />

      {/* Quality + occasions */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
            <AnimateIn animation="fade-up" className="h-full">
              <div className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-navy-900/10 shadow-[0_16px_48px_rgba(46,30,22,0.12)]">
                <img
                  src={ABOUT_QUALITY_IMAGE}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center blur-[3px] transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/30"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20"
                  aria-hidden="true"
                />
                <div className="relative z-[1] flex flex-1 flex-col p-7 sm:p-9">
                  <SectionHeader
                    label="Our Standard"
                    title="Quality You Can Count On"
                    showAccent={false}
                    theme="dark"
                  />
                  <p className="mt-4 text-sm leading-relaxed text-cream-100/85 sm:text-base">
                    Fireworks are an important part of your celebrations. We select products with{' '}
                    <strong className="font-semibold text-white">
                      quality, appearance, performance, and reliability
                    </strong>{' '}
                    in mind — each presented with clear information so you choose with confidence.
                  </p>
                  <p className="mt-4 text-sm font-medium text-gold-300">
                    A great celebration starts with choosing the right products.
                  </p>
                  <div className="flex-1" aria-hidden="true" />
                </div>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={100} className="h-full">
              <div className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-navy-900/10 shadow-[0_16px_48px_rgba(46,30,22,0.12)]">
                <img
                  src={ABOUT_CELEBRATION_IMAGE}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-[center_35%] blur-[3px] transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/25"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30"
                  aria-hidden="true"
                />
                <div className="relative z-[1] flex flex-1 flex-col p-7 sm:p-9">
                  <SectionHeader
                    label="Every Occasion"
                    title="Made for Every Celebration"
                    showAccent={false}
                    theme="dark"
                  />
                  <p className="mt-4 text-sm leading-relaxed text-cream-100/80">
                    From intimate family gatherings to grand festive events — Aura fits every mood.
                  </p>
                  <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    {celebrations.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-cream-50/90"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-festive-400 to-gold-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex-1" aria-hidden="true" />
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Promise + why choose — compact bento */}
      <section className="relative overflow-hidden border-t border-navy-900/8 bg-cream-100 py-8 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(251,191,36,0.08),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <SectionHeader label="Why Aura" title="Why Choose Aura?" showAccent={false} />
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={60}>
            <div className="group relative mt-5 overflow-hidden rounded-2xl border border-gold-400/30 shadow-[0_12px_40px_rgba(46,30,22,0.14)] sm:mt-6">
              <picture className="pointer-events-none absolute inset-0">
                <source srcSet={PROMISE_CARD_BG} type="image/webp" />
                <img
                  src={PROMISE_CARD_BG_FALLBACK}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                  className="h-full w-full scale-[1.03] object-cover object-[center_35%] blur-[2px] transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </picture>
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
                aria-hidden="true"
              />
              <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                  <Heart className="h-5 w-5 text-gold-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-bold text-cream-50 sm:text-2xl">
                    Our Promise
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-100/85">
                    To make every celebration brighter, every choice easier, and every moment more
                    memorable — from the first spark to the final glow.
                  </p>
                </div>
                <p className="shrink-0 text-xs font-semibold leading-snug text-gold-300 sm:max-w-[10.5rem] sm:border-l sm:border-white/15 sm:pl-5 sm:text-sm">
                  Return for the products — stay for the experience.
                </p>
              </div>
            </div>
          </AnimateIn>

          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-3 lg:grid-cols-4">
            {whyChoose.map((item, i) => (
              <AnimateIn key={item.title} delay={80 + i * 40} animation="fade-up">
                <div
                  className={cn(
                    'group relative h-full overflow-hidden rounded-xl border bg-gradient-to-br from-[#151210] to-[#0f0d0b] p-4 shadow-[0_6px_24px_rgba(15,13,11,0.16)] transition-all duration-300 hover:-translate-y-0.5 sm:p-4',
                    whyChooseCardThemes[i % whyChooseCardThemes.length],
                  )}
                >
                  <div
                    className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-festive-500/10 blur-2xl transition-opacity group-hover:bg-festive-500/20"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-start justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15 ring-1 ring-gold-400/25">
                      <item.icon className="h-4 w-4 text-gold-400" />
                    </div>
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-300 ring-1 ring-gold-400/25 sm:text-[10px]">
                      {item.stat}
                    </span>
                  </div>
                  <h3 className="relative mt-3 font-display text-sm font-bold sm:text-base">
                    <TitleHighlight variant="dark">{item.title}</TitleHighlight>
                  </h3>
                  <p className="relative mt-1.5 text-[11px] leading-relaxed text-cream-100/65 sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VisionPillars items={visionPillars} />
        </div>
      </section>

      {/* Safety */}
      <section className="border-t border-navy-900/8 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn animation="fade-up">
            <div className="group relative overflow-hidden rounded-2xl border border-green-600/20 shadow-[0_12px_40px_rgba(22,101,52,0.1)]">
              <img
                src={SAFETY_CARD_BG}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div
                className="absolute inset-0 bg-white/25"
                aria-hidden="true"
              />
              <div className="relative z-[1] flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-green-600/15 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold text-navy-900 sm:text-2xl">
                    Celebrate Responsibly
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/85 sm:text-base">
                    Enjoy fireworks responsibly. Follow safety instructions, keep a safe distance, and
                    use products only in suitable areas according to local rules.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Follow instructions', 'Keep distance', 'Stay safe'].map((tip) => (
                    <span
                      key={tip}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-600/20 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}

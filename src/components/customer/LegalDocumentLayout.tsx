import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Shield,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Check,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { TitleHighlight } from './TitleHighlight'
import { WaveDivider } from './WaveDivider'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'

const LEGAL_BG = '/contact-section-bg.webp'
const LEGAL_BG_FALLBACK = '/contact-section-bg.png'

const sectionAccents = [
  'border-gold-500/35',
  'border-amber-500/30',
  'border-festive-500/30',
  'border-emerald-500/28',
  'border-sky-500/28',
  'border-violet-500/28',
  'border-rose-500/28',
  'border-teal-500/28',
]

const objectPositions = [
  'object-[center_25%]',
  'object-[30%_center]',
  'object-[70%_center]',
  'object-[center_40%]',
  'object-[20%_30%]',
  'object-[80%_35%]',
  'object-[center_55%]',
  'object-[40%_center]',
]

export interface LegalSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
  afterBullets?: string[]
}

interface LegalDocumentLayoutProps {
  title: string
  seoDescription: string
  url: string
  effectiveDate: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
  closingNote?: string
  heroChips?: string[]
  relatedPage?: { label: string; href: string }
}

function sectionSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function sectionNumber(title: string) {
  const match = title.match(/^(\d+)\./)
  return match ? match[1].padStart(2, '0') : '•'
}

function sectionLabel(title: string) {
  return title.replace(/^\d+\.\s*/, '')
}

function LegalSectionCard({ section, index }: { section: LegalSection; index: number }) {
  const slug = sectionSlug(section.title)
  const isContact = /contact/i.test(section.title)

  return (
    <article
      id={slug}
      className={cn(
        'group relative scroll-mt-28 overflow-hidden rounded-2xl border bg-navy-950 shadow-[0_10px_36px_rgba(15,13,11,0.22)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(251,191,36,0.1)]',
        sectionAccents[index % sectionAccents.length],
        isContact && 'ring-1 ring-gold-400/25',
      )}
    >
      <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <picture className="block h-full w-full">
          <source srcSet={LEGAL_BG} type="image/webp" />
          <img
            src={LEGAL_BG_FALLBACK}
            alt=""
            loading="lazy"
            decoding="async"
            className={cn(
              'h-full w-full scale-110 object-cover blur-[3px] transition-transform duration-700 group-hover:scale-[1.14]',
              objectPositions[index % objectPositions.length],
            )}
          />
        </picture>
      </span>
      <span
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-black/88 via-black/74 to-black/90"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-[3] p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 font-display text-sm font-bold text-gold-300 ring-1 ring-gold-400/35 sm:h-11 sm:w-11">
            {sectionNumber(section.title)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-bold leading-snug text-cream-50 sm:text-xl">
              {sectionLabel(section.title)}
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-cream-100/85 sm:text-[0.9375rem]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-cream-100/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/25">
                      <Check className="h-3 w-3 text-gold-400" strokeWidth={2.5} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.afterBullets && section.afterBullets.length > 0 && (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-cream-100/85">
                {section.afterBullets.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function LegalDocumentLayout({
  title,
  seoDescription,
  url,
  effectiveDate,
  lastUpdated,
  intro,
  sections,
  closingNote,
  heroChips = [],
  relatedPage,
}: LegalDocumentLayoutProps) {
  const { settings } = useSettings()
  const primaryWhatsApp = getWhatsAppNumbers(settings)[0]
  const [activeSlug, setActiveSlug] = useState(sectionSlug(sections[0]?.title ?? ''))

  useEffect(() => {
    const slugs = sections.map((s) => sectionSlug(s.title))
    const elements = slugs.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveSlug(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <>
      <SEO title={title} description={seoDescription} url={url} />

      <div className="bg-cream-50">
        <header className="relative overflow-hidden bg-navy-950 pb-0 pt-6 sm:pt-8">
          <picture className="absolute inset-0">
            <source srcSet={LEGAL_BG} type="image/webp" />
            <img
              src={LEGAL_BG_FALLBACK}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center opacity-50"
            />
          </picture>
          <div className="absolute inset-0 bg-navy-950/70" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-5%,rgba(245,158,11,0.18),transparent_60%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950/80 to-transparent"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-cream-100/55">
              <Link to="/" className="transition hover:text-gold-300">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-cream-50">{title}</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-3xl pb-8 sm:mt-8 sm:pb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                  <FileText className="h-3.5 w-3.5 text-gold-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
                    Legal
                  </span>
                </div>

                <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] text-cream-50 sm:text-5xl">
                  <TitleHighlight variant="dark">{title}</TitleHighlight>
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-cream-100/70 sm:text-base">{intro}</p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-cream-100/80 backdrop-blur-sm">
                    Effective {effectiveDate}
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-cream-100/80 backdrop-blur-sm">
                    Updated {lastUpdated}
                  </span>
                  {relatedPage && (
                    <Link
                      to={relatedPage.href}
                      className="inline-flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-500/20"
                    >
                      {relatedPage.label}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {heroChips.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {heroChips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cream-100/70"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </AnimateIn>
          </div>

          <WaveDivider />
        </header>

        <section className="relative -mt-1 pb-12 pt-4 sm:pb-16 sm:pt-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_0%,rgba(245,158,11,0.06),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] xl:gap-10">
              {/* Sticky table of contents */}
              <aside className="mb-6 lg:mb-0">
                <div className="lg:sticky lg:top-24">
                  <AnimateIn animation="fade-up" delay={60}>
                    <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_8px_32px_rgba(15,13,11,0.08)]">
                      <div className="border-b border-navy-900/8 bg-gradient-to-r from-navy-950 to-navy-900 px-4 py-3.5">
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-300">
                          <Shield className="h-3.5 w-3.5" />
                          On this page
                        </p>
                      </div>
                      <nav className="max-h-[min(70vh,32rem)] overflow-y-auto p-2" aria-label="Table of contents">
                        <ul className="space-y-0.5">
                          {sections.map((section) => {
                            const slug = sectionSlug(section.title)
                            const isActive = activeSlug === slug
                            return (
                              <li key={section.title}>
                                <a
                                  href={`#${slug}`}
                                  onClick={() => setActiveSlug(slug)}
                                  className={cn(
                                    'flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition sm:text-[0.8125rem]',
                                    isActive
                                      ? 'bg-gold-500/12 font-semibold text-navy-900'
                                      : 'text-navy-700/70 hover:bg-cream-100 hover:text-navy-900',
                                  )}
                                >
                                  <span
                                    className={cn(
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-display text-[10px] font-bold',
                                      isActive
                                        ? 'bg-gold-500 text-navy-950'
                                        : 'bg-navy-900/6 text-navy-700/60',
                                    )}
                                  >
                                    {sectionNumber(section.title)}
                                  </span>
                                  <span className="line-clamp-2 leading-snug">{sectionLabel(section.title)}</span>
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      </nav>
                    </div>
                  </AnimateIn>
                </div>
              </aside>

              {/* Sections */}
              <div className="min-w-0 space-y-4 sm:space-y-5">
                {sections.map((section, index) => (
                  <AnimateIn key={section.title} animation="fade-up" delay={80 + index * 35}>
                    <LegalSectionCard section={section} index={index} />
                  </AnimateIn>
                ))}

                {closingNote && (
                  <AnimateIn animation="fade-up" delay={80 + sections.length * 35}>
                    <div className="relative overflow-hidden rounded-2xl border border-gold-400/30 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-5 shadow-[0_12px_40px_rgba(251,191,36,0.08)] sm:p-6">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_0%_0%,rgba(245,158,11,0.12),transparent_50%)]"
                        aria-hidden="true"
                      />
                      <div className="relative flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 ring-1 ring-gold-400/35">
                          <Shield className="h-5 w-5 text-gold-400" />
                        </span>
                        <p className="text-sm leading-relaxed text-cream-100/85 sm:text-[0.9375rem]">
                          {closingNote}
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                )}
              </div>
            </div>

            {/* CTA */}
            <AnimateIn animation="fade-up" delay={200}>
              <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold-400/20 shadow-[0_16px_48px_rgba(15,13,11,0.12)] sm:mt-10">
                <picture className="pointer-events-none absolute inset-0">
                  <source srcSet={LEGAL_BG} type="image/webp" />
                  <img
                    src={LEGAL_BG_FALLBACK}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                    className="h-full w-full scale-105 object-cover object-center blur-[3px]"
                  />
                </picture>
                <div
                  className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/85"
                  aria-hidden="true"
                />
                <div className="relative z-[1] flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-8 sm:py-10">
                  <div className="text-center sm:text-left">
                    <Sparkles className="mx-auto h-6 w-6 text-gold-400 sm:mx-0" />
                    <h2 className="mt-3 font-display text-xl font-bold text-cream-50 sm:text-2xl">
                      Questions about this <TitleHighlight variant="dark">document?</TitleHighlight>
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-cream-100/70">
                      Reach out anytime — our team is available on WhatsApp 24/7 for clarifications or
                      concerns.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    {primaryWhatsApp && (
                      <a
                        href={buildWhatsAppContactUrl(primaryWhatsApp, `Hello! I have a question about your ${title}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition hover:brightness-110"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-cream-50 backdrop-blur-sm transition hover:border-gold-400/40 hover:bg-white/15"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </>
  )
}

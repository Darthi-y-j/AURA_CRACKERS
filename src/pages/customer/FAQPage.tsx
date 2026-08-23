import { Link } from 'react-router-dom'
import { HelpCircle, MessageCircle, ChevronDown, Sparkles } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { TitleHighlight } from '@/components/customer/TitleHighlight'
import { WaveDivider } from '@/components/customer/WaveDivider'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse products, add them to your cart with the quantities you need, then go to Cart and click "Send Enquiry on WhatsApp". Our team will contact you to confirm availability, pricing, and delivery. There is no online payment.',
  },
  {
    q: 'Is there online payment?',
    a: 'We accept pre-payment only. After you send an enquiry, our team will share payment details and confirm your order before dispatch.',
  },
  {
    q: 'Can I enquire about multiple products?',
    a: 'Yes! Add multiple products to your cart, then send one combined enquiry on WhatsApp with all items listed.',
  },
  {
    q: 'Can I make a custom gift box?',
    a: 'Yes. Go to Gift Box, add the products you want with quantities, then add the assembled box to your cart and send a WhatsApp enquiry. You can pack more than one gift box in the same enquiry.',
  },
  {
    q: 'Are prices shown on the website final?',
    a: 'Prices displayed are indicative and may vary. For the most accurate pricing, send an enquiry and our team will provide current rates.',
  },
  {
    q: 'Do you deliver?',
    a: 'Yes! We deliver all over India. Contact us on WhatsApp with your location and order details — our team will confirm delivery availability and charges.',
  },
  {
    q: 'Is it safe to buy fireworks online?',
    a: 'We are a catalogue and enquiry platform. All transactions and deliveries are handled offline through direct communication with our team, ensuring you receive proper guidance on safe usage.',
  },
  {
    q: 'What is the minimum order quantity?',
    a: "Minimum quantities vary by product. Send an enquiry for the specific product you're interested in, and our team will inform you of any minimum requirements.",
  },
  {
    q: 'How quickly will you respond to my enquiry?',
    a: 'We respond on WhatsApp 24/7. Most enquiries receive a reply within minutes, including on weekends and during festival season.',
  },
]

const FAQ_BG = '/contact-section-bg.webp'
const FAQ_BG_FALLBACK = '/contact-section-bg.png'

const topicChips = ['Ordering', 'Pricing', 'Delivery', 'Safety & Support']

const faqAccents = [
  'border-amber-500/30 group-open:border-amber-400/55',
  'border-sky-500/30 group-open:border-sky-400/55',
  'border-violet-500/30 group-open:border-violet-400/55',
  'border-rose-500/30 group-open:border-rose-400/55',
  'border-emerald-500/30 group-open:border-emerald-400/55',
  'border-festive-500/30 group-open:border-festive-400/55',
  'border-teal-500/30 group-open:border-teal-400/55',
  'border-gold-500/35 group-open:border-gold-300/60',
]

const faqObjectPositions = [
  'object-[center_25%]',
  'object-[30%_center]',
  'object-[70%_center]',
  'object-[center_40%]',
  'object-[20%_30%]',
  'object-[80%_35%]',
  'object-[center_55%]',
  'object-[40%_center]',
]

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-navy-950 shadow-[0_8px_28px_rgba(15,13,11,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(251,191,36,0.12)]',
        faqAccents[index % faqAccents.length],
      )}
    >
      <span className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <picture className="block h-full w-full">
          <source srcSet={FAQ_BG} type="image/webp" />
          <img
            src={FAQ_BG_FALLBACK}
            alt=""
            loading="lazy"
            decoding="async"
            className={cn(
              'h-full w-full scale-110 object-cover blur-[3px] transition-transform duration-500 group-open:scale-[1.14]',
              faqObjectPositions[index % faqObjectPositions.length],
            )}
          />
        </picture>
      </span>
      <span
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-black/82 via-black/68 to-black/88"
        aria-hidden="true"
      />

      <details className="relative z-[2]">
        <summary className="flex cursor-pointer list-none items-start gap-3 bg-transparent px-4 py-4 marker:content-none sm:px-5 sm:py-5 [&::-webkit-details-marker]:hidden">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/25 font-display text-xs font-bold text-cream-50 ring-1 ring-gold-400/40">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0 flex-1 font-display text-base font-semibold leading-snug text-cream-50 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] sm:text-[1.05rem]">
            {faq.q}
          </span>
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-gold-400 transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="border-t border-white/15 bg-black/35 px-4 py-4 text-sm leading-relaxed text-cream-100/90 sm:px-5 sm:py-4 sm:pl-[3.85rem]">
          {faq.a}
        </div>
      </details>
    </div>
  )
}

export function FAQPage() {
  const { settings } = useSettings()
  const primaryWhatsApp = getWhatsAppNumbers(settings)[0]

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about browsing products and sending enquiries at Aura Crackers."
      />

      <div className="bg-cream-50">
        {/* Hero */}
        <header className="relative overflow-visible bg-navy-950 pb-0 pt-6 sm:pt-8">
          <picture className="absolute inset-0">
            <source srcSet={FAQ_BG} type="image/webp" />
            <img
              src={FAQ_BG_FALLBACK}
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
              <span className="font-medium text-cream-50">FAQ</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-2xl pb-8 sm:mt-8 sm:pb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                  <HelpCircle className="h-3.5 w-3.5 text-gold-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
                    Help Centre
                  </span>
                </div>

                <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] text-cream-50 sm:text-5xl">
                  Frequently Asked{' '}
                  <TitleHighlight variant="dark">Questions</TitleHighlight>
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream-100/70 sm:text-base">
                  Clear answers on ordering, pricing, delivery, and enquiries — so you can shop with
                  confidence.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {topicChips.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-cream-100/85 backdrop-blur-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>

          <WaveDivider />
        </header>

        {/* FAQ list */}
        <section className="relative -mt-1 pb-10 pt-2 sm:pb-14 sm:pt-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              {faqs.map((faq, i) => (
                <AnimateIn key={faq.q} animation="fade-up" delay={40 + i * 30} className="h-full">
                  <FAQItem faq={faq} index={i} />
                </AnimateIn>
              ))}
            </div>

            {/* CTA */}
            <AnimateIn animation="fade-up" delay={300}>
              <div className="relative mt-6 overflow-hidden rounded-2xl border border-gold-400/20 shadow-[0_16px_48px_rgba(15,13,11,0.12)] sm:mt-8">
                <picture className="pointer-events-none absolute inset-0">
                  <source srcSet={FAQ_BG} type="image/webp" />
                  <img
                    src={FAQ_BG_FALLBACK}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                    className="h-full w-full scale-105 object-cover object-center blur-[3px]"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/85" aria-hidden="true" />
                <div className="relative z-[1] flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-8 sm:py-10">
                  <div className="text-center sm:text-left">
                    <Sparkles className="mx-auto h-6 w-6 text-gold-400 sm:mx-0" />
                    <h2 className="mt-3 font-display text-xl font-bold text-cream-50 sm:text-2xl">
                      Still have <TitleHighlight variant="dark">questions?</TitleHighlight>
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-cream-100/70">
                      Our team is on WhatsApp 24/7 — message us anytime for product details, pricing,
                      or delivery info.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    {primaryWhatsApp && (
                      <a
                        href={buildWhatsAppContactUrl(primaryWhatsApp, 'Hello! I have a question.')}
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

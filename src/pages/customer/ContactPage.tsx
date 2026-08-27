import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { EnquiryForm } from '@/components/customer/EnquiryForm'
import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl, buildTelUrl, buildMailtoUrl } from '@/lib/whatsapp'
import { formatDisplayPhone, getWhatsAppNumbers } from '@/lib/businessInfo'
import { BusinessPoliciesGrid } from '@/components/customer/BusinessPoliciesGrid'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { SectionHeader } from '@/components/customer/SectionHeader'
import { TitleHighlight } from '@/components/customer/TitleHighlight'
import { WaveDivider } from '@/components/customer/WaveDivider'

const CONTACT_BG = '/contact-section-bg.webp'
const CONTACT_BG_FALLBACK = '/contact-section-bg.png'

const contactChips = ['WhatsApp', 'Phone', 'Email', 'Visit Us']

export function ContactPage() {
  const { settings } = useSettings()
  const { user, isCustomer } = useAuth()
  const whatsappNumbers = getWhatsAppNumbers(settings)

  const enquiryDefaults = isCustomer && user
    ? {
        firstName: (user.user_metadata?.full_name as string | undefined)?.split(/\s+/)[0] || '',
        lastName:
          (user.user_metadata?.full_name as string | undefined)?.split(/\s+/).slice(1).join(' ') || '',
        email: user.email || '',
        phone: (user.user_metadata?.phone as string | undefined) || '',
      }
    : undefined

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Contact ${settings.business_name}. Reach us via WhatsApp, phone, or email — available 24/7.`}
        url="/contact"
      />

      <div className="bg-cream-50">
        {/* Hero */}
        <header className="relative overflow-visible bg-navy-950 pb-0 pt-6 sm:pt-8">
          <picture className="absolute inset-0">
            <source srcSet={CONTACT_BG} type="image/webp" />
            <img
              src={CONTACT_BG_FALLBACK}
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
              <span className="font-medium text-cream-50">Contact</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-2xl pb-8 sm:mt-8 sm:pb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                  <MessageCircle className="h-3.5 w-3.5 text-gold-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
                    Reach Out
                  </span>
                </div>

                <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] text-cream-50 sm:text-5xl">
                  Contact{' '}
                  <TitleHighlight variant="dark">Us</TitleHighlight>
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream-100/70 sm:text-base">
                  We&apos;re available 24/7 on WhatsApp. Call, email, or visit us — pick whatever
                  works best for you.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {contactChips.map((channel) => (
                    <span
                      key={channel}
                      className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-cream-100/85 backdrop-blur-sm"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>

          <WaveDivider />
        </header>

        {/* Connect + Enquiry */}
        <section className="relative -mt-1 pb-10 pt-2 sm:pb-12 sm:pt-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn animation="fade-up" delay={60}>
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                {/* Left: Connect With Us */}
                <div className="relative overflow-hidden rounded-2xl border border-gold-400/20 shadow-[0_20px_60px_rgba(15,13,11,0.18)]">
                  <picture className="pointer-events-none absolute inset-0">
                    <source srcSet={CONTACT_BG} type="image/webp" />
                    <img
                      src={CONTACT_BG_FALLBACK}
                      alt=""
                      loading="eager"
                      decoding="async"
                      aria-hidden="true"
                      className="h-full w-full scale-105 object-cover object-center blur-[3px]"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/90" aria-hidden="true" />
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_0%,rgba(245,158,11,0.14),transparent_55%)]"
                    aria-hidden="true"
                  />

                  <div className="relative z-[1] p-6 sm:p-8">
                    <h2 className="font-display text-2xl font-bold text-cream-50 sm:text-3xl">Connect With Us</h2>
                    <p className="mt-2 text-sm leading-relaxed text-cream-100/70">
                      Share your requirements. We&apos;ll handle the rest — quotes, bulk orders, and delivery.
                    </p>

                    <div className="mt-8 space-y-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 ring-1 ring-gold-400/35">
                            <MessageCircle className="h-4 w-4 text-[#25D366]" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400/80">WhatsApp</p>
                        </div>
                        <ul className="mt-3 space-y-1.5 pl-12">
                          {whatsappNumbers.map((number) => (
                            <li key={number}>
                              <a
                                href={buildWhatsAppContactUrl(number, 'Hello! I would like to get in touch.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-[#86efac] transition hover:text-[#bbf7d0]"
                              >
                                {formatDisplayPhone(number)}
                              </a>
                            </li>
                          ))}
                        </ul>
                        <span className="ml-12 mt-2 inline-block rounded-full bg-gold-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-300">
                          Available 24/7
                        </span>
                      </div>

                      {settings.phone && (
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 ring-1 ring-gold-400/35">
                              <Phone className="h-4 w-4 text-gold-400" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400/80">Call Us</p>
                          </div>
                          <a
                            href={buildTelUrl(settings.phone)}
                            className="mt-3 block pl-12 text-sm font-medium text-cream-50/90 hover:text-gold-300"
                          >
                            {formatDisplayPhone(settings.phone)}
                          </a>
                        </div>
                      )}

                      {settings.email && (
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 ring-1 ring-gold-400/35">
                              <Mail className="h-4 w-4 text-festive-400" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400/80">Email Us</p>
                          </div>
                          <a
                            href={buildMailtoUrl(settings.email)}
                            className="mt-3 block break-all pl-12 text-sm font-medium text-cream-50/90 hover:text-gold-300"
                          >
                            {settings.email}
                          </a>
                        </div>
                      )}

                      {settings.address && (
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/20 ring-1 ring-gold-400/35">
                              <MapPin className="h-4 w-4 text-gold-300" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400/80">Visit Us</p>
                          </div>
                          <p className="mt-3 whitespace-pre-line pl-12 text-sm leading-relaxed text-cream-100/80">
                            {settings.address}
                          </p>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                            <Clock className="h-4 w-4 text-gold-300" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400/80">Hours</p>
                        </div>
                        <p className="mt-3 pl-12 text-sm font-medium text-gold-300">Open 24/7</p>
                      </div>
                    </div>

                    <p className="mt-8 text-xs text-cream-100/50">
                      Have an account?{' '}
                      <Link to="/login" className="font-semibold text-gold-400 hover:text-gold-300">
                        Sign in
                      </Link>{' '}
                      to track your enquiries.
                    </p>
                  </div>
                </div>

                {/* Right: Send an Inquiry */}
                <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15">
                      <Send className="h-5 w-5 text-gold-600" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-navy-900">Send an Inquiry</h2>
                      <p className="text-sm text-navy-700/65">Fill in the form and we&apos;ll get back to you shortly.</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <EnquiryForm
                      enquiryType="contact"
                      authUserId={isCustomer ? user?.id : undefined}
                      defaults={enquiryDefaults}
                    />
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Policies */}
            <AnimateIn animation="fade-up" delay={120}>
              <div className="mt-6 overflow-hidden rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm sm:mt-8 sm:p-6">
                <SectionHeader
                  label="Good to Know"
                  title="Our Policies"
                  align="center"
                  showAccent={false}
                />
                <div className="mt-5">
                  <BusinessPoliciesGrid variant="light" />
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </>
  )
}

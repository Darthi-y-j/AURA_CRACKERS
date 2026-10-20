import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl, buildTelUrl, buildMailtoUrl } from '@/lib/whatsapp'
import { formatDisplayPhone, getWhatsAppNumbers } from '@/lib/businessInfo'
import { DEVELOPER_CREDIT } from '@/lib/siteConfig'
import { FooterSocialShare } from '@/components/customer/FooterSocialShare'

export function Footer() {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()
  const whatsappNumbers = getWhatsAppNumbers(settings)

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          <div>
            <div className="relative h-8 w-36 max-w-full sm:h-9 sm:w-40">
              <img
                src="/Wordmark - Transparent-03.png"
                alt={settings.business_name}
                className="pointer-events-none absolute left-0 top-1/2 h-[380%] w-auto max-w-none -translate-y-1/2 select-none sm:h-[420%]"
                draggable={false}
              />
            </div>
            {settings.tagline && (
              <p className="mt-1.5 text-xs text-white/60">{settings.tagline}</p>
            )}
            {settings.address && (
              <div className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-white/70">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Quick Links</h4>
            <ul className="mt-2.5 space-y-1">
              {[
                { to: '/products', label: 'Products' },
                { to: '/categories', label: 'Categories' },
                { to: '/gift-box', label: 'Gift Box' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQ' },
                { to: '/safety', label: 'Safety Guide' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs text-white/70 transition hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Contact</h4>
            <ul className="mt-2.5 space-y-1.5">
              {settings.phone && (
                <li>
                  <a href={buildTelUrl(settings.phone)} className="flex items-center gap-1.5 text-xs text-white/70 transition hover:text-gold-400">
                    <Phone className="h-3.5 w-3.5 text-gold-500" />
                    {formatDisplayPhone(settings.phone)}
                  </a>
                </li>
              )}
              {whatsappNumbers.map((number) => (
                <li key={number}>
                  <a
                    href={buildWhatsAppContactUrl(number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-white/70 transition hover:text-gold-400"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-gold-500" />
                    WhatsApp {formatDisplayPhone(number)}
                  </a>
                </li>
              ))}
              {settings.email && (
                <li>
                  <a href={buildMailtoUrl(settings.email)} className="flex items-center gap-1.5 text-xs text-white/70 transition hover:text-gold-400">
                    <Mail className="h-3.5 w-3.5 text-gold-500" />
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Business Hours</h4>
            <ul className="mt-2.5 space-y-1 text-xs text-white/70">
              <li className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold-500" />
                Open 24/7
              </li>
              {settings.business_hours.weekdays && (
                <li>{settings.business_hours.weekdays}</li>
              )}
            </ul>
          </div>
        </div>

        <FooterSocialShare />

        <div className="mt-5 space-y-2 border-t border-white/10 pt-4 sm:mt-6 sm:pt-5">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-3">
            <p className="text-xs text-white/50">
              &copy; {currentYear} {settings.business_name}. All rights reserved.
            </p>
            <div className="flex gap-3 text-xs text-white/50">
              <Link to="/privacy" className="hover:text-gold-400">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold-400">Terms &amp; Conditions</Link>
            </div>
          </div>
          <p className="text-center text-xs text-white/35 sm:text-left">
            {DEVELOPER_CREDIT.label}{' '}
            {DEVELOPER_CREDIT.url ? (
              <a
                href={DEVELOPER_CREDIT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white/50 transition hover:text-gold-400/80"
              >
                {DEVELOPER_CREDIT.name}
              </a>
            ) : (
              <span className="font-semibold text-white/50">{DEVELOPER_CREDIT.name}</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { HelpCircle, MessageCircle, Truck, FileText, Shield, ExternalLink } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AccountPageHeader, MenuLink, MenuSection } from '@/components/customer/account/AccountUI'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'

export function HelpSupportPage() {
  const { settings } = useSettings()
  const whatsappNumbers = getWhatsAppNumbers(settings)
  const whatsappUrl = whatsappNumbers[0]
    ? buildWhatsAppUrl(whatsappNumbers[0], 'Hi Aura Crackers, I need help with my enquiry.')
    : '/contact'

  return (
    <>
      <SEO title="Help & Support" description="Get help with enquiries, delivery, and your account." noIndex />

      <AccountPageHeader backTo="/account" subtitle="Help & Support" />

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-navy-700/65">
          Need assistance? Message us on WhatsApp for quotes, bulk orders, and delivery across India.
        </p>

        <MenuSection title="Get Help">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition hover:bg-navy-900/[0.03]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-navy-900">WhatsApp Support</span>
              <span className="mt-0.5 block text-xs text-navy-700/55">Chat with us 24/7</span>
            </span>
            <ExternalLink className="h-4 w-4 text-navy-700/30" />
          </a>
          <MenuLink to="/contact" icon={<HelpCircle className="h-5 w-5 text-navy-700" />} label="Contact Support" />
          <MenuLink to="/faq" icon={<HelpCircle className="h-5 w-5 text-navy-700" />} label="FAQ" />
        </MenuSection>

        <MenuSection title="Information">
          <MenuLink
            to="/about"
            icon={<Truck className="h-5 w-5 text-navy-700" />}
            label="Delivery Information"
            description="Delivery areas across India"
          />
          <Link
            to="/safety"
            className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition hover:bg-navy-900/[0.03]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900/[0.04]">
              <FileText className="h-5 w-5 text-navy-700" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-navy-900">Terms & Safety</span>
              <span className="mt-0.5 block text-xs text-navy-700/55">Safety guidelines and terms</span>
            </span>
            <span className="text-navy-700/30">›</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition hover:bg-navy-900/[0.03]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900/[0.04]">
              <Shield className="h-5 w-5 text-navy-700" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-navy-900">Privacy Policy</span>
              <span className="mt-0.5 block text-xs text-navy-700/55">How we handle your data</span>
            </span>
            <span className="text-navy-700/30">›</span>
          </Link>
        </MenuSection>
      </div>
    </>
  )
}

import { MessageCircle, Phone } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl, buildTelUrl } from '@/lib/whatsapp'

export function FloatingActionButtons({ embedded = false }: { embedded?: boolean }) {
  const { settings } = useSettings()

  const whatsappUrl = settings.whatsapp_number
    ? buildWhatsAppContactUrl(settings.whatsapp_number, 'Hello! I would like to enquire about your products.')
    : null

  const instagramUrl = settings.social_links.instagram

  if (!whatsappUrl && !settings.phone && !instagramUrl) return null

  const buttons = (
    <>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 animate-scale-in"
          aria-label="WhatsApp"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        </a>
      )}

      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-scale-in [animation-delay:100ms]"
          aria-label="Instagram"
          title="Follow on Instagram"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      )}

      {settings.phone && (
        <a
          href={buildTelUrl(settings.phone)}
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 hover:bg-navy-700 hover:shadow-xl animate-scale-in [animation-delay:200ms]"
          aria-label="Call us"
          title="Call us"
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
    </>
  )

  if (embedded) return buttons

  return (
    <div className="fixed bottom-6 right-4 z-30 flex flex-col gap-3 sm:bottom-8 sm:right-6">
      {buttons}
    </div>
  )
}

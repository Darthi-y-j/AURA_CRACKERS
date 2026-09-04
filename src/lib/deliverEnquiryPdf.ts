import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { downloadPdfBlob } from '@/lib/cartEnquiryPdf'

export type MobileDeliveryResult = 'shared' | 'fallback' | 'cancelled'

/** Open WhatsApp with a pre-filled message (desktop flow). */
export function openWhatsAppChat(whatsappNumber: string, message: string): void {
  const url = buildWhatsAppUrl(whatsappNumber, message)
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Mobile: share PDF + message via the system share sheet (pick WhatsApp).
 * Falls back to PDF download + WhatsApp link if share is unavailable.
 */
export async function deliverMobileEnquiryWithPdf(params: {
  blob: Blob
  filename: string
  message: string
  whatsappNumber: string
}): Promise<MobileDeliveryResult> {
  const file = new File([params.blob], params.filename, { type: 'application/pdf' })
  const shareData: ShareData = {
    files: [file],
    text: params.message,
    title: 'Aura Crackers Order',
  }

  if (navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData)
      return 'shared'
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return 'cancelled'
      }
    }
  }

  downloadPdfBlob(params.blob, params.filename)
  openWhatsAppChat(params.whatsappNumber, params.message)
  return 'fallback'
}

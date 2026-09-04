import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { downloadPdfBlob } from '@/lib/cartEnquiryPdf'

export type PdfDeliveryResult = 'opened'

/** Open WhatsApp in a tab/window opened during the click handler (avoids popup blockers). */
export function openWhatsAppInTab(tab: Window | null, whatsappNumber: string, message: string): void {
  const url = buildWhatsAppUrl(whatsappNumber, message)

  if (tab && !tab.closed) {
    tab.location.href = url
    return
  }

  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Download the enquiry PDF and navigate the pre-opened tab to WhatsApp.
 * The tab must be opened synchronously in the click handler before any await.
 */
export function deliverEnquiryWithPdf(params: {
  blob: Blob
  filename: string
  whatsappNumber: string
  message: string
  whatsappTab: Window | null
}): PdfDeliveryResult {
  downloadPdfBlob(params.blob, params.filename)
  openWhatsAppInTab(params.whatsappTab, params.whatsappNumber, params.message)
  return 'opened'
}

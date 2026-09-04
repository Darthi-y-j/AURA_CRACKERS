import type { EnquiryFormData, CartEnquiryFormData, CartItem, Enquiry } from '@/types/database'
import { enquiryToPdfData } from '@/lib/cartEnquiryPdf'
import { cleanPhone } from './utils'
import { formatPrice } from './utils'

function buildCartItemsList(items: CartItem[]): string {
  const lines: string[] = []
  let index = 0

  items.forEach((item) => {
    index++
    const total =
      item.price != null ? formatPrice(item.price * item.quantity) ?? '-' : '-'

    lines.push(`${index}. ${item.productName}`)
    lines.push(`   Qty: ${item.quantity}  •  Total: ${total}`)

    if (item.isGiftBox && item.giftBoxItems?.length) {
      item.giftBoxItems.forEach((inner) => {
        lines.push(`   ↳ ${inner.productName} × ${inner.quantity}`)
      })
    }
  })

  const pricedTotal = items.reduce((sum, item) => {
    if (item.price == null) return sum
    return sum + item.price * item.quantity
  }, 0)

  const totalLabel = pricedTotal > 0 ? formatPrice(pricedTotal) : null
  if (totalLabel) {
    lines.push('', `*Est. Total: ${totalLabel}*`)
  }

  return lines.join('\n')
}

export function buildWhatsAppEnquiryMessage(data: EnquiryFormData): string {
  const lines = [
    'Hello,',
    '',
    'I am interested in the following product:',
    '',
    `Product: ${data.productName}`,
    `Quantity: ${data.quantity}`,
    '',
    `Customer Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Address: ${data.customerAddress}`,
  ]

  if (data.customerMessage?.trim()) {
    lines.push('', 'Message:', data.customerMessage.trim())
  }

  lines.push('', 'Thank you.')
  return lines.join('\n')
}

export function buildCartWhatsAppMessage(data: CartEnquiryFormData): string {
  const lines = [
    'Hello,',
    '',
    'I am interested in the following products:',
    '',
    buildCartItemsList(data.items),
    '',
    '*— Customer Details —*',
  ]

  if (data.authUserId) {
    lines.push('✓ Logged-in registered customer')
  }

  lines.push(
    `*Name:* ${data.customerName}`,
    `*Phone:* ${data.customerPhone}`,
    `*Address:* ${data.customerAddress}`,
  )

  if (data.customerEmail?.trim()) {
    lines.push(`*Email:* ${data.customerEmail.trim()}`)
  }

  if (data.customerMessage?.trim()) {
    lines.push('', '*Message:*', data.customerMessage.trim())
  }

  if (data.spinReward?.label) {
    lines.push('', '*— Spin to Win —*', `Reward: ${data.spinReward.label}`)
    if (data.spinReward.discountAmount && data.spinReward.discountAmount > 0) {
      lines.push(`Discount applied: ${formatPrice(data.spinReward.discountAmount)}`)
    } else {
      lines.push('(Non-monetary reward — mention on WhatsApp to claim)')
    }
  }

  lines.push('', 'Thank you.')
  return lines.join('\n')
}

/** Rebuild the WhatsApp enquiry text from a stored enquiry (admin display only). */
export function buildEnquiryWhatsAppMessage(enquiry: Enquiry): string {
  return buildCartWhatsAppMessage(enquiryToPdfData(enquiry))
}

/** Same as WhatsApp message — for admin preview. */
export function buildEnquiryWhatsAppDisplay(enquiry: Enquiry): string {
  return buildEnquiryWhatsAppMessage(enquiry)
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleaned = cleanPhone(phoneNumber)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleaned}?text=${encoded}`
}

export function buildWhatsAppContactUrl(phoneNumber: string, message?: string): string {
  const cleaned = cleanPhone(phoneNumber)
  if (message) {
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
  }
  return `https://wa.me/${cleaned}`
}

export function buildTelUrl(phone: string): string {
  return `tel:${cleanPhone(phone)}`
}

export function buildMailtoUrl(email: string, subject?: string): string {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${params}`
}

export function cartItemToEnquiryItem(item: CartItem) {
  return {
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
  }
}

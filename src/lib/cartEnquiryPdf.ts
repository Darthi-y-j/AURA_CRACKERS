import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CartEnquiryFormData, Enquiry } from '@/types/database'
import { SITE_NAME } from '@/lib/siteConfig'
import { BUSINESS_ADDRESS } from '@/lib/businessInfo'
import { generateEnquiryNumber } from '@/lib/utils'

function formatPdfAmount(price: number | null | undefined): string {
  if (price == null) return '—'
  return `Rs. ${price.toLocaleString('en-IN')}`
}

export interface CartEnquiryPdfOptions {
  businessName: string
  businessPhone?: string
  enquiryNumber?: string
  estimatedTotal?: number
  spinDiscount?: number
}

export function downloadCartEnquiryPdf(data: CartEnquiryFormData, options: CartEnquiryPdfOptions): string {
  const enquiryNumber = options.enquiryNumber ?? generateEnquiryNumber()
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = margin

  const businessName = options.businessName || SITE_NAME

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(30, 27, 75)
  doc.text(businessName, margin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  y += 7
  const addressLines = doc.splitTextToSize(BUSINESS_ADDRESS.replace(/\n/g, ', '), pageWidth - margin * 2)
  doc.text(addressLines, margin, y)
  y += addressLines.length * 4

  if (options.businessPhone) {
    doc.text(`Phone: ${options.businessPhone}`, margin, y)
    y += 5
  }

  y += 4
  doc.setDrawColor(245, 158, 11)
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(30, 27, 75)
  doc.text('Order Enquiry / Estimate', margin, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  const now = new Date()
  doc.text(`Enquiry No: ${enquiryNumber}`, margin, y)
  doc.text(
    `Date: ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    pageWidth - margin,
    y,
    { align: 'right' },
  )
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(30, 27, 75)
  doc.text('Customer Details', margin, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)

  const customerLines: string[] = [
    `Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Address: ${data.customerAddress}`,
  ]
  if (data.customerEmail) {
    customerLines.push(`Email: ${data.customerEmail}`)
  }
  if (data.authUserId) {
    customerLines.push('Account: Registered customer (logged in)')
  }

  for (const line of customerLines) {
    const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2)
    doc.text(wrapped, margin, y)
    y += wrapped.length * 4.5
  }

  y += 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(30, 27, 75)
  doc.text('Order Items', margin, y)
  y += 2

  const tableBody: (string | number)[][] = []

  data.items.forEach((item, index) => {
    const lineTotal = item.price != null ? item.price * item.quantity : null
    tableBody.push([
      index + 1,
      item.productName,
      item.quantity,
      formatPdfAmount(item.price),
      formatPdfAmount(lineTotal),
    ])

    if (item.isGiftBox && item.giftBoxItems?.length) {
      item.giftBoxItems.forEach((inner) => {
        tableBody.push([
          '',
          `  • ${inner.productName}`,
          inner.quantity,
          inner.price != null ? formatPdfAmount(inner.price) : '—',
          '—',
        ])
      })
    }
  })

  autoTable(doc, {
    startY: y + 2,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Amount']],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: [40, 40, 40] },
    headStyles: {
      fillColor: [30, 27, 75],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
    },
    alternateRowStyles: { fillColor: [252, 250, 245] },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 8

  const subtotal = options.estimatedTotal ?? 0
  const spinDiscount = options.spinDiscount ?? data.spinReward?.discountAmount ?? 0
  const finalTotal = Math.max(0, subtotal - spinDiscount)
  const hasPricing = data.items.some((item) => item.price != null)

  if (hasPricing && subtotal > 0) {
    const totalsX = pageWidth - margin - 55
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    doc.text('Subtotal:', totalsX, y)
    doc.text(formatPdfAmount(subtotal), pageWidth - margin, y, { align: 'right' })
    y += 5

    if (data.spinReward) {
      doc.setTextColor(234, 88, 12)
      doc.text(`Spin to Win (${data.spinReward.label}):`, totalsX, y)
      if (spinDiscount > 0) {
        doc.text(`- ${formatPdfAmount(spinDiscount)}`, pageWidth - margin, y, { align: 'right' })
      } else {
        doc.text('Applied', pageWidth - margin, y, { align: 'right' })
      }
      y += 5
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(30, 27, 75)
    doc.text('Estimated Total:', totalsX, y)
    doc.text(formatPdfAmount(finalTotal), pageWidth - margin, y, { align: 'right' })
    y += 10
  } else if (data.spinReward) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(234, 88, 12)
    doc.text(`Spin to Win reward: ${data.spinReward.label}`, margin, y)
    y += 8
  }

  if (data.customerMessage?.trim()) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(30, 27, 75)
    doc.text('Customer Message', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const msgLines = doc.splitTextToSize(data.customerMessage.trim(), pageWidth - margin * 2)
    doc.text(msgLines, margin, y)
    y += msgLines.length * 4.5 + 4
  }

  const footerY = Math.max(y + 6, doc.internal.pageSize.getHeight() - 22)
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, footerY, pageWidth - margin, footerY)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  const disclaimer = doc.splitTextToSize(
    'This document is an enquiry estimate for billing reference. Final price, stock availability, and delivery charges will be confirmed on WhatsApp. Not a tax invoice.',
    pageWidth - margin * 2,
  )
  doc.text(disclaimer, margin, footerY + 5)

  const filename = `${enquiryNumber.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`
  doc.save(filename)
  return enquiryNumber
}

function parseStoredEnquiryMessage(message: string | null): {
  customerAddress: string
  customerMessage?: string
  spinReward?: { label: string; discountAmount?: number }
} {
  if (!message?.trim()) {
    return { customerAddress: '' }
  }

  let customerAddress = ''
  let customerMessage: string | undefined
  let spinReward: { label: string; discountAmount?: number } | undefined

  const addressMatch = message.match(/Delivery Address:\n([\s\S]*?)(?:\n\n|$)/)
  if (addressMatch) {
    customerAddress = addressMatch[1].trim()
  }

  const spinLabelMatch = message.match(/Spin to Win: (.+)/)
  if (spinLabelMatch) {
    const label = spinLabelMatch[1].trim()
    const discountMatch = message.match(/Spin discount: Rs\. (\d+)/)
    spinReward = {
      label,
      discountAmount: discountMatch ? Number(discountMatch[1]) : undefined,
    }
  }

  const messageMatch = message.match(/Message:\n([\s\S]*)$/)
  if (messageMatch) {
    customerMessage = messageMatch[1].trim()
  } else if (!addressMatch && !spinLabelMatch) {
    customerAddress = message.trim()
  }

  return { customerAddress, customerMessage, spinReward }
}

export function enquiryToPdfData(enquiry: Enquiry): CartEnquiryFormData {
  const parsed = parseStoredEnquiryMessage(enquiry.customer_message)
  const items =
    enquiry.items?.length > 0
      ? enquiry.items.map((item) => ({
          productId: item.product_id,
          productName: item.product_name,
          slug: '',
          imageUrl: null,
          price: item.price,
          quantity: item.quantity,
        }))
      : enquiry.product_id
        ? [
            {
              productId: enquiry.product_id,
              productName: enquiry.product_name,
              slug: '',
              imageUrl: null,
              price: null,
              quantity: enquiry.quantity,
            },
          ]
        : []

  return {
    items,
    customerName: enquiry.customer_name,
    customerPhone: enquiry.customer_phone,
    customerAddress: parsed.customerAddress,
    customerMessage: parsed.customerMessage,
    customerEmail: enquiry.customer_email ?? undefined,
    authUserId: enquiry.auth_user_id ?? undefined,
    spinReward: parsed.spinReward,
  }
}

export function downloadEnquiryPdf(enquiry: Enquiry, options: CartEnquiryPdfOptions): string {
  const data = enquiryToPdfData(enquiry)
  const estimatedTotal = data.items.reduce((sum, item) => {
    if (item.price == null) return sum
    return sum + item.price * item.quantity
  }, 0)
  const spinDiscount = data.spinReward?.discountAmount ?? 0

  return downloadCartEnquiryPdf(data, {
    ...options,
    enquiryNumber: enquiry.enquiry_number,
    estimatedTotal,
    spinDiscount,
  })
}

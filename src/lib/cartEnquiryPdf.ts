import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CartEnquiryFormData, Enquiry } from '@/types/database'
import { formatPackagingShort } from '@/lib/productPackaging'
import { PDF_LOGO_PATH, SITE_NAME, SITE_WORDMARK_PATH } from '@/lib/siteConfig'
import { BUSINESS_ADDRESS } from '@/lib/businessInfo'
import { generateEnquiryNumber } from '@/lib/utils'

const BRAND_ORANGE: [number, number, number] = [234, 88, 12]
const BRAND_GOLD: [number, number, number] = [255, 204, 0]
const NAVY: [number, number, number] = [30, 27, 75]
const SPIN_HIGHLIGHT: [number, number, number] = [255, 247, 237]
const PDF_FONT = 'helvetica'

function formatPdfAmount(price: number | null | undefined): string {
  if (price == null) return '-'
  return `Rs. ${price.toLocaleString('en-IN')}`
}

function setHeadingFont(doc: jsPDF, size: number): void {
  doc.setFont(PDF_FONT, 'bold')
  doc.setFontSize(size)
}

function setBodyFont(doc: jsPDF, style: 'normal' | 'bold' | 'italic' = 'normal', size = 9): void {
  doc.setFont(PDF_FONT, style)
  doc.setFontSize(size)
}

async function loadImageDataUrl(
  path: string,
): Promise<{ dataUrl: string; format: 'PNG' | 'JPEG' } | null> {
  try {
    const response = await fetch(encodeURI(path))
    if (!response.ok) return null
    const blob = await response.blob()
    const format: 'PNG' | 'JPEG' = blob.type.includes('png') ? 'PNG' : 'JPEG'
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return { dataUrl, format }
  } catch {
    return null
  }
}

function loadHtmlImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

/** Trim empty padding from the wordmark PNG so PDF scaling keeps correct proportions. */
async function loadWordmarkForPdf(
  path: string,
): Promise<{ dataUrl: string; aspectRatio: number } | null> {
  const loaded = await loadImageDataUrl(path)
  if (!loaded) return null

  try {
    const img = await loadHtmlImage(loaded.dataUrl)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const i = (py * width + px) * 4
        const r = data[i]!
        const g = data[i + 1]!
        const b = data[i + 2]!
        const a = data[i + 3]!
        if (a > 20 && r + g + b > 40) {
          minX = Math.min(minX, px)
          minY = Math.min(minY, py)
          maxX = Math.max(maxX, px)
          maxY = Math.max(maxY, py)
        }
      }
    }

    if (maxX <= minX || maxY <= minY) return null

    const pad = Math.round(Math.min(width, height) * 0.02)
    const cropX = Math.max(0, minX - pad)
    const cropY = Math.max(0, minY - pad)
    const cropW = Math.min(width - cropX, maxX - minX + 1 + pad * 2)
    const cropH = Math.min(height - cropY, maxY - minY + 1 + pad * 2)

    const out = document.createElement('canvas')
    out.width = cropW
    out.height = cropH
    const outCtx = out.getContext('2d')
    if (!outCtx) return null
    outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

    return {
      dataUrl: out.toDataURL('image/png'),
      aspectRatio: cropW / cropH,
    }
  } catch {
    return null
  }
}

function formatProductLabel(
  name: string,
  pieces?: number | null,
  packaging?: CartEnquiryFormData['items'][number]['packaging'],
): string {
  const packagingLabel = formatPackagingShort(packaging ?? null, pieces)
  if (packagingLabel) {
    return `${name} (${packagingLabel})`
  }
  return name
}

function drawSpinRewardCallout(
  doc: jsPDF,
  margin: number,
  pageWidth: number,
  y: number,
  label: string,
): number {
  const boxWidth = pageWidth - margin * 2
  const boxHeight = 18
  const boxY = y

  doc.setFillColor(...SPIN_HIGHLIGHT)
  doc.setDrawColor(...BRAND_GOLD)
  doc.setLineWidth(0.5)
  doc.roundedRect(margin, boxY, boxWidth, boxHeight, 2, 2, 'FD')

  setHeadingFont(doc, 9)
  doc.setTextColor(...BRAND_ORANGE)
  doc.text('Spin to Win — FREE GIFT', margin + 4, boxY + 7)

  setBodyFont(doc, 'bold', 10)
  doc.setTextColor(120, 53, 15)
  doc.text(label, margin + 4, boxY + 14)

  setBodyFont(doc, 'italic', 8)
  doc.setTextColor(...BRAND_ORANGE)
  doc.text('Included with your order', pageWidth - margin - 4, boxY + 14, { align: 'right' })

  return boxY + boxHeight + 6
}

async function drawPdfBrandHeader(
  doc: jsPDF,
  margin: number,
  pageWidth: number,
  options: CartEnquiryPdfOptions,
): Promise<number> {
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const [logo, wordmark] = await Promise.all([
    loadImageDataUrl(PDF_LOGO_PATH),
    loadWordmarkForPdf(SITE_WORDMARK_PATH),
  ])

  const businessName = (options.businessName || SITE_NAME).toUpperCase()
  const logoSize = 22
  const logoGap = 4
  const wordmarkX = margin + logoSize + logoGap

  if (logo) {
    doc.addImage(logo.dataUrl, logo.format, margin, y, logoSize, logoSize)
  }

  if (wordmark) {
    const wordmarkHeight = 11
    const wordmarkWidth = wordmarkHeight * wordmark.aspectRatio
    const wordmarkY = y + (logoSize - wordmarkHeight) / 2
    doc.addImage(wordmark.dataUrl, 'PNG', wordmarkX, wordmarkY, wordmarkWidth, wordmarkHeight)
  } else {
    setHeadingFont(doc, 16)
    doc.setTextColor(...BRAND_ORANGE)
    doc.text(businessName, logo ? wordmarkX : margin, y + logoSize / 2 + 2)
  }

  y += logoSize + 4

  setBodyFont(doc, 'normal', 9)
  doc.setTextColor(80, 80, 80)
  const addressLines = doc.splitTextToSize(BUSINESS_ADDRESS.replace(/\n/g, ', '), contentWidth)
  doc.text(addressLines, margin, y)
  y += addressLines.length * 4

  if (options.businessPhone) {
    doc.text(`Phone: ${options.businessPhone}`, margin, y)
    y += 5
  }

  y += 4
  doc.setDrawColor(...BRAND_ORANGE)
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageWidth - margin, y)
  return y + 8
}

export interface CartEnquiryPdfOptions {
  businessName: string
  businessPhone?: string
  enquiryNumber?: string
  estimatedTotal?: number
  spinDiscount?: number
}

export interface CartEnquiryPdfResult {
  enquiryNumber: string
  filename: string
  blob: Blob
}

export async function generateCartEnquiryPdfBlob(
  data: CartEnquiryFormData,
  options: CartEnquiryPdfOptions,
): Promise<CartEnquiryPdfResult> {
  const enquiryNumber = options.enquiryNumber ?? generateEnquiryNumber()
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14

  let y = await drawPdfBrandHeader(doc, margin, pageWidth, options)

  setHeadingFont(doc, 13)
  doc.setTextColor(...NAVY)
  doc.text('Order Enquiry / Estimate', margin, y)
  y += 7

  setBodyFont(doc, 'normal', 9)
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

  setHeadingFont(doc, 11)
  doc.setTextColor(...NAVY)
  doc.text('Customer Details', margin, y)
  y += 6

  setBodyFont(doc, 'normal', 9)
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
  setHeadingFont(doc, 11)
  doc.setTextColor(...NAVY)
  doc.text('Order Items', margin, y)
  y += 2

  const tableBody: (string | number)[][] = []

  data.items.forEach((item, index) => {
    const lineTotal = item.price != null ? item.price * item.quantity : null
    tableBody.push([
      index + 1,
      formatProductLabel(item.productName, item.pieces, item.packaging),
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
          inner.price != null ? formatPdfAmount(inner.price) : '-',
          '-',
        ])
      })
    }
  })

  if (data.spinReward?.label) {
    tableBody.push([
      '',
      `* Spin to Win Gift: ${data.spinReward.label}`,
      1,
      'FREE',
      'FREE',
    ])
  }

  const spinRowIndex = data.spinReward?.label ? tableBody.length - 1 : -1

  setBodyFont(doc, 'normal', 8.5)

  autoTable(doc, {
    startY: y + 2,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Amount']],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      font: PDF_FONT,
      fontStyle: 'normal',
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
    },
    headStyles: {
      font: PDF_FONT,
      fontStyle: 'bold',
      fillColor: NAVY,
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
    },
    alternateRowStyles: { fillColor: [252, 250, 245] },
    didParseCell: (hookData) => {
      if (spinRowIndex >= 0 && hookData.section === 'body' && hookData.row.index === spinRowIndex) {
        hookData.cell.styles.fillColor = SPIN_HIGHLIGHT
        hookData.cell.styles.textColor = [120, 53, 15]
        hookData.cell.styles.fontStyle = 'bold'
        if (hookData.column.index === 1) {
          hookData.cell.styles.textColor = BRAND_ORANGE
        }
      }
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 8

  const subtotal = options.estimatedTotal ?? 0
  const spinDiscount = options.spinDiscount ?? data.spinReward?.discountAmount ?? 0
  const finalTotal = Math.max(0, subtotal - spinDiscount)
  const hasPricing = data.items.some((item) => item.price != null)

  if (data.spinReward) {
    y = drawSpinRewardCallout(doc, margin, pageWidth, y, data.spinReward.label)
  }

  if (hasPricing && subtotal > 0) {
    const totalsBoxY = y
    const totalsBoxWidth = 70
    const totalsBoxX = pageWidth - margin - totalsBoxWidth
    const totalsBoxHeight = spinDiscount > 0 ? 22 : 14

    doc.setFillColor(252, 250, 245)
    doc.setDrawColor(...BRAND_ORANGE)
    doc.setLineWidth(0.3)
    doc.roundedRect(totalsBoxX, totalsBoxY, totalsBoxWidth, totalsBoxHeight, 2, 2, 'FD')

    const totalsX = totalsBoxX + 4
    let totalsY = totalsBoxY + 6

    setBodyFont(doc, 'normal', 9)
    doc.setTextColor(50, 50, 50)
    doc.text('Subtotal:', totalsX, totalsY)
    doc.text(formatPdfAmount(subtotal), pageWidth - margin - 4, totalsY, { align: 'right' })
    totalsY += 6

    if (spinDiscount > 0) {
      doc.setTextColor(...BRAND_ORANGE)
      doc.text('Spin Discount:', totalsX, totalsY)
      doc.text(`- ${formatPdfAmount(spinDiscount)}`, pageWidth - margin - 4, totalsY, { align: 'right' })
      totalsY += 6
    }

    setHeadingFont(doc, 11)
    doc.setTextColor(...NAVY)
    doc.text('Total:', totalsX, totalsY)
    doc.text(formatPdfAmount(finalTotal), pageWidth - margin - 4, totalsY, { align: 'right' })
    y = totalsBoxY + totalsBoxHeight + 8
  }

  if (data.customerMessage?.trim()) {
    setHeadingFont(doc, 10)
    doc.setTextColor(...NAVY)
    doc.text('Customer Message', margin, y)
    y += 5
    setBodyFont(doc, 'normal', 9)
    doc.setTextColor(50, 50, 50)
    const msgLines = doc.splitTextToSize(data.customerMessage.trim(), pageWidth - margin * 2)
    doc.text(msgLines, margin, y)
    y += msgLines.length * 4.5 + 4
  }

  const footerY = Math.max(y + 6, doc.internal.pageSize.getHeight() - 22)
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, footerY, pageWidth - margin, footerY)
  setBodyFont(doc, 'italic', 8)
  doc.setTextColor(120, 120, 120)
  const disclaimer = doc.splitTextToSize(
    'This document is an enquiry estimate for billing reference. Final price, stock availability, and delivery charges will be confirmed on WhatsApp. Not a tax invoice.',
    pageWidth - margin * 2,
  )
  doc.text(disclaimer, margin, footerY + 5)

  const filename = `${enquiryNumber.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`
  const blob = doc.output('blob')
  return { enquiryNumber, filename, blob }
}

export function downloadPdfBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function downloadCartEnquiryPdf(
  data: CartEnquiryFormData,
  options: CartEnquiryPdfOptions,
): Promise<string> {
  const { blob, filename, enquiryNumber } = await generateCartEnquiryPdfBlob(data, options)
  downloadPdfBlob(blob, filename)
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

export async function downloadEnquiryPdf(
  enquiry: Enquiry,
  options: CartEnquiryPdfOptions,
): Promise<string> {
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

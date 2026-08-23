import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2,
  ShoppingBag,
  MessageCircle,
  Loader2,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  Package,
  Gift,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { QuantitySelector } from '@/components/customer/QuantitySelector'
import { EmptyState } from '@/components/customer/EmptyState'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { createCartEnquiry } from '@/services/enquiries'
import { buildCartWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatPrice, getImageUrl, validatePhone, cn } from '@/lib/utils'
import { formatDisplayPhone } from '@/lib/businessInfo'

const inputClass =
  'w-full rounded-xl border border-navy-900/10 bg-cream-50/80 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-700/40 transition focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20'

export function CartPage() {
  const { items, itemCount, updateQuantity, removeItem, clearCart } = useCart()
  const { settings } = useSettings()
  const { showToast } = useToast()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerMessage, setCustomerMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const estimatedTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.price == null) return sum
        return sum + item.price * item.quantity
      }, 0),
    [items],
  )

  const hasPricedItems = items.some((item) => item.price != null)

  const handleSendEnquiry = async () => {
    if (items.length === 0) {
      showToast('Your cart is empty', 'error')
      return
    }

    if (!customerName.trim()) {
      showToast('Please enter your name', 'error')
      return
    }

    if (!validatePhone(customerPhone)) {
      showToast('Please enter a valid phone number', 'error')
      return
    }

    if (!settings.whatsapp_number) {
      showToast('WhatsApp contact is not configured. Please call us instead.', 'error')
      return
    }

    setLoading(true)

    const formData = {
      items,
      customerName: customerName.trim(),
      customerPhone,
      customerMessage,
    }

    try {
      const { error } = await createCartEnquiry(formData)

      if (error) {
        showToast('Could not save enquiry. Opening WhatsApp anyway...', 'info')
      }

      const message = buildCartWhatsAppMessage(formData)
      const url = buildWhatsAppUrl(settings.whatsapp_number, message)
      window.open(url, '_blank', 'noopener,noreferrer')
      clearCart()
      setCustomerName('')
      setCustomerPhone('')
      setCustomerMessage('')
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" />
        <EmptyState
          title="Your cart is empty"
          description="Browse our catalogue and add products to send a combined enquiry on WhatsApp."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-6 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition hover:brightness-105"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Products
              </Link>
              <Link
                to="/gift-box"
                className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 bg-white px-6 py-2.5 text-sm font-bold text-navy-900 transition hover:border-gold-400"
              >
                <Gift className="h-4 w-4 text-gold-500" />
                Build a Gift Box
              </Link>
            </div>
          }
        />
      </>
    )
  }

  return (
    <>
      <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" />

      <div className="bg-cream-50 pb-28 sm:pb-8">
        <div className="border-b border-navy-900/10 bg-navy-950">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Your Selection</p>
                <h1 className="mt-2 font-display text-3xl font-bold text-cream-50 sm:text-4xl">Cart & Enquiry</h1>
                <p className="mt-2 max-w-xl text-sm text-cream-100/70">
                  Review your items and send everything in one WhatsApp message — no payment online.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold tabular-nums text-gold-300">{itemCount}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-cream-100/50">
                    Item{itemCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Remove all items from your cart?')) clearCart()
                  }}
                  className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-cream-100/70 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
                  <Package className="h-5 w-5 text-gold-500" />
                  Selected Products
                </h2>
                <div className="flex items-center gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-500"
                  >
                    Add more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/gift-box"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-500"
                  >
                    <Gift className="h-3.5 w-3.5" />
                    Gift box
                  </Link>
                </div>
              </div>

              {items.map((item, index) => {
                const lineTotal = item.price != null ? item.price * item.quantity : null
                const isGiftBox = Boolean(item.isGiftBox)
                const image = (
                  <div className="relative shrink-0">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.productName}
                      className="h-24 w-24 rounded-xl object-cover ring-1 ring-navy-900/8 transition group-hover:ring-gold-400/30 sm:h-28 sm:w-28"
                    />
                    <span className="absolute -left-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-1.5 text-[10px] font-bold text-navy-950 shadow-md">
                      {item.quantity}
                    </span>
                    {isGiftBox && (
                      <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy-950 text-gold-400 ring-2 ring-white">
                        <Gift className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                )

                return (
                  <div
                    key={item.productId}
                    className="group flex gap-4 rounded-2xl border border-navy-900/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(12,8,6,0.04),0_8px_24px_rgba(12,8,6,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-gold-500/20 hover:shadow-[0_12px_32px_rgba(12,8,6,0.08)] sm:p-5"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {isGiftBox ? image : (
                      <Link to={`/products/${item.slug}`} className="relative shrink-0">
                        {image}
                      </Link>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        {isGiftBox ? (
                          <p className="line-clamp-2 font-display text-base font-bold text-navy-900 sm:text-lg">
                            {item.productName}
                          </p>
                        ) : (
                          <Link
                            to={`/products/${item.slug}`}
                            className="line-clamp-2 font-display text-base font-bold text-navy-900 transition hover:text-gold-600 sm:text-lg"
                          >
                            {item.productName}
                          </Link>
                        )}
                        {item.price != null && (
                          <p className="mt-1 text-sm text-navy-700/60">{formatPrice(item.price)} each</p>
                        )}
                        {isGiftBox && item.giftBoxItems && item.giftBoxItems.length > 0 && (
                          <ul className="mt-2 space-y-1 rounded-xl bg-cream-50 px-3 py-2">
                            {item.giftBoxItems.map((inner) => (
                              <li
                                key={inner.productId}
                                className="flex items-center justify-between gap-2 text-xs text-navy-700/70"
                              >
                                <span className="truncate">{inner.productName}</span>
                                <span className="shrink-0 font-semibold">× {inner.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {lineTotal != null && (
                          <p className="mt-2 text-sm font-semibold text-festive-600">
                            Line total: {formatPrice(lineTotal)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.productId, qty)}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="rounded-xl border border-transparent p-2.5 text-navy-700/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {hasPricedItems && (
                <div className="rounded-2xl border border-gold-500/20 bg-gradient-to-r from-gold-500/10 via-cream-50 to-festive-500/5 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-navy-700/70">Estimated total</span>
                    <span className="font-display text-xl font-bold text-navy-900">{formatPrice(estimatedTotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-navy-700/50">
                    Final price confirmed on WhatsApp — festival discounts may apply.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-navy-900/[0.07] bg-white shadow-[0_1px_2px_rgba(12,8,6,0.04),0_16px_40px_rgba(12,8,6,0.08)]">
                <div className="border-b border-navy-900/8 bg-gradient-to-r from-navy-950 to-navy-900 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 ring-1 ring-gold-400/25">
                      <MessageCircle className="h-5 w-5 text-gold-400" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-cream-50">Send Enquiry</h2>
                      <p className="text-xs text-cream-100/55">One tap to WhatsApp</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-sm leading-relaxed text-navy-700/70">
                    Fill in your details and we&apos;ll open WhatsApp with your full order list ready to send.
                  </p>
                  {settings.whatsapp_number && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-medium text-[#128C7E]">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {formatDisplayPhone(settings.whatsapp_number)}
                    </p>
                  )}

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                        <User className="h-3.5 w-3.5 text-gold-500" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                        <Phone className="h-3.5 w-3.5 text-gold-500" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-800">Message (optional)</label>
                      <textarea
                        value={customerMessage}
                        onChange={(e) => setCustomerMessage(e.target.value)}
                        placeholder="Delivery area, event date, bulk quantity…"
                        rows={3}
                        className={cn(inputClass, 'resize-none')}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendEnquiry}
                    disabled={loading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/35 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <MessageCircle className="h-5 w-5" />
                    )}
                    Send Enquiry on WhatsApp
                  </button>

                  <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-navy-700/50">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-gold-500" />
                    This is an enquiry only — not online payment. Our team confirms price &amp; stock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

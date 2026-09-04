import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2,
  ShoppingBag,
  MessageCircle,
  Loader2,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Package,
  Gift,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { TitleHighlight } from '@/components/customer/TitleHighlight'
import { WaveDivider } from '@/components/customer/WaveDivider'
import { ProductImage } from '@/components/customer/ProductImage'
import { QuantitySelector } from '@/components/customer/QuantitySelector'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { SpinToWinWheel } from '@/components/customer/SpinToWinWheel'
import { createCartEnquiry } from '@/services/enquiries'
import { buildCartWhatsAppMessage } from '@/lib/whatsapp'
import { generateCartEnquiryPdfBlob } from '@/lib/cartEnquiryPdf'
import { deliverEnquiryWithPdf } from '@/lib/deliverEnquiryPdf'
import { generateEnquiryNumber } from '@/lib/utils'
import type { SpinReward } from '@/lib/spinToWin'
import type { CartEnquiryFormData } from '@/types/database'
import { getCurrentDeliveryAddress, geolocationErrorMessage } from '@/lib/geolocation'
import {
  buildFullDeliveryAddress,
  emptyAddressFields,
  validateDeliveryAddress,
  type DeliveryAddressFields,
} from '@/lib/deliveryAddress'
import { formatPrice, validatePhone, cn } from '@/lib/utils'
import { formatDisplayPhone } from '@/lib/businessInfo'
import type { CartItem } from '@/types/database'

const HERO_BG = '/contact-section-bg.webp'
const HERO_BG_FALLBACK = '/contact-section-bg.png'

const inputClass =
  'w-full rounded-xl border border-navy-900/10 bg-cream-50/80 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-700/40 transition focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20'

const trustPoints = [
  { icon: ShieldCheck, label: 'No online payment' },
  { icon: MessageCircle, label: 'WhatsApp enquiry' },
  { icon: Truck, label: 'Delivery across India' },
]

function CartItemCard({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  isLast,
}: {
  item: CartItem
  index: number
  onUpdateQuantity: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  isLast?: boolean
}) {
  const lineTotal = item.price != null ? item.price * item.quantity : null
  const isGiftBox = Boolean(item.isGiftBox)

  const title = isGiftBox ? (
    <p className="line-clamp-2 text-sm font-semibold leading-snug text-navy-900 sm:text-base">
      {item.productName}
    </p>
  ) : (
              <Link
      to={`/products/${item.slug}`}
      className="line-clamp-2 text-sm font-semibold leading-snug text-navy-900 transition hover:text-festive-600 sm:text-base"
    >
      {item.productName}
              </Link>
  )

                const image = (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-50 ring-1 ring-navy-900/8 sm:h-20 sm:w-20">
      <ProductImage src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                    {isGiftBox && (
        <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950 text-gold-400 ring-1 ring-white">
          <Gift className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                )

                return (
    <AnimateIn animation="fade-up" delay={40 + index * 30}>
      <article
        className={cn(
          'flex gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4',
          !isLast && 'border-b border-navy-900/[0.06]',
        )}
      >
        {isGiftBox ? image : <Link to={`/products/${item.slug}`}>{image}</Link>}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">{title}</div>
            {lineTotal != null ? (
              <p className="shrink-0 font-display text-base font-bold tabular-nums text-gold-700 sm:text-lg">
                {formatPrice(lineTotal)}
              </p>
            ) : item.price != null ? (
              <p className="shrink-0 font-display text-base font-bold tabular-nums text-gold-700 sm:text-lg">
                {formatPrice(item.price)}
              </p>
            ) : null}
          </div>

                        {isGiftBox && item.giftBoxItems && item.giftBoxItems.length > 0 && (
            <ul className="space-y-0.5 rounded-lg bg-cream-50 px-2.5 py-2 text-[11px] text-navy-700/75">
                            {item.giftBoxItems.map((inner) => (
                <li key={inner.productId} className="flex justify-between gap-2">
                                <span className="truncate">{inner.productName}</span>
                  <span className="shrink-0 font-medium">×{inner.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        )}

          <div className="flex items-center justify-between gap-2">
            {item.price != null && lineTotal != null && item.quantity > 1 ? (
              <span className="text-xs text-navy-700/55">{formatPrice(item.price)} each</span>
            ) : (
              <span className="text-xs text-navy-700/55">Qty {item.quantity}</span>
            )}
            <div className="flex items-center gap-1.5">
                        <QuantitySelector
                          value={item.quantity}
                onChange={(qty) => onUpdateQuantity(item.productId, qty)}
                compact
                className="w-auto shrink-0"
                        />
                        <button
                          type="button"
                onClick={() => onRemove(item.productId)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-navy-700/40 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
      </article>
    </AnimateIn>
  )
}

function EnquiryForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  addressFields,
  updateAddress,
  customerMessage,
  setCustomerMessage,
  locating,
  loading,
  isLoggedIn,
  customerEmail,
  settings,
  onUseLocation,
  onSendEnquiry,
  className,
}: {
  customerName: string
  setCustomerName: (v: string) => void
  customerPhone: string
  setCustomerPhone: (v: string) => void
  addressFields: DeliveryAddressFields
  updateAddress: (patch: Partial<DeliveryAddressFields>) => void
  customerMessage: string
  setCustomerMessage: (v: string) => void
  locating: boolean
  loading: boolean
  isLoggedIn: boolean
  customerEmail?: string
  settings: ReturnType<typeof useSettings>['settings']
  onUseLocation: () => void
  onSendEnquiry: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-[0_16px_48px_rgba(15,13,11,0.08)]',
        className,
      )}
    >
      <div className="relative border-b border-gold-400/15 bg-navy-950 px-5 py-4 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_100%_0%,rgba(245,158,11,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 ring-1 ring-gold-400/30">
                      <MessageCircle className="h-5 w-5 text-gold-400" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-cream-50">Send Enquiry</h2>
            <p className="text-xs text-cream-100/55">One tap to WhatsApp — no online payment</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {settings.whatsapp_number && (
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/25 bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#128C7E]">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {formatDisplayPhone(settings.whatsapp_number)}
                    </p>
                  )}

        {isLoggedIn && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-800">
            <BadgeCheck className="h-3.5 w-3.5 text-gold-600" />
            Logged in — your details will be included in the enquiry
            {customerEmail ? ` (${customerEmail})` : ''}
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

          <div className="space-y-3 rounded-xl border border-navy-900/8 bg-gradient-to-br from-cream-50/90 to-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                <MapPin className="h-3.5 w-3.5 text-gold-500" />
                Delivery Address *
              </label>
              <button
                type="button"
                onClick={onUseLocation}
                disabled={locating}
                className="inline-flex items-center gap-1 rounded-full border border-gold-400/35 bg-gold-500/10 px-2.5 py-1 text-[11px] font-semibold text-gold-700 transition hover:bg-gold-500/20 disabled:opacity-60"
              >
                {locating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                Use my location
              </button>
            </div>

            {addressFields.locationSnapshot ? (
              <div className="rounded-xl border border-gold-400/25 bg-white px-3 py-2.5 text-xs leading-relaxed text-navy-700/80">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gold-600/80">
                  Detected area
                </p>
                <p className="whitespace-pre-wrap">{addressFields.locationSnapshot}</p>
              </div>
            ) : (
              <p className="text-xs text-navy-700/50">
                Tap &quot;Use my location&quot; for area &amp; map, then fill door details below.
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy-800">Door / Flat No. *</label>
                <input
                  type="text"
                  value={addressFields.doorNo}
                  onChange={(e) => updateAddress({ doorNo: e.target.value })}
                  placeholder="e.g. 12B, Flat 3"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy-800">Street / Building *</label>
                <input
                  type="text"
                  value={addressFields.street}
                  onChange={(e) => updateAddress({ street: e.target.value })}
                  placeholder="Street name, apartment"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy-800">Landmark (optional)</label>
                <input
                  type="text"
                  value={addressFields.landmark}
                  onChange={(e) => updateAddress({ landmark: e.target.value })}
                  placeholder="Near temple, school…"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy-800">Pincode (optional)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addressFields.pincode}
                  onChange={(e) => updateAddress({ pincode: e.target.value })}
                  placeholder="6-digit pincode"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-navy-800">Message (optional)</label>
                      <textarea
                        value={customerMessage}
                        onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Event date, bulk quantity, special instructions…"
                        rows={3}
                        className={cn(inputClass, 'resize-none')}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
          onClick={onSendEnquiry}
                    disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#20bd5a] hover:shadow-xl disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
                    Send Enquiry on WhatsApp
                  </button>

                  <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-navy-700/50">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-gold-500" />
          WhatsApp opens with your message. Attach the downloaded PDF using the 📎 button.
        </p>
      </div>
    </div>
  )
}

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { settings } = useSettings()
  const { showToast } = useToast()
  const { user, isCustomer } = useAuth()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [addressFields, setAddressFields] = useState<DeliveryAddressFields>(emptyAddressFields)
  const [customerMessage, setCustomerMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [spinReward, setSpinReward] = useState<SpinReward | null>(null)
  const [spinDiscount, setSpinDiscount] = useState(0)
  const [prefilledFromAccount, setPrefilledFromAccount] = useState(false)
  const [showAttachPdfHint, setShowAttachPdfHint] = useState(false)

  const customerEmail = isCustomer && user?.email ? user.email : undefined

  useEffect(() => {
    if (!isCustomer || !user || prefilledFromAccount) return

    const fullName = (user.user_metadata?.full_name as string | undefined)?.trim()
    const phone = (user.user_metadata?.phone as string | undefined)?.trim()

    if (fullName && !customerName) setCustomerName(fullName)
    if (phone && !customerPhone) setCustomerPhone(phone)
    setPrefilledFromAccount(true)
  }, [isCustomer, user, prefilledFromAccount, customerName, customerPhone])

  const handleSpinRewardChange = useCallback((reward: SpinReward | null, discount: number) => {
    setSpinReward(reward)
    setSpinDiscount(discount)
  }, [])

  const resetSpinForNewEnquiry = useCallback(() => {
    setSpinReward(null)
    setSpinDiscount(0)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      resetSpinForNewEnquiry()
    }
  }, [items.length, resetSpinForNewEnquiry])

  const estimatedTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.price == null) return sum
        return sum + item.price * item.quantity
      }, 0),
    [items],
  )

  const hasPricedItems = items.some((item) => item.price != null)
  const estimatedAfterSpin = Math.max(0, estimatedTotal - spinDiscount)

  const updateAddress = (patch: Partial<DeliveryAddressFields>) => {
    setAddressFields((prev) => ({ ...prev, ...patch }))
  }

  const buildEnquiryFormData = (): CartEnquiryFormData | null => {
    if (items.length === 0) {
      showToast('Your cart is empty', 'error')
      return null
    }

    if (!customerName.trim()) {
      showToast('Please enter your name', 'error')
      return null
    }

    if (!validatePhone(customerPhone)) {
      showToast('Please enter a valid phone number', 'error')
      return null
    }

    const addressError = validateDeliveryAddress(addressFields)
    if (addressError) {
      showToast(addressError, 'error')
      return null
    }

    return {
      items,
      customerName: customerName.trim(),
      customerPhone,
      customerAddress: buildFullDeliveryAddress(addressFields),
      customerMessage,
      customerEmail,
      authUserId: isCustomer && user?.id ? user.id : undefined,
      spinReward: spinReward
        ? {
            label: spinReward.label,
            discountAmount: spinDiscount > 0 ? spinDiscount : undefined,
          }
        : undefined,
    }
  }

  const handleUseCurrentLocation = async () => {
    setLocating(true)
    try {
      const locationSnapshot = await getCurrentDeliveryAddress()
      updateAddress({ locationSnapshot })
      showToast('Area detected — add door no. and street below', 'success')
    } catch (error) {
      showToast(geolocationErrorMessage(error), 'error')
    } finally {
      setLocating(false)
    }
  }

  const handleSendEnquiry = async () => {
    const formData = buildEnquiryFormData()
    if (!formData) return

    if (!settings.whatsapp_number) {
      showToast('WhatsApp contact is not configured. Please call us instead.', 'error')
      return
    }

    // Open tab synchronously on click so popup blockers allow WhatsApp after PDF generation.
    const whatsappTab = window.open('about:blank', '_blank')

    setLoading(true)

    try {
      const enquiryNumber = generateEnquiryNumber()
      const message = buildCartWhatsAppMessage(formData)

      const { blob, filename } = await generateCartEnquiryPdfBlob(formData, {
        businessName: settings.business_name || 'Aura Crackers',
        businessPhone: settings.whatsapp_number
          ? formatDisplayPhone(settings.whatsapp_number)
          : undefined,
        enquiryNumber,
        estimatedTotal,
        spinDiscount,
      })

      deliverEnquiryWithPdf({
        blob,
        filename,
        message,
        whatsappNumber: settings.whatsapp_number,
        whatsappTab,
      })

      setShowAttachPdfHint(true)
      showToast('WhatsApp opened — attach the downloaded PDF with the 📎 button', 'success')

      const { error } = await createCartEnquiry(formData, enquiryNumber)

      if (error) {
        showToast('Enquiry could not be saved online, but you can still send on WhatsApp', 'info')
      }

      clearCart()
      resetSpinForNewEnquiry()
      setCustomerName('')
      setCustomerPhone('')
      setAddressFields(emptyAddressFields())
      setCustomerMessage('')
      setPrefilledFromAccount(false)
    } catch {
      whatsappTab?.close()
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formProps = {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    addressFields,
    updateAddress,
    customerMessage,
    setCustomerMessage,
    locating,
    loading,
    isLoggedIn: Boolean(isCustomer && user),
    customerEmail,
    settings,
    onUseLocation: handleUseCurrentLocation,
    onSendEnquiry: handleSendEnquiry,
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" noIndex />

        <div className="bg-cream-50">
          <header className="relative overflow-visible bg-navy-950 pb-0 pt-6 sm:pt-8">
            <picture className="absolute inset-0">
              <source srcSet={HERO_BG} type="image/webp" />
              <img
                src={HERO_BG_FALLBACK}
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

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs text-cream-100/55">
                <Link to="/" className="transition hover:text-gold-300">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="font-medium text-cream-50">Cart</span>
              </nav>

              <AnimateIn animation="fade-up">
                <div className="mt-6 max-w-2xl pb-8 sm:mt-8 sm:pb-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                    <ShoppingBag className="h-3.5 w-3.5 text-gold-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
                      Your Cart
                    </span>
                  </div>
                  <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] text-cream-50 sm:text-5xl">
                    Cart &{' '}
                    <TitleHighlight variant="dark">Enquiry</TitleHighlight>
                  </h1>
                </div>
              </AnimateIn>
            </div>

            <WaveDivider />
          </header>

          <section className="relative -mt-1 pb-14 pt-4 sm:pb-16 sm:pt-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimateIn animation="fade-up">
                <div className="relative overflow-hidden rounded-3xl border border-navy-900/8 bg-white px-6 py-14 text-center shadow-[0_16px_48px_rgba(15,13,11,0.08)] sm:px-12 sm:py-16">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(245,158,11,0.08),transparent_65%)]"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-200/60 bg-gradient-to-br from-gold-50 to-white shadow-inner">
                      <ShoppingBag className="h-10 w-10 text-gold-500" />
                    </div>
                    <h2 className="mt-6 font-display text-2xl font-bold text-navy-900">Your cart is empty</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-700/65">
                      Browse our catalogue and add products — send everything in one WhatsApp enquiry when
                      you&apos;re ready.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        to="/products"
                        className="btn-hover-lift inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-festive-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25"
                      >
                        <Package className="h-4 w-4" />
                        Browse Products
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/gift-box"
                        className="inline-flex items-center gap-2 rounded-xl border border-navy-900/12 bg-white px-6 py-3 text-sm font-bold text-navy-900 transition hover:border-gold-400"
                      >
                        <Gift className="h-4 w-4 text-gold-500" />
                        Build a Gift Box
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" noIndex />

      <div className="bg-cream-50 pb-32 sm:pb-10">
        <header className="relative overflow-visible bg-navy-950 pb-0 pt-6 sm:pt-8">
          <picture className="absolute inset-0">
            <source srcSet={HERO_BG} type="image/webp" />
            <img
              src={HERO_BG_FALLBACK}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center opacity-50"
            />
          </picture>
          <div className="absolute inset-0 bg-navy-950/70" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-5%,rgba(245,158,11,0.18),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-cream-100/55">
              <Link to="/" className="transition hover:text-gold-300">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-cream-50">Cart</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-2xl pb-8 sm:mt-8 sm:pb-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                    <ShoppingBag className="h-3.5 w-3.5 text-gold-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300">
                      Your Selection
                    </span>
                  </div>

                  <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] text-cream-50 sm:text-5xl">
                    Cart &{' '}
                    <TitleHighlight variant="dark">Enquiry</TitleHighlight>
                  </h1>

                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream-100/70 sm:text-base">
                    Review your items and send everything in one WhatsApp message — no payment online.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {trustPoints.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-cream-100/85 backdrop-blur-sm"
                      >
                        <Icon className="h-3 w-3 text-gold-400" />
                        {label}
                      </span>
                    ))}
                  </div>
              </div>
            </AnimateIn>
          </div>

          <WaveDivider />
        </header>

        <section className="relative -mt-1 pt-4 sm:pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-5">
              <div className="space-y-4 lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-navy-700/60 sm:text-base sm:normal-case sm:tracking-normal sm:text-navy-900">
                    <span className="hidden sm:inline-flex sm:items-center sm:gap-2 sm:font-display sm:text-lg sm:font-bold">
                      <Package className="h-5 w-5 text-gold-500" />
                      Selected Products
                    </span>
                    <span className="sm:hidden">{items.length} item{items.length !== 1 ? 's' : ''} in cart</span>
                  </h2>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-festive-600 hover:text-festive-500 sm:text-sm"
                  >
                    + Add more
                  </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-[0_4px_24px_rgba(15,13,11,0.06)]">
                  {items.map((item, index) => (
                    <CartItemCard
                      key={item.productId}
                      item={item}
                      index={index}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                      isLast={index === items.length - 1}
                    />
                  ))}
                </div>

                <AnimateIn animation="fade-up" delay={120}>
                  <SpinToWinWheel
                    estimatedTotal={estimatedTotal}
                    reward={spinReward}
                    onRewardChange={handleSpinRewardChange}
                  />
                </AnimateIn>

                {hasPricedItems && (
                  <AnimateIn animation="fade-up" delay={150}>
                    <div className="flex items-center justify-between rounded-2xl border border-gold-400/30 bg-gradient-to-r from-gold-50 to-white px-4 py-3.5 sm:px-5 sm:py-4">
                      <div>
                        <span className="text-sm font-semibold text-navy-800">Estimated total</span>
                        <p className="text-[11px] text-navy-700/55">Confirmed on WhatsApp</p>
                        {spinReward && (
                          <p className="mt-1 text-[11px] font-semibold text-festive-600">
                            Spin gift: {spinReward.label}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-display text-xl font-bold tabular-nums text-navy-900 sm:text-2xl">
                          {formatPrice(estimatedTotal)}
                        </span>
                      </div>
                    </div>
                  </AnimateIn>
                )}
              </div>

              <div className="hidden lg:col-span-2 lg:block">
                <div className="sticky top-24">
                  <EnquiryForm {...formProps} />
                </div>
              </div>
            </div>

            <div className="mt-8 lg:hidden">
              <EnquiryForm {...formProps} />
            </div>
          </div>
        </section>

        {hasPricedItems && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-900/10 bg-white/95 px-4 py-3 shadow-[0_-8px_32px_rgba(15,13,11,0.12)] backdrop-blur-md sm:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-navy-700/50">Estimated</p>
                <p className="font-display text-lg font-bold text-navy-900">{formatPrice(estimatedAfterSpin)}</p>
              </div>
              <button
                type="button"
                onClick={handleSendEnquiry}
                disabled={loading}
                className="inline-flex flex-1 max-w-[220px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                WhatsApp
              </button>
          </div>
        </div>
        )}
      </div>

      {showAttachPdfHint && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="attach-pdf-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-gold-400/25 bg-white p-5 shadow-2xl sm:p-6">
            <h3 id="attach-pdf-title" className="font-display text-lg font-bold text-navy-900">
              Attach your order PDF
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-700/75">
              WhatsApp is open with your message. To include the PDF:
            </p>
            <ol className="mt-3 space-y-2 text-sm text-navy-800">
              <li className="flex gap-2">
                <span className="font-bold text-gold-600">1.</span>
                Tap the <strong>📎 attachment</strong> icon in WhatsApp
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gold-600">2.</span>
                Choose <strong>Document</strong> and select the downloaded PDF
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-gold-600">3.</span>
                Tap <strong>Send</strong>
              </li>
            </ol>
            {settings.whatsapp_number && (
              <p className="mt-4 rounded-xl bg-gold-50 px-3 py-2 text-xs font-semibold text-gold-800">
                Send to: {formatDisplayPhone(settings.whatsapp_number)}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowAttachPdfHint(false)}
              className="mt-5 w-full rounded-xl bg-navy-900 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

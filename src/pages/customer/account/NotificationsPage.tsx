import { useEffect, useState } from 'react'
import { SEO } from '@/components/shared/SEO'
import { AccountPageHeader, ToggleRow } from '@/components/customer/account/AccountUI'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from '@/lib/profileStore'

export function NotificationsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    orderUpdates: true,
    deliveryUpdates: true,
    offersDiscounts: true,
    newProducts: true,
    festivalOffers: true,
    promotionalEmails: false,
    whatsappNotifications: true,
  })

  useEffect(() => {
    if (!user) return
    setPrefs(getNotificationPrefs(user.id))
  }, [user])

  const update = (key: keyof NotificationPrefs, value: boolean) => {
    if (!user) return
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    saveNotificationPrefs(user.id, next)
    showToast('Preference saved', 'success')
  }

  return (
    <>
      <SEO title="Notifications" description="Manage how we contact you about enquiries." noIndex />

      <AccountPageHeader backTo="/account" subtitle="Notifications" />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-navy-700/65">
            Aura Crackers runs on WhatsApp enquiries — choose how you'd like to hear back from us.
          </p>

          <div className="mt-4 divide-y divide-navy-900/[0.06]">
            <ToggleRow
              label="Enquiry Updates"
              description="When we reply or update the status of your enquiry"
              checked={prefs.orderUpdates}
              onChange={(v) => update('orderUpdates', v)}
            />
            <ToggleRow
              label="WhatsApp Updates"
              description="Follow-ups and replies on WhatsApp"
              checked={prefs.whatsappNotifications}
              onChange={(v) => update('whatsappNotifications', v)}
            />
            <ToggleRow
              label="New Products"
              description="When new crackers and combos are added"
              checked={prefs.newProducts}
              onChange={(v) => update('newProducts', v)}
            />
            <ToggleRow
              label="Festival Season Alerts"
              description="Diwali, New Year, and wedding season announcements"
              checked={prefs.festivalOffers}
              onChange={(v) => update('festivalOffers', v)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

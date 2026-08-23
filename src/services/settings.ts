import { supabase, getSupabaseErrorMessage, isSupabaseConfigured } from '@/lib/supabase'
import {
  BUSINESS_ADDRESS,
  BUSINESS_HOURS_24_7,
  BUSINESS_POLICIES,
  WHATSAPP_NUMBERS,
} from '@/lib/businessInfo'
import type { WebsiteSettings } from '@/types/database'

export const DEFAULT_SETTINGS: WebsiteSettings = {
  id: 'default',
  business_name: 'Aura Crackers',
  tagline: 'Premium Fireworks & Crackers for Every Celebration',
  logo_url: null,
  phone: '+91 88254 11254',
  whatsapp_number: WHATSAPP_NUMBERS[0],
  email: 'auracrackers@gmail.com',
  address: BUSINESS_ADDRESS,
  about_text:
    'Aura Crackers is your trusted partner for premium quality fireworks and crackers, serving customers across India for over 4 years. We offer a wide variety of products for Diwali, weddings, and all festive celebrations — with 24/7 WhatsApp support and delivery nationwide.',
  social_links: {
    whatsapp_numbers: [...WHATSAPP_NUMBERS],
    policies: BUSINESS_POLICIES,
  },
  business_hours: BUSINESS_HOURS_24_7,
  updated_at: new Date().toISOString(),
}

function mergeSettings(data: Record<string, unknown> | null): WebsiteSettings {
  if (!data) return DEFAULT_SETTINGS

  const socialLinks = (data.social_links as WebsiteSettings['social_links']) || {}
  const legacyPhones = ['+91 9876543210', '919876543210']
  const legacyWhatsapp = ['919876543210', '9876543210', '918825411254']
  const legacyAddress = 'Sivakasi, Tamil Nadu, India'

  const legacyEmails = ['info@auracrackers.com']

  const phone =
    !data.phone || legacyPhones.includes(String(data.phone))
      ? DEFAULT_SETTINGS.phone
      : (data.phone as string)

  const whatsapp_number =
    !data.whatsapp_number || legacyWhatsapp.includes(String(data.whatsapp_number))
      ? DEFAULT_SETTINGS.whatsapp_number
      : (data.whatsapp_number as string)

  const address =
    !data.address || data.address === legacyAddress
      ? DEFAULT_SETTINGS.address
      : (data.address as string)

  const email =
    !data.email || legacyEmails.includes(String(data.email))
      ? DEFAULT_SETTINGS.email
      : (data.email as string)

  const existingHours = (data.business_hours as WebsiteSettings['business_hours']) || {}
  const isLegacyHours = existingHours.weekdays?.includes('9:00 AM')
  const business_hours = isLegacyHours
    ? DEFAULT_SETTINGS.business_hours
    : { ...DEFAULT_SETTINGS.business_hours, ...existingHours }

  return {
    ...DEFAULT_SETTINGS,
    ...(data as unknown as WebsiteSettings),
    phone,
    whatsapp_number,
    address,
    email,
    social_links: {
      ...DEFAULT_SETTINGS.social_links,
      ...socialLinks,
      whatsapp_numbers: socialLinks.whatsapp_numbers?.length
        ? socialLinks.whatsapp_numbers
        : DEFAULT_SETTINGS.social_links.whatsapp_numbers,
      policies: {
        ...DEFAULT_SETTINGS.social_links.policies,
        ...socialLinks.policies,
      },
    },
    business_hours,
  }
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  if (!isSupabaseConfigured) {
    return DEFAULT_SETTINGS
  }

  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .limit(1)
    .single()

  if (error || !data) {
    return DEFAULT_SETTINGS
  }

  return mergeSettings(data)
}

export async function updateWebsiteSettings(
  settings: Partial<Omit<WebsiteSettings, 'id' | 'updated_at'>>
): Promise<{ data: WebsiteSettings | null; error: string | null }> {
  const existing = await getWebsiteSettings()

  const { data, error } = await supabase
    .from('website_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', existing.id === 'default' ? undefined : existing.id)
    .select()
    .single()

  if (error) {
    if (existing.id === 'default') {
      const { data: inserted, error: insertError } = await supabase
        .from('website_settings')
        .insert(settings)
        .select()
        .single()

      if (insertError) return { data: null, error: getSupabaseErrorMessage(insertError) }
      return { data: mergeSettings(inserted), error: null }
    }
    return { data: null, error: getSupabaseErrorMessage(error) }
  }

  return { data: mergeSettings(data), error: null }
}

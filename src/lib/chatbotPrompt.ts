import type { ChatMessage } from '@/services/ollama'
import type { WebsiteSettings } from '@/types/database'
import { getBusinessPolicies } from '@/lib/businessInfo'
import { CHATBOT_GREETING_REPLY } from '@/lib/chatbotKnowledge'

let cachedPromptKey = ''
let cachedPrompt = ''

/** Teach the small model by example — works better than rules + Q&A lists */
export const CHATBOT_FEW_SHOT: ChatMessage[] = [
  { role: 'user', content: 'hello' },
  { role: 'assistant', content: CHATBOT_GREETING_REPLY },
  { role: 'user', content: 'good morning' },
  {
    role: 'assistant',
    content: 'Good morning! How can I help you with products, ordering, or delivery?',
  },
  { role: 'user', content: 'how do I order?' },
  {
    role: 'assistant',
    content: 'Add items to cart, then send a WhatsApp enquiry from the Cart page. Our team confirms price and delivery.',
  },
  { role: 'user', content: 'is there expiry date on products?' },
  {
    role: 'assistant',
    content:
      'Expiry is not always shown on the site. Use fireworks in the same festival season. WhatsApp us for batch details on a specific product.',
  },
  { role: 'user', content: 'do you deliver?' },
  {
    role: 'assistant',
    content: 'Yes, we deliver all over India. Share your location on WhatsApp for delivery charges.',
  },
  { role: 'user', content: 'can I make a custom gift box?' },
  {
    role: 'assistant',
    content: 'Yes. Open Gift Box, add the products you want, then add the box to cart and send a WhatsApp enquiry.',
  },
]

export function buildChatbotSystemPrompt(settings: WebsiteSettings): string {
  const key = `${settings.business_name}|${settings.whatsapp_number}`
  if (key === cachedPromptKey) return cachedPrompt

  const policies = getBusinessPolicies(settings)

  cachedPromptKey = key
  cachedPrompt = `You are ${settings.business_name} assistant — fireworks shop in Sivakasi, India.
Follow the example conversations. Reply in 1-2 short sentences like the examples.
Answer only what the user asked. Never invent prices or product names.
WhatsApp: ${settings.whatsapp_number || 'Contact page'}. Delivery: ${policies.delivery_areas}. Payment: ${policies.payment_methods}.
If unsure, say WhatsApp us for details.`

  return cachedPrompt
}

export function buildOllamaMessages(
  settings: WebsiteSettings,
  history: ChatMessage[],
  userMessage: string,
): ChatMessage[] {
  return [
    { role: 'system', content: buildChatbotSystemPrompt(settings) },
    ...CHATBOT_FEW_SHOT,
    ...history,
    { role: 'user', content: userMessage },
  ]
}

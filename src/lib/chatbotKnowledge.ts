/** Business knowledge for the AI system prompt — tagged by topic so the model picks the right one */
export const CHATBOT_KNOWLEDGE = [
  {
    topic: 'ordering',
    q: 'How to order?',
    a: 'Add products to cart, then send WhatsApp enquiry from Cart. Team confirms price and delivery. No online payment.',
  },
  {
    topic: 'payment',
    q: 'Online payment?',
    a: 'No online payment on site. Pre-payment only after WhatsApp enquiry.',
  },
  {
    topic: 'ordering',
    q: 'Multiple products?',
    a: 'Add all to cart and send one combined WhatsApp enquiry.',
  },
  {
    topic: 'gift box',
    q: 'Custom gift box?',
    a: 'Yes. Open Gift Box, add products you want, then add the box to cart and send a WhatsApp enquiry.',
  },
  {
    topic: 'pricing',
    q: 'Are prices final?',
    a: 'Website prices are indicative. WhatsApp us for latest rates.',
  },
  {
    topic: 'delivery',
    q: 'Do you deliver?',
    a: 'Yes, all over India. Share location on WhatsApp for delivery charges.',
  },
  {
    topic: 'safety',
    q: 'Is online purchase safe?',
    a: 'We are a catalogue platform. Orders handled offline via WhatsApp with safety guidance.',
  },
  {
    topic: 'ordering',
    q: 'Minimum order?',
    a: 'Varies by product. WhatsApp us for the item you need.',
  },
  {
    topic: 'support',
    q: 'Response time?',
    a: 'WhatsApp support 24/7, usually replies within minutes.',
  },
  {
    topic: 'expiry',
    q: 'Expiry date on products?',
    a: 'Not always shown on site. Use in the same festival season. Store dry and cool. WhatsApp us for batch details on a specific product.',
  },
  {
    topic: 'stock',
    q: 'In stock?',
    a: 'Check the product page or WhatsApp us with the product name for live stock.',
  },
  {
    topic: 'products',
    q: 'What do you sell?',
    a: 'Sparklers, rockets, flower pots, atom bombs, chakras, and more. See Products or Categories pages.',
  },
] as const

export const CHATBOT_GREETING_REPLY =
  'Hello! How can I help you with products, ordering, or delivery?'

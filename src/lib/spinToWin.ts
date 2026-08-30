export type SpinRewardType =
  | 'percent_5'
  | 'percent_10'
  | 'flat_100'
  | 'flat_200'
  | 'free_gift'
  | 'extra_reward'
  | 'no_luck'

export interface SpinReward {
  id: string
  label: string
  type: SpinRewardType
  segmentIndex: number
  color: string
  textColor: string
}

export interface StoredSpinResult {
  reward: SpinReward
  spunAt: string
  userId: string
}

export const SPIN_SEGMENT_COUNT = 8
export const SPIN_SEGMENT_DEGREES = 360 / SPIN_SEGMENT_COUNT

export const SPIN_REWARDS: SpinReward[] = [
  {
    id: 'percent_5_a',
    label: '5% OFF',
    type: 'percent_5',
    segmentIndex: 0,
    color: '#1e1b4b',
    textColor: '#fde68a',
  },
  {
    id: 'percent_10',
    label: '10% OFF',
    type: 'percent_10',
    segmentIndex: 1,
    color: '#ea580c',
    textColor: '#fff7ed',
  },
  {
    id: 'flat_100',
    label: '₹100 OFF',
    type: 'flat_100',
    segmentIndex: 2,
    color: '#f59e0b',
    textColor: '#1c1917',
  },
  {
    id: 'flat_200',
    label: '₹200 OFF',
    type: 'flat_200',
    segmentIndex: 3,
    color: '#0f172a',
    textColor: '#fbbf24',
  },
  {
    id: 'free_gift',
    label: 'FREE GIFT',
    type: 'free_gift',
    segmentIndex: 4,
    color: '#c2410c',
    textColor: '#fffbeb',
  },
  {
    id: 'extra_reward',
    label: 'EXTRA REWARD',
    type: 'extra_reward',
    segmentIndex: 5,
    color: '#292524',
    textColor: '#fcd34d',
  },
  {
    id: 'no_luck',
    label: 'BETTER LUCK NEXT TIME',
    type: 'no_luck',
    segmentIndex: 6,
    color: '#44403c',
    textColor: '#e7e5e4',
  },
  {
    id: 'percent_5_b',
    label: '5% OFF',
    type: 'percent_5',
    segmentIndex: 7,
    color: '#7c2d12',
    textColor: '#fef3c7',
  },
]

function spinStorageKey(userId: string): string {
  return `aura-spin-to-win-${userId}`
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getStoredSpinResult(userId: string): StoredSpinResult | null {
  try {
    const raw = localStorage.getItem(spinStorageKey(userId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredSpinResult
    if (!parsed?.reward || parsed.userId !== userId) return null
    if (!isSameCalendarDay(new Date(parsed.spunAt), new Date())) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSpinResult(userId: string, reward: SpinReward): StoredSpinResult {
  const result: StoredSpinResult = {
    reward,
    spunAt: new Date().toISOString(),
    userId,
  }
  try {
    localStorage.setItem(spinStorageKey(userId), JSON.stringify(result))
  } catch {
    // localStorage may be unavailable
  }
  return result
}

export function pickRandomSpinReward(): SpinReward {
  const index = Math.floor(Math.random() * SPIN_REWARDS.length)
  return SPIN_REWARDS[index]!
}

export function getSpinLandingRotation(segmentIndex: number, extraSpins = 6): number {
  const segmentCenter = segmentIndex * SPIN_SEGMENT_DEGREES + SPIN_SEGMENT_DEGREES / 2
  return extraSpins * 360 + (360 - segmentCenter)
}

export function buildWheelGradient(): string {
  const stops = SPIN_REWARDS.map((segment) => {
    const start = segment.segmentIndex * SPIN_SEGMENT_DEGREES
    const end = start + SPIN_SEGMENT_DEGREES
    return `${segment.color} ${start}deg ${end}deg`
  })
  return `conic-gradient(from -90deg, ${stops.join(', ')})`
}

export function calculateSpinDiscount(subtotal: number, reward: SpinReward | null): number {
  if (!reward || subtotal <= 0) return 0

  switch (reward.type) {
    case 'percent_5':
      return Math.round(subtotal * 0.05)
    case 'percent_10':
      return Math.round(subtotal * 0.1)
    case 'flat_100':
      return Math.min(100, subtotal)
    case 'flat_200':
      return Math.min(200, subtotal)
    default:
      return 0
  }
}

export function rewardHasMonetaryDiscount(type: SpinRewardType): boolean {
  return type === 'percent_5' || type === 'percent_10' || type === 'flat_100' || type === 'flat_200'
}

export function getSpinRewardMessage(reward: SpinReward): string {
  switch (reward.type) {
    case 'free_gift':
      return 'You won a FREE GIFT — mention this on WhatsApp to claim it!'
    case 'extra_reward':
      return 'You unlocked an EXTRA REWARD — our team will surprise you on WhatsApp!'
    case 'no_luck':
      return 'Better luck next time! You can spin again tomorrow.'
    default:
      return `You won ${reward.label}! Discount applied to your estimated total.`
  }
}

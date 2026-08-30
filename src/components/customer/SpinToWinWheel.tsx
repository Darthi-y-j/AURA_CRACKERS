import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Gift, LogIn, Sparkles, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { formatPrice, cn } from '@/lib/utils'
import {
  SPIN_REWARDS,
  SPIN_SEGMENT_DEGREES,
  buildWheelGradient,
  calculateSpinDiscount,
  getSpinLandingRotation,
  getSpinRewardMessage,
  getStoredSpinResult,
  pickRandomSpinReward,
  rewardHasMonetaryDiscount,
  saveSpinResult,
  type SpinReward,
  type StoredSpinResult,
} from '@/lib/spinToWin'

interface SpinToWinWheelProps {
  estimatedTotal: number
  onRewardChange?: (reward: SpinReward | null, discount: number) => void
  className?: string
}

export function SpinToWinWheel({ estimatedTotal, onRewardChange, className }: SpinToWinWheelProps) {
  const { user, isCustomer, loading } = useAuth()
  const { showToast } = useToast()
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [storedResult, setStoredResult] = useState<StoredSpinResult | null>(null)

  const wheelGradient = useMemo(() => buildWheelGradient(), [])
  const onRewardChangeRef = useRef(onRewardChange)
  onRewardChangeRef.current = onRewardChange

  useEffect(() => {
    if (!user?.id) {
      setStoredResult(null)
      onRewardChangeRef.current?.(null, 0)
      return
    }
    const saved = getStoredSpinResult(user.id)
    setStoredResult(saved)
    if (saved) {
      const discount = calculateSpinDiscount(estimatedTotal, saved.reward)
      onRewardChangeRef.current?.(saved.reward, discount)
      setRotation(getSpinLandingRotation(saved.reward.segmentIndex, 0))
    } else {
      onRewardChangeRef.current?.(null, 0)
    }
  }, [user?.id, estimatedTotal])

  const activeReward = storedResult?.reward ?? null
  const discount = activeReward ? calculateSpinDiscount(estimatedTotal, activeReward) : 0
  const finalTotal = Math.max(0, estimatedTotal - discount)

  const handleSpin = () => {
    if (!user?.id || !isCustomer || spinning) return

    const reward = pickRandomSpinReward()
    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const landingRotation = getSpinLandingRotation(reward.segmentIndex, extraSpins)

    setSpinning(true)
    setRotation(landingRotation)

    window.setTimeout(() => {
      const saved = saveSpinResult(user.id, reward)
      setStoredResult(saved)
      const nextDiscount = calculateSpinDiscount(estimatedTotal, reward)
      onRewardChange?.(reward, nextDiscount)
      setSpinning(false)
      showToast(getSpinRewardMessage(reward), reward.type === 'no_luck' ? 'info' : 'success')
    }, 5200)
  }

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-gold-400/25 bg-gradient-to-br from-navy-950 via-[#1a1208] to-navy-950 p-6',
          className,
        )}
      >
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (!user || !isCustomer) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-navy-950 via-[#1a1208] to-navy-950 p-6 shadow-[0_20px_60px_rgba(245,158,11,0.12)]',
          className,
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.18),transparent_65%)]"
          aria-hidden="true"
        />
        <div className="relative text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-500/10">
            <Gift className="h-7 w-7 text-gold-400" />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-gold-400">Premium</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Spin to Win</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream-100/70">
            Log in to spin the wheel and unlock exclusive cart rewards before you send your WhatsApp enquiry.
          </p>
          <Link
            to="/login"
            state={{ from: '/cart' }}
            className="btn-hover-lift mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-festive-500/30"
          >
            <LogIn className="h-4 w-4" />
            Login to Spin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-navy-950 via-[#1a1208] to-navy-950 p-5 shadow-[0_20px_60px_rgba(245,158,11,0.12)] sm:p-6',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.16),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="w-full shrink-0 text-center lg:max-w-[220px] lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-500/10 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-300">Premium</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-[1.75rem]">Spin to Win</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream-100/70">
            One spin per day. Rewards apply to your cart estimate and WhatsApp enquiry.
          </p>
          {activeReward && (
            <div className="mt-4 rounded-2xl border border-gold-400/25 bg-white/5 px-4 py-3 text-left">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-300">
                <Trophy className="h-3.5 w-3.5" />
                Today&apos;s reward
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">{activeReward.label}</p>
              {rewardHasMonetaryDiscount(activeReward.type) && estimatedTotal > 0 ? (
                <p className="mt-1 text-xs text-cream-100/65">
                  Save {formatPrice(discount)} · Est. {formatPrice(finalTotal)}
                </p>
              ) : (
                <p className="mt-1 text-xs text-cream-100/65">{getSpinRewardMessage(activeReward)}</p>
              )}
            </div>
          )}
        </div>

        <div className="relative mx-auto flex h-[min(72vw,17rem)] w-[min(72vw,17rem)] items-center justify-center sm:h-72 sm:w-72">
          <div
            className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
            aria-hidden="true"
          >
            <div className="h-0 w-0 border-x-[12px] border-x-transparent border-b-[22px] border-b-gold-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] sm:border-x-[14px] sm:border-b-[26px]" />
          </div>

          <div className="absolute inset-0 rounded-full border-[6px] border-gold-400/80 shadow-[0_0_0_4px_rgba(15,13,11,0.45),0_0_40px_rgba(245,158,11,0.25)]" />

          <div
            className={cn(
              'relative h-full w-full rounded-full transition-transform duration-[5000ms] ease-[cubic-bezier(0.15,0.85,0.2,1)]',
              spinning && 'pointer-events-none',
            )}
            style={{
              transform: `rotate(${rotation}deg)`,
              background: wheelGradient,
            }}
          >
            {SPIN_REWARDS.map((segment) => (
              <div
                key={segment.id}
                className="absolute inset-0 flex justify-center"
                style={{ transform: `rotate(${segment.segmentIndex * SPIN_SEGMENT_DEGREES + SPIN_SEGMENT_DEGREES / 2}deg)` }}
              >
                <span
                  className="mt-5 max-w-[4.5rem] text-center text-[8px] font-bold uppercase leading-tight tracking-wide sm:mt-6 sm:max-w-[5rem] sm:text-[9px]"
                  style={{
                    color: segment.textColor,
                    transform: 'rotate(90deg)',
                  }}
                >
                  {segment.label}
                </span>
              </div>
            ))}

            <div className="absolute inset-[28%] flex items-center justify-center overflow-hidden rounded-full border border-gold-300/40 bg-gradient-to-br from-navy-950 to-[#2a1a08] shadow-inner">
              <img
                src={SITE_LOGO_PATH}
                alt=""
                className="h-[70%] w-[70%] scale-125 object-contain"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || Boolean(storedResult)}
            className={cn(
              'absolute z-30 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-300/60 bg-gradient-to-br from-festive-500 via-gold-400 to-festive-500 text-center text-[11px] font-black uppercase leading-tight tracking-wide text-navy-950 shadow-[0_8px_24px_rgba(245,158,11,0.45)] transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:h-24 sm:w-24 sm:text-xs',
            )}
          >
            {spinning ? 'Spinning…' : storedResult ? 'Done' : 'Spin'}
          </button>
        </div>
      </div>
    </div>
  )
}

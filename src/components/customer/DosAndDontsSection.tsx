import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'
import { TitleHighlight } from './TitleHighlight'
import { AnimateIn } from './AnimateIn'

const dos = [
  'Buy fireworks only from licensed, trusted sellers.',
  'Store crackers in a cool, dry place, away from children.',
  'Light fireworks only in open outdoor spaces.',
  'Keep a bucket of water or sand ready nearby.',
  'Supervise children at all times during celebrations.',
  'Read and follow instructions on every product pack.',
  'Light one firework at a time and step back immediately.',
  'Wear cotton clothing and closed footwear while lighting.',
]

const donts = [
  "Don't light fireworks indoors or near buildings and vehicles.",
  "Don't hold lit sparklers close to your body or clothing.",
  "Don't try to relight a firework that failed to go off.",
  "Don't wear loose or synthetic clothes while handling crackers.",
  "Don't let children handle or light fireworks unsupervised.",
  "Don't store crackers near stoves, gas cylinders, or heat sources.",
  "Don't use alcohol while lighting or handling fireworks.",
  "Don't throw crackers at people, animals, or into crowds.",
]

function SafetyCard({
  variant,
  title,
  items,
  icon: Icon,
}: {
  variant: 'do' | 'dont'
  title: string
  items: string[]
  icon: LucideIcon
}) {
  const isDo = variant === 'do'

  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl border bg-[#12100e] transition-all duration-300 hover:-translate-y-1',
        isDo
          ? 'border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-gold-400/25 hover:shadow-[0_16px_40px_rgba(251,191,36,0.12)]'
          : 'border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-festive-500/30 hover:shadow-[0_16px_40px_rgba(234,88,12,0.12)]',
      )}
    >
      <div
        className={cn(
          'h-1 shrink-0',
          isDo
            ? 'bg-gradient-to-r from-festive-500 via-gold-400 to-gold-300'
            : 'bg-gradient-to-r from-festive-600 via-festive-500 to-gold-500',
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300',
          isDo ? 'bg-gold-500/10 group-hover:bg-gold-500/15' : 'bg-festive-500/10 group-hover:bg-festive-500/15',
        )}
        aria-hidden="true"
      />

      <div className="relative p-4 sm:p-6">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-11 sm:w-11',
              isDo
                ? 'bg-gold-500/15 ring-gold-400/25'
                : 'bg-festive-500/15 ring-festive-500/25',
            )}
          >
            <Icon
              className={cn('h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]', isDo ? 'text-gold-400' : 'text-festive-400')}
              strokeWidth={2}
            />
          </div>
          <h3 className="font-display text-xl font-bold sm:text-2xl">
            <TitleHighlight variant="dark">{title}</TitleHighlight>
          </h3>
        </div>

        <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
          {items.map((item) => (
            <li
              key={item}
              className={cn(
                'relative flex gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-sm transition-all duration-300 sm:gap-3 sm:px-3.5 sm:py-3',
                isDo
                  ? 'border-gold-500/20 bg-gold-500/[0.04] shadow-[0_0_14px_rgba(251,191,36,0.1),inset_0_1px_0_rgba(251,191,36,0.08)] hover:border-gold-400/40 hover:bg-gold-500/[0.07] hover:shadow-[0_0_22px_rgba(251,191,36,0.2)]'
                  : 'border-festive-500/20 bg-festive-500/[0.04] shadow-[0_0_14px_rgba(234,88,12,0.1),inset_0_1px_0_rgba(234,88,12,0.08)] hover:border-festive-400/40 hover:bg-festive-500/[0.07] hover:shadow-[0_0_22px_rgba(234,88,12,0.2)]',
              )}
            >
              <span
                className={cn(
                  'pointer-events-none absolute inset-y-2 left-0 w-0.5 rounded-full',
                  isDo
                    ? 'bg-gold-400/70 shadow-[0_0_10px_rgba(251,191,36,0.55)]'
                    : 'bg-festive-400/70 shadow-[0_0_10px_rgba(234,88,12,0.55)]',
                )}
                aria-hidden="true"
              />
              {isDo ? (
                <CheckCircle2 className="relative mt-0.5 h-4 w-4 shrink-0 text-gold-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]" strokeWidth={2} />
              ) : (
                <XCircle className="relative mt-0.5 h-4 w-4 shrink-0 text-festive-400 drop-shadow-[0_0_6px_rgba(234,88,12,0.45)]" strokeWidth={2} />
              )}
              <span className="relative leading-relaxed text-cream-100/75">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DosAndDontsSection({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="safety"
      className={
        compact
          ? ''
          : 'relative overflow-hidden bg-white pb-10 pt-2 sm:pb-14 sm:pt-4'
      }
    >
      {!compact && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(251,191,36,0.06),transparent_60%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"
            aria-hidden="true"
          />
        </>
      )}

      <div className={compact ? '' : 'relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'}>
        <SectionHeader
          icon={ShieldAlert}
          label="Safety"
          title="Fireworks Dos and Don'ts"
          description="Celebrate responsibly — follow these guidelines for a safe and joyful experience"
          align="center"
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          <AnimateIn animation="fade-up" delay={80}>
            <SafetyCard variant="do" title="Do's" items={dos} icon={CheckCircle2} />
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={160}>
            <SafetyCard variant="dont" title="Don'ts" items={donts} icon={XCircle} />
          </AnimateIn>
        </div>

        <AnimateIn animation="fade-up" delay={240}>
          <p className="mt-6 text-center text-xs leading-relaxed text-navy-700/70 sm:mt-8 sm:text-sm">
            In case of injury, seek medical help immediately. For product guidance, contact our team on WhatsApp.
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}

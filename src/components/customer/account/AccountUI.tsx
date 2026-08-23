import { Link } from 'react-router-dom'
import { ChevronLeft, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

interface AccountPageHeaderProps {
  title?: string
  subtitle?: string
  backTo?: string
  showEdit?: boolean
  editTo?: string
  children?: React.ReactNode
}

export function AccountPageHeader({
  title = 'My Profile',
  subtitle,
  backTo,
  showEdit,
  editTo = '/account/personal',
  children,
}: AccountPageHeaderProps) {
  return (
    <div className="border-b border-navy-900/10 bg-navy-950 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cream-100/80 transition hover:text-gold-300"
            >
              <ChevronLeft className="h-4 w-4" />
              My Profile
            </Link>
          ) : (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">{title}</p>
          )}

          {showEdit && (
            <Link
              to={editTo}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-cream-50 transition hover:bg-white/15"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          )}
        </div>

        {subtitle && (
          <h1 className="mt-4 font-display text-2xl font-bold text-cream-50 sm:text-3xl">{subtitle}</h1>
        )}

        {children}
      </div>
    </div>
  )
}

interface ProfileAvatarProps {
  name: string
  size?: 'md' | 'lg'
  className?: string
}

export function ProfileAvatar({ name, size = 'lg', className }: ProfileAvatarProps) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gold-500/20 font-bold text-gold-300 ring-2 ring-gold-400/30',
        size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-12 w-12 text-sm',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}

interface StatCardProps {
  value: number | string
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-navy-900/8 bg-white px-3 py-4 text-center shadow-sm',
        className,
      )}
    >
      <p className="font-display text-2xl font-bold text-navy-900">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-navy-700/55">{label}</p>
    </div>
  )
}

interface MenuLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  description?: string
}

export function MenuLink({ to, icon, label, description }: MenuLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl px-3 py-3.5 transition hover:bg-navy-900/[0.03]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900/[0.04] text-lg">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-navy-900">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-navy-700/55">{description}</span>}
      </span>
      <span className="text-navy-700/30">›</span>
    </Link>
  )
}

interface MenuSectionProps {
  title: string
  children: React.ReactNode
}

export function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white shadow-sm">
      <p className="border-b border-navy-900/8 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-700/50">
        {title}
      </p>
      <div className="divide-y divide-navy-900/[0.06] px-1 py-1">{children}</div>
    </div>
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-navy-900">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-navy-700/55">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
          checked ? 'justify-end bg-emerald-500' : 'justify-start bg-navy-900/15',
        )}
      >
        <span className="h-5 w-5 shrink-0 rounded-full bg-white shadow-sm" />
      </button>
    </label>
  )
}

export const accountInputClass =
  'w-full rounded-xl border border-navy-900/10 bg-cream-50/80 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-700/40 transition focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20'

export const accountLabelClass = 'mb-1.5 block text-xs font-semibold text-navy-700/70'

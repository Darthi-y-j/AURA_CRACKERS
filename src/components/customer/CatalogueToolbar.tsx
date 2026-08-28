import { useEffect, useRef, useState } from 'react'
import {
  Flame,
  Sparkles,
  LayoutGrid,
  Table2,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ArrowUpDown,
  ChevronDown,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type CatalogueSort = 'popular' | 'price_asc' | 'price_desc' | 'newest'
export type CatalogueView = 'card' | 'table'

const SORT_OPTIONS: {
  id: CatalogueSort
  label: string
  menuLabel: string
  icon: typeof Flame
}[] = [
  { id: 'popular', label: 'Popular', menuLabel: 'Popular', icon: Flame },
  { id: 'price_asc', label: 'Low ₹', menuLabel: 'Price: Low to High', icon: ArrowDownWideNarrow },
  { id: 'price_desc', label: 'High ₹', menuLabel: 'Price: High to Low', icon: ArrowUpWideNarrow },
  { id: 'newest', label: 'Newest', menuLabel: 'Newest', icon: Sparkles },
]

function MobileSortDropdown({
  sort,
  onSortChange,
}: {
  sort: CatalogueSort
  onSortChange: (sort: CatalogueSort) => void
}) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const activeOption = SORT_OPTIONS.find((option) => option.id === sort) ?? SORT_OPTIONS[0]

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSelect = (id: CatalogueSort) => {
    onSortChange(id)
    setOpen(false)
  }

  return (
    <div className="relative shrink-0 sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Sort products, currently ${activeOption.menuLabel}`}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full border font-semibold transition-colors',
          'min-h-9 px-3 py-2 text-xs',
          open
            ? 'border-festive-500/30 bg-festive-500/10 text-festive-600'
            : 'border-navy-900/10 bg-white text-navy-800 hover:border-gold-500/30',
        )}
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden min-[380px]:inline">{activeOption.label}</span>
        <span className="min-[380px]:hidden">Sort</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="listbox"
          aria-label="Sort products"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[12.5rem] overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_12px_40px_rgba(12,8,6,0.12)]"
        >
          <div className="flex items-center justify-between border-b border-cream-200 px-3 py-2.5">
            <p className="text-sm font-bold text-navy-900">Sort by</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close sort menu"
              className="rounded-lg p-1 text-navy-700/50 transition-colors hover:bg-cream-100 hover:text-navy-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-1.5">
            {SORT_OPTIONS.map(({ id, menuLabel, icon: Icon }) => {
              const active = sort === id
              return (
                <button
                  key={id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    active
                      ? 'bg-festive-500/10 text-festive-600'
                      : 'text-navy-800 hover:bg-cream-50',
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-festive-500' : 'text-navy-700/55')} />
                  {menuLabel}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface CatalogueToolbarProps {
  sort: CatalogueSort
  onSortChange: (sort: CatalogueSort) => void
  view: CatalogueView
  onViewChange: (view: CatalogueView) => void
  filterSlot?: React.ReactNode
  className?: string
  /** Strip outer card chrome — use when nested inside a shared toolbar row */
  inline?: boolean
}

export function CatalogueToolbar({
  sort,
  onSortChange,
  view,
  onViewChange,
  filterSlot,
  className,
  inline = false,
}: CatalogueToolbarProps) {
  return (
    <div
      className={cn(
        'relative flex min-w-0 items-center gap-1.5 overflow-x-clip overflow-y-visible sm:gap-3',
        !inline &&
          'mb-4 rounded-2xl border border-navy-900/8 bg-gradient-to-r from-cream-50 via-white to-cream-50/80 p-2.5 shadow-[0_4px_24px_rgba(12,8,6,0.06)] sm:p-3',
        inline && 'w-full min-w-0',
        className,
      )}
    >
      {filterSlot}

      <div
        className="flex min-w-0 flex-1 items-center justify-end gap-1.5 overflow-visible max-sm:gap-1 sm:gap-2"
        role="toolbar"
        aria-label="Sort and view products"
      >
        <MobileSortDropdown sort={sort} onSortChange={onSortChange} />

        <div
          className={cn(
            'hidden min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-navy-900/8 bg-white/80 p-0.5 scrollbar-hide sm:flex',
            inline ? 'shrink' : 'flex-1 justify-start sm:justify-end',
          )}
          role="group"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map(({ id, label, icon: Icon }) => {
            const active = sort === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSortChange(id)}
                aria-pressed={active}
                aria-label={`Sort by ${label}`}
                title={label}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-300',
                  active
                    ? 'bg-gradient-to-r from-festive-500 to-gold-500 text-navy-950 shadow-[0_2px_10px_rgba(234,88,12,0.25)]'
                    : 'text-navy-700/65 hover:bg-navy-900/[0.04] hover:text-navy-900',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        <div
          className="relative inline-flex shrink-0 rounded-full border border-navy-900/10 bg-navy-950 p-1"
          role="group"
          aria-label="View mode"
        >
          <span
            className={cn(
              'absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-gold-400 to-festive-500 shadow-[0_2px_8px_rgba(245,158,11,0.35)] transition-all duration-300 ease-out',
              view === 'card' ? 'left-1' : 'left-[calc(50%+0px)]',
            )}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => onViewChange('card')}
            aria-pressed={view === 'card'}
            className={cn(
              'relative z-10 inline-flex items-center justify-center gap-1 rounded-full font-bold transition-colors',
              'max-sm:min-h-9 max-sm:min-w-9 max-sm:px-2.5 max-sm:py-2 max-sm:text-xs',
              'px-2 py-1 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs',
              view === 'card' ? 'text-navy-950' : 'text-white/55 hover:text-white/80',
            )}
          >
            <LayoutGrid className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange('table')}
            aria-pressed={view === 'table'}
            className={cn(
              'relative z-10 inline-flex items-center justify-center gap-1 rounded-full font-bold transition-colors',
              'max-sm:min-h-9 max-sm:min-w-9 max-sm:px-2.5 max-sm:py-2 max-sm:text-xs',
              'px-2 py-1 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs',
              view === 'table' ? 'text-navy-950' : 'text-white/55 hover:text-white/80',
            )}
          >
            <Table2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function sortProducts<T extends { sort_order: number; price: number | null; created_at: string }>(
  items: T[],
  sort: CatalogueSort,
): T[] {
  const result = [...items]

  switch (sort) {
    case 'price_asc':
      return result.sort((a, b) => {
        if (a.price == null && b.price == null) return a.sort_order - b.sort_order
        if (a.price == null) return 1
        if (b.price == null) return -1
        return a.price - b.price
      })
    case 'price_desc':
      return result.sort((a, b) => {
        if (a.price == null && b.price == null) return a.sort_order - b.sort_order
        if (a.price == null) return 1
        if (b.price == null) return -1
        return b.price - a.price
      })
    case 'newest':
      return result.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    default:
      return result.sort((a, b) => a.sort_order - b.sort_order)
  }
}

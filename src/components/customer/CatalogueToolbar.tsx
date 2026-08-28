import { Flame, Sparkles, LayoutGrid, Table2, ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CatalogueSort = 'popular' | 'price_asc' | 'price_desc' | 'newest'
export type CatalogueView = 'card' | 'table'

const SORT_OPTIONS: {
  id: CatalogueSort
  label: string
  icon: typeof Flame
}[] = [
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'price_asc', label: 'Low ₹', icon: ArrowDownWideNarrow },
  { id: 'price_desc', label: 'High ₹', icon: ArrowUpWideNarrow },
  { id: 'newest', label: 'Newest', icon: Sparkles },
]

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
        'relative flex min-w-0 items-center gap-1.5 overflow-hidden sm:gap-3',
        !inline &&
          'mb-4 rounded-2xl border border-navy-900/8 bg-gradient-to-r from-cream-50 via-white to-cream-50/80 p-2.5 shadow-[0_4px_24px_rgba(12,8,6,0.06)] sm:p-3',
        inline && 'w-full min-w-0',
        className,
      )}
    >
      {filterSlot}

      <div
        className="flex min-w-0 flex-1 items-center justify-end gap-1.5 overflow-hidden max-sm:gap-1 sm:gap-2"
        role="toolbar"
        aria-label="Sort and view products"
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-navy-900/8 bg-white/80 p-1 scrollbar-hide max-sm:max-w-[calc(100%-5.5rem)] sm:gap-1 sm:p-0.5',
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
                  'inline-flex shrink-0 items-center justify-center gap-1 rounded-full font-semibold transition-all duration-300',
                  'max-sm:min-h-9 max-sm:min-w-9 max-sm:px-2.5 max-sm:py-2 max-sm:text-xs',
                  'px-2 py-1 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs',
                  active
                    ? 'bg-gradient-to-r from-festive-500 to-gold-500 text-navy-950 shadow-[0_2px_10px_rgba(234,88,12,0.25)]'
                    : 'text-navy-700/65 hover:bg-navy-900/[0.04] hover:text-navy-900',
                )}
              >
                <Icon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">{label}</span>
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

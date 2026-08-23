import type { Category, Product } from '@/types/database'
import type { CatalogueView } from './CatalogueToolbar'
import { ProductGrid } from './ProductGrid'
import { ProductTable } from './ProductTable'

export interface CategoryProductGroup {
  id: string
  name: string
  products: Product[]
}

export function groupProductsByCategory(
  products: Product[],
  categories: Category[],
): CategoryProductGroup[] {
  const byId = new Map<string, Product[]>()
  const uncategorized: Product[] = []

  for (const product of products) {
    if (product.category_id) {
      const list = byId.get(product.category_id) ?? []
      list.push(product)
      byId.set(product.category_id, list)
    } else {
      uncategorized.push(product)
    }
  }

  const orderedCategories = [...categories].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )

  const groups: CategoryProductGroup[] = []

  for (const category of orderedCategories) {
    const list = byId.get(category.id)
    if (!list?.length) continue
    groups.push({ id: category.id, name: category.name, products: list })
    byId.delete(category.id)
  }

  const leftover = [...byId.entries()].sort((a, b) => {
    const orderA = a[1][0]?.category?.sort_order ?? Number.MAX_SAFE_INTEGER
    const orderB = b[1][0]?.category?.sort_order ?? Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })

  for (const [id, list] of leftover) {
    groups.push({
      id,
      name: list[0]?.category?.name || 'Other',
      products: list,
    })
  }

  if (uncategorized.length > 0) {
    groups.push({ id: 'uncategorized', name: 'Other', products: uncategorized })
  }

  return groups
}

interface CategoryGroupedProductsProps {
  groups: CategoryProductGroup[]
  view: CatalogueView
}

function CategoryProductSection({
  group,
  view,
}: {
  group: CategoryProductGroup
  view: CatalogueView
}) {
  return (
    <section id={`category-${group.id}`} className="scroll-mt-32">
      <div className="mb-4 flex items-center gap-2.5 border-b border-navy-900/8 pb-3 sm:mb-5">
        <span
          className="h-0.5 w-8 shrink-0 rounded-full bg-gradient-to-r from-festive-500 to-gold-400 sm:w-10"
          aria-hidden="true"
        />
        <h2 className="min-w-0 font-display text-lg font-bold text-navy-900 sm:text-2xl">
          {group.name}
        </h2>
        <span className="ml-auto shrink-0 rounded-full border border-gold-500/25 bg-gold-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-600">
          {group.products.length} {group.products.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {view === 'table' ? (
        <ProductTable products={group.products} />
      ) : (
        <ProductGrid
          products={group.products}
          columns={3}
          variant="catalogue"
          initialVisible={group.products.length}
          batchSize={group.products.length}
        />
      )}
    </section>
  )
}

export function CategoryGroupedProducts({ groups, view }: CategoryGroupedProductsProps) {
  return (
    <div className="space-y-10 sm:space-y-14">
      {groups.map((group) => (
        <CategoryProductSection key={group.id} group={group} view={view} />
      ))}
    </div>
  )
}

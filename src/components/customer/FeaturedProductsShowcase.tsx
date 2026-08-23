import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Product } from '@/types/database'
import { usePauseWhenHidden } from '@/hooks/usePauseWhenHidden'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'
import { ProductCard } from './ProductCard'

interface FeaturedProductsShowcaseProps {
  products: Product[]
}

export function FeaturedProductsShowcase({ products }: FeaturedProductsShowcaseProps) {
  const { ref, paused } = usePauseWhenHidden<HTMLElement>()
  const loopProducts = useMemo(() => [...products, ...products], [products])

  if (products.length === 0) return null

  const marqueeStyle = {
    '--marquee-duration': `${Math.max(products.length * 6, 36)}s`,
  } as CSSProperties

  return (
    <section ref={ref} className={cn('relative overflow-hidden bg-white pb-6 pt-2 sm:pb-8 sm:pt-4', paused && 'marquee-paused')}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <SectionHeader
            label="Featured"
            title="Featured Products"
            description="Handpicked selections for your celebrations"
            showAccent={false}
          />
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-gold-500/25 bg-cream-50 px-4 py-2 text-xs font-semibold text-festive-500 transition-colors hover:border-gold-500/40 hover:bg-gold-500/10 sm:self-end sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="featured-marquee mt-6 sm:mt-8" style={marqueeStyle}>
        <div className="featured-marquee-track gap-4 px-3 sm:gap-5 sm:px-6">
          {loopProducts.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="w-[240px] shrink-0 self-start sm:w-[260px] lg:w-[280px]"
            >
              <ProductCard product={product} variant="featured" index={i % products.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Link, type LinkProps } from 'react-router-dom'
import type { Product } from '@/types/database'
import { productLinkProps } from '@/lib/productLink'

type ProductLinkProps = Omit<LinkProps, 'to' | 'state'> & {
  product: Product
}

export function ProductLink({ product, ...props }: ProductLinkProps) {
  return <Link {...productLinkProps(product)} {...props} />
}

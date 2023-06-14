import { Product, Variant } from 'swell-js'

export type ProductVariationSelectorProps = {
  product: Product
  activeVariant: Variant | null
  setActiveVariant: (variant: Variant | null) => void
}

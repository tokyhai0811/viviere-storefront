/**
 * Storefront types modelled on Medusa v2's Store API (`@medusajs/types` HttpTypes).
 * Only the fields this storefront reads are declared. When the Medusa backend is
 * ready, these can be replaced with `HttpTypes.StoreProduct`, `HttpTypes.StoreCart`, etc.
 */

export type StoreImage = {
  id: string
  url: string
  rank: number
}

export type StoreProductOptionValue = {
  id: string
  value: string
  option_id: string
}

export type StoreProductOption = {
  id: string
  title: string
  values: StoreProductOptionValue[]
}

export type StoreCalculatedPrice = {
  id: string
  calculated_amount: number
  original_amount: number
  currency_code: string
}

export type StoreProductVariant = {
  id: string
  title: string
  sku: string | null
  manage_inventory: boolean
  inventory_quantity: number
  options: StoreProductOptionValue[]
  calculated_price: StoreCalculatedPrice
}

export type StoreCollection = {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown> | null
}

export type StoreProductTag = {
  id: string
  value: string
}

/**
 * Shopify metafields on the current theme (custom.size, custom.material_and_care,
 * custom.origin, custom.shipping_returns, custom.color_group) map to Medusa's
 * free-form `metadata` object.
 */
export type ProductMetadata = {
  color_group?: string
  color?: string
  swatch_hex?: string
  size?: string
  material_and_care?: string
  origin?: string
  shipping_returns?: string
  /** Display order within the catalogue (set by the backend seed). */
  rank?: number
}

export type StoreProduct = {
  id: string
  title: string
  handle: string
  subtitle: string | null
  description: string | null
  thumbnail: string | null
  images: StoreImage[]
  options: StoreProductOption[]
  variants: StoreProductVariant[]
  collection_id: string | null
  collection: StoreCollection | null
  tags: StoreProductTag[]
  metadata: ProductMetadata | null
}

export type StoreCartLineItem = {
  id: string
  title: string
  subtitle: string | null
  thumbnail: string | null
  quantity: number
  variant_id: string
  product_id: string
  product_handle: string
  unit_price: number
  total: number
}

export type StoreCart = {
  id: string
  currency_code: string
  items: StoreCartLineItem[]
  item_total: number
  subtotal: number
  total: number
  /** Set once a shipping method is chosen at checkout. */
  shipping_total?: number
  tax_total?: number
}

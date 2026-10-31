import type { ProductMetadata, StoreCollection, StoreProduct } from "@/lib/types"
import type { Lang } from "@/lib/i18n/config"
import { medusaEnabled } from "@/lib/medusa/client"
import { collections as mockCollections, products as mockProducts } from "./mock"
import { medusaListCollections, medusaListProducts } from "./medusa"

/**
 * Data access layer. Every function returns Medusa-shaped objects, read from the
 * Medusa backend when NEXT_PUBLIC_MEDUSA_BACKEND_URL and
 * NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY are set, otherwise from the mock catalogue.
 * The catalogue is small (six products), so lookups filter the full list.
 */

// Shopify's built-in /collections/all has no Medusa equivalent.
const ALL_COLLECTION: StoreCollection = { id: "pcol_all", title: "All", handle: "all" }

async function allProducts(): Promise<StoreProduct[]> {
  return medusaEnabled ? medusaListProducts() : mockProducts
}

export async function listProducts(params?: {
  collection_id?: string
  limit?: number
}): Promise<{ products: StoreProduct[]; count: number }> {
  let result = await allProducts()
  if (params?.collection_id && params.collection_id !== ALL_COLLECTION.id) {
    result = result.filter((p) => p.collection_id === params.collection_id)
  }
  const count = result.length
  if (params?.limit) result = result.slice(0, params.limit)
  return { products: result, count }
}

export async function getProductByHandle(handle: string): Promise<StoreProduct | null> {
  return (await allProducts()).find((p) => p.handle === handle) ?? null
}

/** Products sharing the same `metadata.color_group`, used for the colour swatches. */
export async function listColorSiblings(product: StoreProduct): Promise<StoreProduct[]> {
  const group = product.metadata?.color_group
  if (!group) return []
  return (await allProducts()).filter((p) => p.metadata?.color_group === group)
}

/**
 * A text metafield in `lang`. Medusa translates core fields but not metadata,
 * so other languages live next to the English value with a suffix, e.g.
 * `material_and_care_vi` (editable as a custom field in Bulk edit).
 */
export function metaText(
  product: StoreProduct,
  key: "size" | "material_and_care" | "origin" | "shipping_returns" | "color",
  lang: Lang,
): string | undefined {
  const meta = (product.metadata ?? {}) as ProductMetadata & Record<string, unknown>
  const localized = lang === "en" ? undefined : meta[`${key}_${lang}`]
  return typeof localized === "string" && localized ? localized : meta[key]
}

/** Short colour name for labels: the (translated) subtitle, else the English metadata colour. */
export const colorLabel = (product: StoreProduct) => product.subtitle || product.metadata?.color || product.title

export async function listCollections(): Promise<StoreCollection[]> {
  if (!medusaEnabled) return mockCollections
  return [ALL_COLLECTION, ...(await medusaListCollections())]
}

export async function getCollectionByHandle(handle: string): Promise<StoreCollection | null> {
  return (await listCollections()).find((c) => c.handle === handle) ?? null
}

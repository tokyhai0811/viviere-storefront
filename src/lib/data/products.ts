import type { StoreCollection, StoreProduct } from "@/lib/types"
import { collections, products } from "./mock"

/**
 * Data access layer. Every function is async and returns Medusa-shaped objects,
 * so swapping to the real backend means replacing each body with the matching
 * JS SDK call, e.g. `sdk.store.product.list({ handle, fields: "*variants.calculated_price" })`.
 */

export async function listProducts(params?: {
  collection_id?: string
  limit?: number
}): Promise<{ products: StoreProduct[]; count: number }> {
  let result = products
  if (params?.collection_id && params.collection_id !== "pcol_all") {
    result = result.filter((p) => p.collection_id === params.collection_id)
  }
  const count = result.length
  if (params?.limit) result = result.slice(0, params.limit)
  return { products: result, count }
}

export async function getProductByHandle(handle: string): Promise<StoreProduct | null> {
  return products.find((p) => p.handle === handle) ?? null
}

/** Products sharing the same `metadata.color_group`, used for the colour swatches. */
export async function listColorSiblings(product: StoreProduct): Promise<StoreProduct[]> {
  const group = product.metadata?.color_group
  if (!group) return []
  return products.filter((p) => p.metadata?.color_group === group)
}

export async function listCollections(): Promise<StoreCollection[]> {
  return collections
}

export async function getCollectionByHandle(handle: string): Promise<StoreCollection | null> {
  return collections.find((c) => c.handle === handle) ?? null
}

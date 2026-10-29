"use cache"

import { cacheLife } from "next/cache"
import { sdk } from "@/lib/medusa/client"
import type { StoreCollection, StoreProduct } from "@/lib/types"

/**
 * Catalogue reads from the Medusa Store API. Cached for a few minutes so pages
 * stay static while picking up admin edits (price, stock, copy) without a redeploy.
 */

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,*options.values,*images,*collection,*tags,+metadata"

// The UI always shows a gallery; pad with blank placeholders when a product has no images.
const PLACEHOLDER_IMAGE_COUNT = 4

export async function getRegionId(): Promise<string> {
  cacheLife("hours")
  if (process.env.NEXT_PUBLIC_MEDUSA_REGION_ID) return process.env.NEXT_PUBLIC_MEDUSA_REGION_ID
  const { regions } = await sdk.store.region.list({ fields: "id,currency_code" })
  const region = regions.find((r) => r.currency_code === "vnd") ?? regions[0]
  if (!region) throw new Error("Medusa has no regions. Run the backend seed first.")
  return region.id
}

function normalizeProduct(p: Record<string, unknown>): StoreProduct {
  const product = p as unknown as StoreProduct
  const images = product.images?.length
    ? [...product.images].sort((x, y) => x.rank - y.rank)
    : Array.from({ length: PLACEHOLDER_IMAGE_COUNT }, (_, rank) => ({
        id: `${product.id}_placeholder_${rank}`,
        url: "",
        rank,
      }))
  return {
    ...product,
    images,
    tags: product.tags ?? [],
    variants: product.variants.map((v) => ({ ...v, inventory_quantity: v.inventory_quantity ?? 0 })),
  }
}

export async function medusaListProducts(): Promise<StoreProduct[]> {
  cacheLife("minutes")
  const region_id = await getRegionId()
  const { products } = await sdk.store.product.list({ region_id, fields: PRODUCT_FIELDS, limit: 100 })
  return products
    .map((p) => normalizeProduct(p as unknown as Record<string, unknown>))
    .sort((a, b) => (a.metadata?.rank ?? Infinity) - (b.metadata?.rank ?? Infinity))
}

export async function medusaListCollections(): Promise<StoreCollection[]> {
  cacheLife("minutes")
  const { collections } = await sdk.store.collection.list({ fields: "id,title,handle,metadata" })
  return collections
}

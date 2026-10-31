"use cache"

import { cacheLife } from "next/cache"
import { sdk } from "@/lib/medusa/client"
import { LANG_LOCALE, MARKET_CURRENCY } from "@/lib/i18n/config"
import { getLang, getMarket } from "@/lib/i18n/server"
import type { StoreCollection, StoreProduct } from "@/lib/types"

/**
 * Catalogue reads from the Medusa Store API. Cached for a few minutes so pages
 * stay static while picking up admin edits (price, stock, copy) without a redeploy.
 * Prices follow the page's market (its region) and copy follows its language
 * (Medusa translations); both come from the route, so each combination is
 * cached separately.
 */

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.options,*options,*options.values,*images,*collection,*tags,+metadata"

// The UI always shows a gallery; pad with blank placeholders when a product has no images.
const PLACEHOLDER_IMAGE_COUNT = 4

/** The market's region: the one in its currency, else the first (e.g. before the USD region exists). */
export async function getRegionId(): Promise<string> {
  cacheLife("hours")
  const currency = MARKET_CURRENCY[await getMarket()]
  const { regions } = await sdk.store.region.list({ fields: "id,currency_code" })
  const region = regions.find((r) => r.currency_code === currency) ?? regions[0]
  if (!region) throw new Error("Medusa has no regions. Run the backend seed first.")
  return region.id
}

// Medusa returns translated fields for `locale`; English is the stored default.
const localeQuery = async () => {
  const lang = await getLang()
  return lang === "en" ? {} : { locale: LANG_LOCALE[lang] }
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
  const { products } = await sdk.store.product.list({
    region_id,
    fields: PRODUCT_FIELDS,
    limit: 100,
    ...(await localeQuery()),
  })
  return products
    .map((p) => normalizeProduct(p as unknown as Record<string, unknown>))
    .sort((a, b) => (a.metadata?.rank ?? Infinity) - (b.metadata?.rank ?? Infinity))
}

export async function medusaListCollections(): Promise<StoreCollection[]> {
  cacheLife("minutes")
  const { collections } = await sdk.store.collection.list({
    fields: "id,title,handle,metadata",
    ...(await localeQuery()),
  })
  return collections
}

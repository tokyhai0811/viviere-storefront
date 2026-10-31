import type { StoreCollection, StoreProduct } from "@/lib/types"

/**
 * Mock catalogue. Product handles, colours and copy come from the Shopify theme
 * export (templates/index.json, templates/product.json). Prices, sizes and
 * policy text are placeholders until the Medusa backend supplies real data.
 */

export const CURRENCY_CODE = "vnd"
const PLACEHOLDER_PRICE = 1_860_000

export const collections: StoreCollection[] = [
  { id: "pcol_all", title: "All", handle: "all" },
  { id: "pcol_bateau", title: "The Bateau", handle: "the-bateau" },
]

const description =
  "Inspired by the silhouette of a “bateau”, a softly structured shoulder bag in microfiber leather with a premium PU lining, gold-plated hardware and a gold foil stamped logo. Each bag is made by skilled leatherworkers in Vietnam in small batches."

const sharedMetadata = {
  color_group: "bateau",
  size: "Placeholder dimensions: W 00 × H 00 × D 00 cm. Shoulder strap drop 00 cm.",
  material_and_care:
    "Exterior: microfiber leather. Lining: premium PU. Hardware: gold-plated. Wipe clean with a soft, dry cloth and store in the dust bag provided.",
  origin: "Handmade in Vietnam.",
  shipping_returns:
    "Placeholder policy text. Orders ship within 2–4 business days. Unused items can be returned within 14 days of delivery.",
}

const bateauColors: { color: string; hex: string; handle: string }[] = [
  { color: "Burgundy", hex: "#80001e", handle: "microfiber-leather-shoulder-bag-bateau-burgundy" },
  { color: "Brown", hex: "#6b4226", handle: "the-bateau-brown" },
  { color: "Teal", hex: "#1f5f5b", handle: "the-bateau-teal" },
  { color: "Black", hex: "#000000", handle: "the-bateau-black" },
  { color: "Blue", hex: "#4a90e2", handle: "the-bateau-blue" },
  { color: "Yellow", hex: "#e3b23c", handle: "microfiber-leather-shoulder-bag-bateau-yellow" },
]

const bateauCollection = collections[1]

export const products: StoreProduct[] = bateauColors.map(({ color, hex, handle }, i) => {
  const key = color.toLowerCase()
  const id = `prod_bateau_${key}`
  const optionId = `opt_${key}_color`
  const optionValue = { id: `optval_${key}`, value: color, option_id: optionId }

  return {
    id,
    title: `The Bateau - ${color}`,
    handle,
    subtitle: color,
    description,
    // Images are intentionally empty: the UI renders blank placeholders.
    thumbnail: null,
    images: Array.from({ length: 4 }, (_, rank) => ({
      id: `img_${key}_${rank}`,
      url: "",
      rank,
    })),
    options: [{ id: optionId, title: "Color", values: [optionValue] }],
    variants: [
      {
        id: `variant_bateau_${key}`,
        title: color,
        sku: `BATEAU-${color.toUpperCase()}`,
        manage_inventory: true,
        inventory_quantity: 10 - i,
        options: [optionValue],
        calculated_price: {
          id: `price_${key}`,
          calculated_amount: PLACEHOLDER_PRICE,
          original_amount: PLACEHOLDER_PRICE,
          currency_code: CURRENCY_CODE,
        },
      },
    ],
    collection_id: bateauCollection.id,
    collection: bateauCollection,
    tags: [{ id: `ptag_${key}`, value: `color-${key}` }],
    metadata: { ...sharedMetadata, color: color, swatch_hex: hex },
  }
})

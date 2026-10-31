import type { StoreCollection, StoreProduct } from "@/lib/types"

/**
 * Mock catalogue, following viviere.vn (October 2026): handles, collection
 * order, price, product details and stock (Blue and Yellow sold out). Used
 * when no Medusa backend is configured.
 */

export const CURRENCY_CODE = "vnd"
const PRICE = 1_836_000

export const collections: StoreCollection[] = [
  { id: "pcol_all", title: "All", handle: "all" },
  { id: "pcol_bateau", title: "The Bateau", handle: "the-bateau" },
]

const description =
  "Inspired by the silhouette of a “bateau”, a shoulder bag in premium microfiber leather with a PU leather lining, gold-tone hardware and an interior zipped pocket. Its curved base and fluid lines carry an ease that suits any occasion."

const sharedMetadata = {
  color_group: "bateau",
  size: "Length: 35 cm / 13.8 in\nWidth: 6 cm / 2.4 in\nHeight: 16.5 cm / 6.5 in\nHandle drop: 21 cm / 8.2 in\nWeight: 300 g",
  material_and_care:
    "Outer: 100% microfiber leather\nLining: 100% premium PU leather\nHardware: gold antimony-plated iron",
  origin: "Made in Ho Chi Minh City, Vietnam.",
  shipping_returns:
    "Free shipping on every order within Vietnam, and 15-day returns. International shipping is available.\nOrders are prepared in 1–2 business days, then delivered in 1–2 days in Ho Chi Minh City, 2–3 days to southern provinces and 3–5 business days to central and northern provinces.\nPayment is online through OnePay. For a defective item or an order error, contact us for an exchange or return.",
}

// viviere.vn's collection order. Blue and Yellow are sold out there.
const bateauColors: { color: string; hex: string; stock: number }[] = [
  { color: "Teal", hex: "#1f5f5b", stock: 10 },
  { color: "Burgundy", hex: "#80001e", stock: 10 },
  { color: "Brown", hex: "#6b4226", stock: 10 },
  { color: "Black", hex: "#000000", stock: 10 },
  { color: "Blue", hex: "#4a90e2", stock: 0 },
  { color: "Yellow", hex: "#e3b23c", stock: 0 },
]

const bateauCollection = collections[1]

export const products: StoreProduct[] = bateauColors.map(({ color, hex, stock }) => {
  const key = color.toLowerCase()
  const id = `prod_bateau_${key}`
  const optionId = `opt_${key}_color`
  const optionValue = { id: `optval_${key}`, value: color, option_id: optionId }

  return {
    id,
    title: `The Bateau - ${color}`,
    handle: `microfiber-leather-shoulder-bag-bateau-${key}`,
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
        inventory_quantity: stock,
        options: [optionValue],
        calculated_price: {
          id: `price_${key}`,
          calculated_amount: PRICE,
          original_amount: PRICE,
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

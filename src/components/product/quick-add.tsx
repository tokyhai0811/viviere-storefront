"use client"

import { useState } from "react"
import type { StoreProduct } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { useI18n } from "@/lib/i18n/client"

/**
 * viviere.vn's collection cards have an "Add" button (Horizon quick add) that
 * puts the product's only variant in the cart without leaving the page.
 */
export function QuickAdd({ product }: { product: StoreProduct }) {
  const { addItem } = useCart()
  const { t } = useI18n()
  const [added, setAdded] = useState(false)
  const variant = product.variants[0]
  if (!variant) return null

  return (
    <button
      type="button"
      className="absolute inset-x-2 bottom-2 bg-white/90 py-2 text-[0.75rem] uppercase text-black opacity-100 transition-opacity hover:bg-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      onClick={(e) => {
        // The card is a link; adding shouldn't open the product page.
        e.preventDefault()
        e.stopPropagation()
        addItem(product, variant)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      }}
    >
      {added ? t.product.added : t.product.add}
    </button>
  )
}

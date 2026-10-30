"use client"

import { useState } from "react"
import type { StoreProduct } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { useI18n } from "@/lib/i18n/client"

/** blocks/buy-buttons with only add-to-cart enabled (button-secondary style). */
export function AddToCart({ product }: { product: StoreProduct }) {
  const { addItem } = useCart()
  const { t } = useI18n()
  const [pending, setPending] = useState(false)
  const variant = product.variants[0]
  const soldOut = variant.manage_inventory && variant.inventory_quantity <= 0

  return (
    <button
      type="button"
      disabled={soldOut || pending}
      className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
      onClick={() => {
        setPending(true)
        addItem(product, variant)
        setTimeout(() => setPending(false), 300)
      }}
    >
      {soldOut ? t.product.soldOut : t.product.addToCart}
    </button>
  )
}

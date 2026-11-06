"use client"

import { useState } from "react"
import type { StoreProduct } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { useI18n } from "@/lib/i18n/client"
import { CartPlusIcon } from "@/components/icons"

/**
 * viviere.vn's collection cards have a round cart button (Horizon quick add)
 * that slides in when the image is hovered and widens to show "Add" when the
 * button itself is hovered. It puts the product's only variant in the cart
 * without leaving the page. Phones don't get it.
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
      aria-label={added ? t.product.added : t.product.add}
      className="group/add pointer-events-none absolute right-3 bottom-4 hidden h-[38px] min-w-[38px] translate-y-2 items-center justify-center rounded-full bg-white px-[9px] text-black opacity-0 transition duration-200 group-hover/media:pointer-events-auto group-hover/media:translate-y-0 group-hover/media:opacity-100 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 md:flex"
      onClick={(e) => {
        // The card is a link; adding shouldn't open the product page.
        e.preventDefault()
        e.stopPropagation()
        addItem(product, variant)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      }}
    >
      {added ? "✓" : <CartPlusIcon />}
      <span className="max-w-0 translate-x-[1em] overflow-hidden text-[0.75rem] whitespace-nowrap uppercase opacity-0 transition-all duration-200 group-hover/add:ml-1 group-hover/add:max-w-24 group-hover/add:translate-x-0 group-hover/add:opacity-100 group-focus-visible/add:ml-1 group-focus-visible/add:max-w-24 group-focus-visible/add:translate-x-0 group-focus-visible/add:opacity-100">
        {added ? t.product.added : t.product.add}
      </span>
    </button>
  )
}

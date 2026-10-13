"use client"

import Link from "next/link"
import type { StoreCartLineItem } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { convertToLocale } from "@/lib/util/money"
import { Placeholder } from "@/components/placeholder"
import { MinusIcon, PlusIcon } from "@/components/icons"

export function QuantitySelector({
  value,
  onChange,
}: {
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="inline-flex h-9 items-center border border-[#00000021]">
      <button
        type="button"
        className="flex h-full w-9 items-center justify-center hover:bg-[#f5f5f5]"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon />
      </button>
      <span className="w-8 text-center" aria-live="polite">{value}</span>
      <button
        type="button"
        className="flex h-full w-9 items-center justify-center hover:bg-[#f5f5f5]"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon />
      </button>
    </div>
  )
}

export function CartLine({
  item,
  currencyCode,
  onNavigate,
}: {
  item: StoreCartLineItem
  currencyCode: string
  onNavigate?: () => void
}) {
  const { updateQuantity, removeItem } = useCart()
  const href = `/products/${item.product_handle}`

  return (
    <li className="grid grid-cols-[96px_1fr] gap-4 border-b border-border py-6 md:grid-cols-[120px_1fr]">
      <Link href={href} onClick={onNavigate}>
        <Placeholder label={item.title} className="aspect-square w-full" />
      </Link>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={href} onClick={onNavigate} className="uppercase hover:opacity-60">
              {item.title}
            </Link>
            {item.subtitle && <p className="text-muted">Color: {item.subtitle}</p>}
          </div>
          <p className="whitespace-nowrap">
            {convertToLocale({ amount: item.total, currency_code: currencyCode })}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-4">
          <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
          <button
            type="button"
            className="text-muted underline underline-offset-2 hover:text-black"
            onClick={() => removeItem(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

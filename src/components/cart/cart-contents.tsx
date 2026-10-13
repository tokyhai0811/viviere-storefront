"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { convertToLocale } from "@/lib/util/money"
import { CartLine } from "./cart-line"

/** sections/main-cart: title with count, line items with dividers, summary column. */
export function CartContents() {
  const { cart, itemCount } = useCart()

  return (
    <section className="page-width pt-8">
      <h1 className="type-h4">
        Cart <span className="font-body text-[0.75rem] text-muted">({itemCount})</span>
      </h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-start gap-6 py-16">
          <p className="type-h4">Your cart is empty</p>
          <Link href="/collections/all" className="btn-primary">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-[1fr_380px] md:gap-16">
          <ul className="border-t border-border md:mt-4">
            {cart.items.map((item) => (
              <CartLine key={item.id} item={item} currencyCode={cart.currency_code} />
            ))}
          </ul>
          <aside className="h-fit space-y-4 bg-white md:sticky md:top-24 md:mt-4 md:border-t md:border-border md:pt-6">
            <div className="flex justify-between uppercase">
              <span>Subtotal</span>
              <span>{convertToLocale({ amount: cart.subtotal, currency_code: cart.currency_code })}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-[0.875rem] uppercase">
              <span>Estimated total</span>
              <span>{convertToLocale({ amount: cart.total, currency_code: cart.currency_code })}</span>
            </div>
            <p className="text-muted">Taxes, discounts and shipping calculated at checkout.</p>
            <button type="button" className="btn-primary w-full">Check out</button>
          </aside>
        </div>
      )}
    </section>
  )
}

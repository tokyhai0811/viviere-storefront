"use client"

import { Link } from "@/components/link"
import { useCart } from "@/lib/cart-context"
import { useI18n } from "@/lib/i18n/client"
import { convertToLocale } from "@/lib/util/money"
import { CartLine } from "./cart-line"

/** sections/main-cart: title with count, line items with dividers, summary column. */
export function CartContents() {
  const { cart, itemCount } = useCart()
  const { t, locale } = useI18n()
  const money = (amount: number) => convertToLocale({ amount, currency_code: cart.currency_code, locale })

  return (
    <section className="page-width pt-8">
      <h1 className="type-h4">
        {t.cart.title} <span className="font-body text-[0.75rem] text-muted">({itemCount})</span>
      </h1>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-start gap-6 py-16">
          <p className="type-h4">{t.cart.empty}</p>
          <Link href="/collections/all" className="btn-primary">{t.cart.continueShopping}</Link>
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
              <span>{t.cart.subtotal}</span>
              <span>{money(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-[0.875rem] uppercase">
              <span>{t.cart.estimatedTotal}</span>
              <span>{money(cart.total)}</span>
            </div>
            <p className="text-muted">{t.cart.taxesDiscountsShipping}</p>
            <Link href="/checkout" className="btn-primary w-full">{t.cart.checkOut}</Link>
          </aside>
        </div>
      )}
    </section>
  )
}

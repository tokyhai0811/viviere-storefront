"use client"

import { Link } from "@/components/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { sdk } from "@/lib/medusa/client"
import { convertToLocale } from "@/lib/util/money"
import { useI18n } from "@/lib/i18n/client"

type Order = {
  id: string
  display_id: number
  email: string
  currency_code: string
  total: number
  shipping_total: number
  items: { id: string; title: string; subtitle: string | null; quantity: number; total: number }[]
  shipping_address: { first_name: string; last_name: string; address_1: string; city: string; province: string } | null
}

/** Thank-you page after checkout, read back from Medusa so it shows the stored order. */
export function OrderConfirmation() {
  const { t, locale } = useI18n()
  const id = useSearchParams().get("id")
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    sdk.store.order
      .retrieve(id, { fields: "id,display_id,email,currency_code,total,shipping_total,*items,*shipping_address" })
      .then(({ order }) => setOrder(order as unknown as Order))
      .catch(() => setError(true))
  }, [id])

  if (error || !id) {
    return (
      <section className="page-width py-16">
        <p>{t.order.loadFailed}</p>
      </section>
    )
  }
  if (!order) return <section className="page-width min-h-[50vh] py-16" aria-busy />

  const money = (amount: number) => convertToLocale({ amount, currency_code: order.currency_code, locale })
  const a = order.shipping_address

  return (
    <section className="page-width max-w-[640px] space-y-8 py-16">
      <div className="space-y-2">
        <h1 className="type-h2">{t.order.thankYou}</h1>
        <p>{t.order.confirmed(order.display_id, order.email)}</p>
      </div>
      <ul className="border-t border-border">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between border-b border-border py-4">
            <span className="uppercase">
              {item.title} × {item.quantity}
            </span>
            <span>{money(item.total)}</span>
          </li>
        ))}
        <li className="flex justify-between py-2">
          <span>{t.order.shipping}</span>
          <span>{money(order.shipping_total)}</span>
        </li>
        <li className="flex justify-between py-2 uppercase">
          <span>{t.order.total}</span>
          <span>{money(order.total)}</span>
        </li>
      </ul>
      {a && (
        <p className="text-muted">
          {t.order.deliveringTo([`${a.first_name} ${a.last_name}`, a.address_1, a.city, a.province].filter(Boolean).join(", "))}
        </p>
      )}
      <Link href="/collections/all" className="btn-primary">{t.order.continueShopping}</Link>
    </section>
  )
}

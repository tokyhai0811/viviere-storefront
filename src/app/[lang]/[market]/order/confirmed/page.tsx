import type { Metadata } from "next"
import { Suspense } from "react"
import { OrderConfirmation } from "@/components/checkout/order-confirmation"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.orderConfirmed }
}

/** /order/confirmed?id=order_…, reached after checkout. */
export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<section className="page-width min-h-[50vh] py-16" aria-busy />}>
      <OrderConfirmation />
    </Suspense>
  )
}

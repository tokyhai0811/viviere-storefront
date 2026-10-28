import type { Metadata } from "next"
import { Suspense } from "react"
import { OrderConfirmation } from "@/components/checkout/order-confirmation"

export const metadata: Metadata = { title: "Order confirmed" }

/** /order/confirmed?id=order_…, reached after checkout. */
export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<section className="page-width min-h-[50vh] py-16" aria-busy />}>
      <OrderConfirmation />
    </Suspense>
  )
}

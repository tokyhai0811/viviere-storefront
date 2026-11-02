import type { Metadata } from "next"
import { noindex } from "@/lib/seo"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.checkout, robots: noindex }
}

export default function CheckoutPage() {
  return <CheckoutForm />
}

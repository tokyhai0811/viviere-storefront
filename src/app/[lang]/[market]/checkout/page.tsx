import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { getDictionary } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.checkout }
}

export default function CheckoutPage() {
  return <CheckoutForm />
}

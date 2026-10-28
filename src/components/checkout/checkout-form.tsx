"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { CART_FIELDS, useCart } from "@/lib/cart-context"
import { sdk } from "@/lib/medusa/client"
import type { StoreCart } from "@/lib/types"
import { convertToLocale } from "@/lib/util/money"
import { ProductImage } from "@/components/product-image"

/**
 * One-page checkout against the Medusa Store API:
 *   1. list shipping options for the cart and add the chosen one,
 *   2. save email and address on the cart,
 *   3. start a payment session with the manual provider (pp_system_default),
 *   4. complete the cart, which turns it into an order in the admin.
 * A real payment provider (e.g. Stripe, VNPay) would replace step 3.
 */

type ShippingOption = { id: string; name: string; amount: number; type?: { description?: string } }

const PAYMENT_PROVIDER = "pp_system_default"

const toCart = (cart: unknown) => cart as StoreCart

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  className = "",
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[12px] text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-11 border border-[#00000021] px-3 text-[0.875rem] outline-none focus:border-black"
      />
    </label>
  )
}

export function CheckoutForm() {
  const router = useRouter()
  const { cart, medusa, setCart, clear } = useCart()
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [optionId, setOptionId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load shipping options once the cart exists, and preselect the first one.
  useEffect(() => {
    if (!medusa || !cart.id) return
    sdk.store.fulfillment
      .listCartOptions({ cart_id: cart.id })
      .then(({ shipping_options }) => {
        const list = shipping_options as unknown as ShippingOption[]
        setOptions(list)
        setOptionId((current) => current ?? list[0]?.id ?? null)
      })
      .catch((e) => setError(e.message))
  }, [medusa, cart.id])

  // Adding the method on selection lets the summary show the real totals.
  useEffect(() => {
    if (!cart.id || !optionId) return
    sdk.store.cart
      .addShippingMethod(cart.id, { option_id: optionId }, { fields: CART_FIELDS })
      .then(({ cart }) => setCart(toCart(cart)))
      .catch((e) => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the choice changes
  }, [optionId])

  if (!medusa) {
    return (
      <section className="page-width flex flex-col items-start gap-6 py-16">
        <h1 className="type-h4">Checkout</h1>
        <p>Checkout needs the Medusa backend. Set the NEXT_PUBLIC_MEDUSA_* variables to enable it.</p>
      </section>
    )
  }

  if (!cart.items.length) {
    return (
      <section className="page-width flex flex-col items-start gap-6 py-16">
        <h1 className="type-h4">Checkout</h1>
        <p className="type-h4">Your cart is empty</p>
        <Link href="/collections/all" className="btn-primary">Continue shopping</Link>
      </section>
    )
  }

  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!optionId) return setError("Choose a delivery method.")
    const form = new FormData(e.currentTarget)
    const value = (k: string) => String(form.get(k) ?? "").trim()
    const address = {
      first_name: value("first_name"),
      last_name: value("last_name"),
      phone: value("phone"),
      address_1: value("address_1"),
      city: value("city"),
      province: value("province"),
      country_code: "vn",
    }

    setPlacing(true)
    setError(null)
    try {
      const { cart: updated } = await sdk.store.cart.update(
        cart.id,
        { email: value("email"), shipping_address: address, billing_address: address },
        { fields: `${CART_FIELDS},*payment_collection` },
      )
      await sdk.store.payment.initiatePaymentSession(updated, { provider_id: PAYMENT_PROVIDER })
      const result = await sdk.store.cart.complete(cart.id)
      if (result.type !== "order") throw new Error(result.error?.message ?? "The order could not be placed.")
      clear()
      router.push(`/order/confirmed?id=${result.order.id}`)
    } catch (err) {
      setError((err as Error).message)
      setPlacing(false)
    }
  }

  return (
    <section className="page-width pt-8 pb-20">
      <h1 className="type-h4 mb-8">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-10 md:grid-cols-[1fr_380px] md:gap-16">
        <div className="space-y-10">
          <fieldset className="space-y-4">
            <legend className="mb-4 uppercase">Contact</legend>
            <Field label="Email" name="email" type="email" autoComplete="email" />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
          </fieldset>

          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="mb-4 uppercase">Delivery</legend>
            <Field label="First name" name="first_name" autoComplete="given-name" />
            <Field label="Last name" name="last_name" autoComplete="family-name" />
            <Field label="Address" name="address_1" autoComplete="street-address" className="col-span-2" />
            <Field label="City / District" name="city" autoComplete="address-level2" />
            <Field label="Province" name="province" autoComplete="address-level1" />
            <p className="col-span-2 text-muted">We currently deliver within Vietnam only.</p>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-4 uppercase">Delivery method</legend>
            {options.map((o) => (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center justify-between border px-4 py-3 ${
                  o.id === optionId ? "border-black" : "border-[#00000021]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping_option"
                    checked={o.id === optionId}
                    onChange={() => setOptionId(o.id)}
                  />
                  <span>
                    {o.name}
                    {o.type?.description && <span className="block text-muted">{o.type.description}</span>}
                  </span>
                </span>
                <span>{convertToLocale({ amount: o.amount, currency_code: cart.currency_code })}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-4 uppercase">Payment</legend>
            <label className="flex items-center gap-3 border border-black px-4 py-3">
              <input type="radio" checked readOnly />
              <span>
                Pay on delivery
                <span className="block text-muted">Test payment: no card is charged.</span>
              </span>
            </label>
          </fieldset>
        </div>

        <aside className="h-fit space-y-4 md:sticky md:top-24">
          <ul className="space-y-4 border-b border-border pb-4">
            {cart.items.map((item) => (
              <li key={item.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-3">
                <ProductImage src={item.thumbnail} alt={item.title} sizes="64px" className="aspect-square w-full" />
                <span>
                  <span className="block uppercase">{item.title}</span>
                  <span className="text-muted">Qty {item.quantity}</span>
                </span>
                <span>{convertToLocale({ amount: item.total, currency_code: cart.currency_code })}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{convertToLocale({ amount: cart.item_total, currency_code: cart.currency_code })}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{convertToLocale({ amount: cart.shipping_total ?? 0, currency_code: cart.currency_code })}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-4 text-[0.875rem] uppercase">
            <span>Total</span>
            <span>{convertToLocale({ amount: cart.total, currency_code: cart.currency_code })}</span>
          </div>
          {error && (
            <p role="alert" className="text-[#b00020]">
              {error}
            </p>
          )}
          <button type="submit" disabled={placing} className="btn-primary w-full disabled:opacity-50">
            {placing ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </section>
  )
}

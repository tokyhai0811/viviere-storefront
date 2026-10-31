"use client"

import { Link } from "@/components/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { CART_FIELDS, useCart } from "@/lib/cart-context"
import { sdk } from "@/lib/medusa/client"
import { useI18n } from "@/lib/i18n/client"
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
  const { t, locale, market, href } = useI18n()
  const { cart, medusa, setCart, clear } = useCart()
  const money = (amount: number) => convertToLocale({ amount, currency_code: cart.currency_code, locale })
  // Countries the cart's region ships to; Vietnam only for the Vietnam market.
  const [countries, setCountries] = useState<string[]>([])
  const [country, setCountry] = useState<string | null>(null)
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [optionId, setOptionId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Shipping options depend on where the parcel goes, so save the country on
  // the cart first, then list what ships there and preselect the first one.
  useEffect(() => {
    if (!medusa || !cart.id || !country) return
    sdk.store.cart
      .update(cart.id, { shipping_address: { country_code: country } }, { fields: "id" })
      .then(() => sdk.store.fulfillment.listCartOptions({ cart_id: cart.id }))
      .then(({ shipping_options }) => {
        // Options without a price in the cart's currency can't be chosen.
        const list = (shipping_options as unknown as ShippingOption[]).filter((o) => o.amount != null)
        setOptions(list)
        setOptionId((current) => (list.some((o) => o.id === current) ? current : (list[0]?.id ?? null)))
      })
      .catch((e) => setError(e.message))
  }, [medusa, cart.id, country])

  useEffect(() => {
    if (!medusa || !cart.region_id) return
    sdk.store.region
      .retrieve(cart.region_id, { fields: "countries.iso_2" })
      .then(({ region }) => {
        const codes = (region.countries ?? []).map((c) => c.iso_2).filter((c): c is string => !!c)
        const names = new Intl.DisplayNames([locale], { type: "region" })
        const name = (c: string) => names.of(c.toUpperCase()) ?? c
        const sorted = codes.sort((a, b) => name(a).localeCompare(name(b), locale))
        setCountries(sorted)
        setCountry((current) => (current && sorted.includes(current) ? current : (sorted[0] ?? null)))
      })
      .catch(() => {})
  }, [medusa, cart.region_id, locale])

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
        <h1 className="type-h4">{t.checkout.title}</h1>
        <p>{t.checkout.needsBackend}</p>
      </section>
    )
  }

  if (!cart.items.length) {
    return (
      <section className="page-width flex flex-col items-start gap-6 py-16">
        <h1 className="type-h4">{t.checkout.title}</h1>
        <p className="type-h4">{t.cart.empty}</p>
        <Link href="/collections/all" className="btn-primary">{t.cart.continueShopping}</Link>
      </section>
    )
  }

  const placeOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!optionId) return setError(t.checkout.chooseDelivery)
    const form = new FormData(e.currentTarget)
    const value = (k: string) => String(form.get(k) ?? "").trim()
    const address = {
      first_name: value("first_name"),
      last_name: value("last_name"),
      phone: value("phone"),
      address_1: value("address_1"),
      city: value("city"),
      province: value("province"),
      postal_code: value("postal_code") || undefined,
      country_code: country ?? "vn",
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
      if (result.type !== "order") throw new Error(result.error?.message ?? t.checkout.orderFailed)
      clear()
      router.push(href(`/order/confirmed?id=${result.order.id}`))
    } catch (err) {
      setError((err as Error).message)
      setPlacing(false)
    }
  }

  return (
    <section className="page-width pt-8 pb-20">
      <h1 className="type-h4 mb-8">{t.checkout.title}</h1>
      <form onSubmit={placeOrder} className="grid gap-10 md:grid-cols-[1fr_380px] md:gap-16">
        <div className="space-y-10">
          <fieldset className="space-y-4">
            <legend className="mb-4 uppercase">{t.checkout.contact}</legend>
            <Field label={t.checkout.email} name="email" type="email" autoComplete="email" />
            <Field label={t.checkout.phone} name="phone" type="tel" autoComplete="tel" />
          </fieldset>

          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="mb-4 uppercase">{t.checkout.delivery}</legend>
            {market === "intl" && (
              <label className="col-span-2 flex flex-col gap-1">
                <span className="text-[12px] text-muted">{t.checkout.country}</span>
                <select
                  name="country_code"
                  required
                  autoComplete="country"
                  value={country ?? ""}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-11 border border-[#00000021] bg-white px-3 text-[0.875rem] outline-none focus:border-black"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {new Intl.DisplayNames([locale], { type: "region" }).of(c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <Field label={t.checkout.firstName} name="first_name" autoComplete="given-name" />
            <Field label={t.checkout.lastName} name="last_name" autoComplete="family-name" />
            <Field label={t.checkout.address} name="address_1" autoComplete="street-address" className="col-span-2" />
            <Field label={t.checkout.city} name="city" autoComplete="address-level2" />
            {market === "intl" ? (
              <>
                <Field label={t.checkout.state} name="province" autoComplete="address-level1" required={false} />
                <Field label={t.checkout.postalCode} name="postal_code" autoComplete="postal-code" required={false} />
              </>
            ) : (
              <>
                <Field label={t.checkout.province} name="province" autoComplete="address-level1" />
                <p className="col-span-2 text-muted">{t.checkout.vietnamOnly}</p>
              </>
            )}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-4 uppercase">{t.checkout.deliveryMethod}</legend>
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
                <span>{money(o.amount)}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-4 uppercase">{t.checkout.payment}</legend>
            <label className="flex items-center gap-3 border border-black px-4 py-3">
              <input type="radio" checked readOnly />
              <span>
                {t.checkout.payOnDelivery}
                <span className="block text-muted">{t.checkout.testPayment}</span>
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
                  <span className="text-muted">{t.checkout.qty(item.quantity)}</span>
                </span>
                <span>{money(item.total)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <span>{t.checkout.subtotal}</span>
            <span>{money(cart.item_total)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.checkout.shipping}</span>
            <span>{money(cart.shipping_total ?? 0)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-4 text-[0.875rem] uppercase">
            <span>{t.checkout.total}</span>
            <span>{money(cart.total)}</span>
          </div>
          {error && (
            <p role="alert" className="text-[#b00020]">
              {error}
            </p>
          )}
          <button type="submit" disabled={placing} className="btn-primary w-full disabled:opacity-50">
            {placing ? t.checkout.placing : t.checkout.placeOrder}
          </button>
        </aside>
      </form>
    </section>
  )
}

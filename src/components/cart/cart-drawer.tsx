"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { convertToLocale } from "@/lib/util/money"
import { CloseIcon } from "@/components/icons"
import { CartLine } from "./cart-line"

/** Slide-out cart (settings_data.json `cart_type: drawer`). */
export function CartDrawer() {
  const { cart, itemCount, drawerOpen, closeDrawer } = useCart()

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [drawerOpen, closeDrawer])

  return (
    <div
      className={`fixed inset-0 z-50 ${drawerOpen ? "visible" : "invisible"}`}
      aria-hidden={!drawerOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        role="dialog"
        aria-label="Cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="type-h4">
            Cart <span className="font-body text-[0.75rem] text-muted">({itemCount})</span>
          </h2>
          <button type="button" aria-label="Close cart" onClick={closeDrawer}>
            <CloseIcon />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="type-h4">Your cart is empty</p>
            <Link href="/collections/all" className="btn-primary" onClick={closeDrawer}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {cart.items.map((item) => (
                <CartLine
                  key={item.id}
                  item={item}
                  currencyCode={cart.currency_code}
                  onNavigate={closeDrawer}
                />
              ))}
            </ul>
            <div className="space-y-4 border-t border-border px-6 py-5">
              <div className="flex justify-between uppercase">
                <span>Subtotal</span>
                <span>{convertToLocale({ amount: cart.subtotal, currency_code: cart.currency_code })}</span>
              </div>
              <p className="text-muted">Taxes and shipping calculated at checkout.</p>
              <Link href="/checkout" className="btn-primary w-full" onClick={closeDrawer}>
                Check out
              </Link>
              <Link
                href="/cart"
                className="block text-center uppercase underline underline-offset-2"
                onClick={closeDrawer}
              >
                View cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

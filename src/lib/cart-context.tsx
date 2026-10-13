"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { StoreCart, StoreCartLineItem, StoreProduct, StoreProductVariant } from "@/lib/types"
import { CURRENCY_CODE } from "@/lib/data/mock"

/**
 * Client-side mock cart persisted in localStorage. Its shape follows Medusa's
 * StoreCart so the provider can later call `sdk.store.cart.createLineItem` etc.
 */

const STORAGE_KEY = "viviere_cart"

type CartContextValue = {
  cart: StoreCart
  itemCount: number
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addItem: (product: StoreProduct, variant: StoreProductVariant, quantity?: number) => void
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function totals(items: StoreCartLineItem[]): StoreCart {
  const item_total = items.reduce((sum, i) => sum + i.total, 0)
  return {
    id: "cart_mock",
    currency_code: CURRENCY_CODE,
    items,
    item_total,
    subtotal: item_total,
    total: item_total,
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<StoreCartLineItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, loaded])

  const addItem = useCallback(
    (product: StoreProduct, variant: StoreProductVariant, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.variant_id === variant.id)
        if (existing) {
          return prev.map((i) =>
            i.id === existing.id
              ? { ...i, quantity: i.quantity + quantity, total: (i.quantity + quantity) * i.unit_price }
              : i,
          )
        }
        const unit = variant.calculated_price.calculated_amount
        return [
          ...prev,
          {
            id: `cali_${variant.id}`,
            title: product.title,
            subtitle: variant.title,
            thumbnail: product.thumbnail,
            quantity,
            variant_id: variant.id,
            product_id: product.id,
            product_handle: product.handle,
            unit_price: unit,
            total: unit * quantity,
          },
        ]
      })
      setDrawerOpen(true)
    },
    [],
  )

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== lineId)
        : prev.map((i) => (i.id === lineId ? { ...i, quantity, total: quantity * i.unit_price } : i)),
    )
  }, [])

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== lineId))
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      cart: totals(items),
      itemCount: items.reduce((n, i) => n + i.quantity, 0),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      updateQuantity,
      removeItem,
    }),
    [items, drawerOpen, addItem, updateQuantity, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}

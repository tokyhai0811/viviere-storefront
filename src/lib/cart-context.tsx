"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { StoreCart, StoreCartLineItem, StoreProduct, StoreProductVariant } from "@/lib/types"
import { CURRENCY_CODE } from "@/lib/data/mock"
import { sdk } from "@/lib/medusa/client"

/**
 * Cart state in Medusa's StoreCart shape. With a Medusa backend (a `regionId` is
 * passed in) the cart lives in Medusa via `sdk.store.cart.*` and only its id is
 * kept in localStorage. Without one, a mock cart is persisted in localStorage.
 */

const STORAGE_KEY = "viviere_cart"
const MEDUSA_CART_ID_KEY = "viviere_medusa_cart_id"
export const CART_FIELDS = "id,region_id,locale,currency_code,item_total,subtotal,shipping_total,tax_total,total,*items"

type CartActions = {
  addItem: (product: StoreProduct, variant: StoreProductVariant, quantity?: number) => void
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  /** Checkout updates the cart through the SDK and hands the result back here. */
  setCart: (cart: StoreCart) => void
  /** Forget the cart once it has become an order. */
  clear: () => void
}

type CartContextValue = CartActions & {
  /** True when the cart lives in Medusa (checkout is only possible then). */
  medusa: boolean
  cart: StoreCart
  itemCount: number
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const EMPTY_CART: StoreCart = {
  id: "",
  currency_code: CURRENCY_CODE,
  items: [],
  item_total: 0,
  subtotal: 0,
  total: 0,
}

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

function useLocalCart(): CartActions & { cart: StoreCart } {
  const [items, setItems] = useState<StoreCartLineItem[]>([])
  const [loaded, setLoaded] = useState(false)

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

  const addItem = useCallback((product: StoreProduct, variant: StoreProductVariant, quantity = 1) => {
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
  }, [])

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

  const setCart = useCallback((cart: StoreCart) => setItems(cart.items), [])
  const clear = useCallback(() => setItems([]), [])

  const cart = useMemo(() => totals(items), [items])
  return { cart, addItem, updateQuantity, removeItem, setCart, clear }
}

const toStoreCart = (cart: unknown) => cart as StoreCart

function useMedusaCart(regionId: string, locale: string): CartActions & { cart: StoreCart } {
  const [cart, setCart] = useState<StoreCart>(EMPTY_CART)

  // Load the saved cart, and move it to this page's region and language when
  // the visitor switched (Medusa then reprices it in that region's currency
  // and re-translates the line titles).
  useEffect(() => {
    let id: string | null = null
    try {
      id = window.localStorage.getItem(MEDUSA_CART_ID_KEY)
    } catch {}
    if (!id) return
    const cartId = id
    sdk.store.cart
      .retrieve(cartId, { fields: `${CART_FIELDS},completed_at` })
      .then(async ({ cart }) => {
        // A completed cart has become an order; start a fresh one next time.
        if ((cart as { completed_at?: string | null }).completed_at) throw new Error("cart completed")
        if (cart.region_id !== regionId || (cart as { locale?: string | null }).locale !== locale) {
          const { cart: moved } = await sdk.store.cart.update(
            cartId,
            { region_id: regionId, locale },
            { fields: CART_FIELDS },
          )
          return setCart(toStoreCart(moved))
        }
        setCart(toStoreCart(cart))
      })
      .catch(() => {
        try {
          window.localStorage.removeItem(MEDUSA_CART_ID_KEY)
        } catch {}
      })
  }, [regionId, locale])

  const ensureCartId = useCallback(async () => {
    if (cart.id) return cart.id
    const { cart: created } = await sdk.store.cart.create({ region_id: regionId, locale }, { fields: "id" })
    try {
      window.localStorage.setItem(MEDUSA_CART_ID_KEY, created.id)
    } catch {}
    return created.id
  }, [cart.id, regionId, locale])

  const addItem = useCallback(
    (_product: StoreProduct, variant: StoreProductVariant, quantity = 1) => {
      ensureCartId()
        .then((id) => sdk.store.cart.createLineItem(id, { variant_id: variant.id, quantity }, { fields: CART_FIELDS }))
        .then(({ cart }) => setCart(toStoreCart(cart)))
        .catch((e) => console.error("Could not add to cart", e))
    },
    [ensureCartId],
  )

  const removeItem = useCallback(
    (lineId: string) => {
      if (!cart.id) return
      sdk.store.cart
        .deleteLineItem(cart.id, lineId, { fields: CART_FIELDS })
        .then(({ parent }) => parent && setCart(toStoreCart(parent)))
        .catch((e) => console.error("Could not remove cart line", e))
    },
    [cart.id],
  )

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (!cart.id) return
      if (quantity <= 0) return removeItem(lineId)
      sdk.store.cart
        .updateLineItem(cart.id, lineId, { quantity }, { fields: CART_FIELDS })
        .then(({ cart }) => setCart(toStoreCart(cart)))
        .catch((e) => console.error("Could not update cart line", e))
    },
    [cart.id, removeItem],
  )

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(MEDUSA_CART_ID_KEY)
    } catch {}
    setCart(EMPTY_CART)
  }, [])

  return { cart, addItem, updateQuantity, removeItem, setCart, clear }
}

function CartContextProvider({
  state,
  medusa,
  children,
}: {
  state: CartActions & { cart: StoreCart }
  medusa: boolean
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { cart, addItem, updateQuantity, removeItem, setCart, clear } = state

  const value = useMemo<CartContextValue>(
    () => ({
      medusa,
      cart,
      itemCount: cart.items.reduce((n, i) => n + i.quantity, 0),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem: (product, variant, quantity) => {
        addItem(product, variant, quantity)
        setDrawerOpen(true)
      },
      updateQuantity,
      removeItem,
      setCart,
      clear,
    }),
    [medusa, cart, drawerOpen, addItem, updateQuantity, removeItem, setCart, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function LocalCartProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartContextProvider state={useLocalCart()} medusa={false}>
      {children}
    </CartContextProvider>
  )
}

function MedusaCartProvider({
  regionId,
  locale,
  children,
}: {
  regionId: string
  locale: string
  children: React.ReactNode
}) {
  return (
    <CartContextProvider state={useMedusaCart(regionId, locale)} medusa>
      {children}
    </CartContextProvider>
  )
}

/**
 * `regionId` is set by the root layout only when the Medusa backend is
 * configured; `locale` is the page language, so cart lines are translated.
 */
export function CartProvider({
  regionId,
  locale,
  children,
}: {
  regionId: string | null
  locale: string
  children: React.ReactNode
}) {
  return regionId ? (
    <MedusaCartProvider regionId={regionId} locale={locale}>{children}</MedusaCartProvider>
  ) : (
    <LocalCartProvider>{children}</LocalCartProvider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}

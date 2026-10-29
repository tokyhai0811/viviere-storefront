"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { StoreCollection, StoreProduct } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { convertToLocale } from "@/lib/util/money"
import { ProductImage, productThumbnail } from "@/components/product-image"
import { AccountIcon, CartIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons"

/**
 * Header from sections/header-group.json: menu left, logo centred, search and
 * language right, always sticky. Transparent over the hero on the home page
 * (inverted, white text) and on product pages (default colours).
 */

// The live main-menu is managed in Shopify admin and is not in the theme export.
const mainMenu = [
  { title: "Shop", href: "/collections/all", featured: true },
  { title: "About Us", href: "/pages/about-us" },
  { title: "Blogs", href: "/blogs/blogs" },
]

export function Header({
  products,
  collections,
}: {
  products: StoreProduct[]
  collections: StoreCollection[]
}) {
  const pathname = usePathname()
  const { itemCount, openDrawer } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)

  const isHome = pathname === "/"
  const isProduct = pathname.startsWith("/products/")
  const transparent = (isHome || isProduct) && !scrolled && !megaOpen
  const inverse = isHome && transparent

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close overlays on navigation
    setDrawerOpen(false)
    setSearchOpen(false)
    setMegaOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          transparent ? "bg-transparent" : "bg-white"
        } ${inverse ? "text-white" : "text-black"}`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="page-width grid h-16 grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: menu */}
          <div className="flex items-center">
            <button
              type="button"
              className="-ml-2 p-2 md:hidden"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </button>
            <nav className="hidden md:block" aria-label="Main">
              <ul className="flex gap-7 text-[0.875rem] uppercase tracking-wide">
                {mainMenu.map((item) => (
                  <li key={item.href} onMouseEnter={() => setMegaOpen(!!item.featured)}>
                    <Link
                      href={item.href}
                      className="py-5 transition-opacity hover:opacity-60"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Centre: logo */}
          <Link
            href="/"
            className="font-accent text-[1.375rem] font-light tracking-[0.35em] md:text-[1.75rem]"
            aria-label="VIVIÈRE home"
          >
            VIVIÈRE
          </Link>

          {/* Right: localization, search, account, cart */}
          <div className="flex items-center justify-end gap-1 md:gap-3">
            <label className="hidden items-center md:flex">
              <span className="sr-only">Language</span>
              <select
                className="cursor-pointer bg-transparent text-[12px] uppercase outline-none"
                defaultValue="en"
              >
                <option value="en" className="text-black">English</option>
                <option value="vi" className="text-black">Tiếng Việt</option>
              </select>
            </label>
            <button
              type="button"
              className="p-2"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <Link href="/account" className="hidden p-2 md:block" aria-label="Account">
              <AccountIcon />
            </Link>
            <button
              type="button"
              className="relative -mr-2 p-2"
              aria-label={`Cart, ${itemCount} items`}
              onClick={openDrawer}
            >
              <CartIcon />
              {itemCount > 0 && (
                <span
                  className={`absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full text-[9px] font-normal ${
                    inverse ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Featured-products mega menu (menu_style: featured_products, 4/5 ratio) */}
        <div
          className={`absolute inset-x-0 top-full hidden border-t border-border bg-white text-black md:block ${
            megaOpen ? "visible opacity-100" : "invisible opacity-0"
          } transition-opacity duration-200`}
        >
          <div className="page-width grid grid-cols-[1fr_3fr] gap-10 py-8">
            <ul className="space-y-2 text-[0.875rem] uppercase">
              {collections.map((c) => (
                <li key={c.id}>
                  <Link href={`/collections/${c.handle}`} className="hover:opacity-60">{c.title}</Link>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-4 gap-4">
              {products.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/products/${p.handle}`} className="group">
                  <ProductImage
                    src={productThumbnail(p)}
                    alt={p.title}
                    sizes="20vw"
                    className="aspect-[4/5] w-full"
                  />
                  <p className="mt-2 uppercase">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Pages without a transparent header need room for the fixed bar. */}
      {!(isHome || isProduct) && <div className="h-16" aria-hidden />}

      {/* Mobile menu drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${drawerOpen ? "visible" : "invisible"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white p-5 transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            className="-ml-2 self-start p-2"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <CloseIcon />
          </button>
          <ul className="mt-6 space-y-4 text-[0.875rem] uppercase">
            {mainMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <Link href="/account" className="flex items-center gap-2 uppercase">
              <AccountIcon className="size-4" /> Account
            </Link>
            <select className="bg-transparent text-[12px] uppercase" defaultValue="en">
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
        </div>
      </div>

      {searchOpen && <SearchModal products={products} onClose={() => setSearchOpen(false)} />}
    </>
  )
}

function SearchModal({ products, onClose }: { products: StoreProduct[]; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const results = q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products.slice(0, 4)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white">
        <div className="page-width py-6">
          <div className="flex items-center gap-3 border-b border-black pb-2">
            <SearchIcon className="size-4" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-[0.875rem] outline-none"
            />
            <button type="button" aria-label="Close search" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <p className="mt-5 uppercase text-muted">{q ? `Products (${results.length})` : "Suggested"}</p>
          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
            {results.map((p) => (
              <Link key={p.id} href={`/products/${p.handle}`} onClick={onClose}>
                <ProductImage
                  src={productThumbnail(p)}
                  alt={p.title}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="aspect-[4/5] w-full"
                />
                <p className="mt-2 uppercase">{p.title}</p>
                <p className="text-muted">
                  {convertToLocale({
                    amount: p.variants[0].calculated_price.calculated_amount,
                    currency_code: p.variants[0].calculated_price.currency_code,
                  })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

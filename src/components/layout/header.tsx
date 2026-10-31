"use client"

import { Link } from "@/components/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import type { StoreCollection, StoreProduct } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { usePagePath, useI18n } from "@/lib/i18n/client"
import { LANG_COOKIE, MARKETS, MARKET_COOKIE, localizePath, type Lang, type Market } from "@/lib/i18n/config"
import { convertToLocale } from "@/lib/util/money"
import { ProductImage, productThumbnail } from "@/components/product-image"
import { AccountIcon, CartIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons"

/**
 * Header from sections/header-group.json: menu left, logo centred, search and
 * language right, always sticky. Transparent over the hero on the home page
 * (inverted, white text) and on product pages (default colours).
 */

const YEAR = 60 * 60 * 24 * 365
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`
}

/**
 * Language and country pickers. Language changes the URL (/vi/...); the
 * country picks the market (currency), saved in a cookie the proxy reads.
 */
function LocaleSwitchers({ className = "" }: { className?: string }) {
  const path = usePagePath()
  const search = useSearchParams().toString()
  const { lang, market, t } = useI18n()

  // Language and market are the root layout's segments, so a switch is a full
  // page load: client-side navigation can't swap the root layout in place.
  const switchLang = (next: Lang) => {
    // Saved first, so the proxy doesn't send a Vietnamese browser back to /vi.
    setCookie(LANG_COOKIE, next)
    window.location.assign(localizePath(next, path) + (search ? `?${search}` : ""))
  }
  const switchMarket = (next: Market) => {
    setCookie(MARKET_COOKIE, next)
    window.location.reload()
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="flex items-center">
        <span className="sr-only">{t.nav.region}</span>
        <select
          className="cursor-pointer bg-transparent text-[12px] uppercase outline-none"
          value={market}
          onChange={(e) => switchMarket(e.target.value as Market)}
        >
          {MARKETS.map((m) => (
            <option key={m} value={m} className="text-black">
              {t.markets[m]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center">
        <span className="sr-only">{t.nav.language}</span>
        <select
          className="cursor-pointer bg-transparent text-[12px] uppercase outline-none"
          value={lang}
          onChange={(e) => switchLang(e.target.value as Lang)}
        >
          <option value="en" className="text-black">English</option>
          <option value="vi" className="text-black">Tiếng Việt</option>
        </select>
      </label>
    </div>
  )
}

export function Header({
  products,
  collections,
}: {
  products: StoreProduct[]
  collections: StoreCollection[]
}) {
  const pathname = usePagePath()
  const { t } = useI18n()
  const { itemCount, openDrawer } = useCart()
  // viviere.vn's main menu has a single link; About Us and Blogs are in the footer.
  const mainMenu = [{ title: t.nav.shop, href: "/collections/all", featured: true }]
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
              aria-label={t.nav.openMenu}
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
            aria-label={t.nav.home}
          >
            VIVIÈRE
          </Link>

          {/* Right: localization, search, account, cart */}
          <div className="flex items-center justify-end gap-1 md:gap-3">
            {/* useSearchParams needs a Suspense boundary on prerendered pages. */}
            <Suspense>
              <LocaleSwitchers className="hidden md:flex" />
            </Suspense>
            <button
              type="button"
              className="p-2"
              aria-label={t.nav.search}
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <Link href="/account" className="hidden p-2 md:block" aria-label={t.nav.account}>
              <AccountIcon />
            </Link>
            <button
              type="button"
              className="relative -mr-2 p-2"
              aria-label={t.nav.cartCount(itemCount)}
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
            aria-label={t.nav.closeMenu}
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
              <AccountIcon className="size-4" /> {t.nav.account}
            </Link>
            <Suspense>
              <LocaleSwitchers className="flex-col items-end gap-2" />
            </Suspense>
          </div>
        </div>
      </div>

      {searchOpen && <SearchModal products={products} onClose={() => setSearchOpen(false)} />}
    </>
  )
}

function SearchModal({ products, onClose }: { products: StoreProduct[]; onClose: () => void }) {
  const { t, locale, href } = useI18n()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const results = q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products.slice(0, 4)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.nav.search}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white">
        <div className="page-width py-6">
          <form
            role="search"
            className="flex items-center gap-3 border-b border-black pb-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!q) return
              onClose()
              router.push(href(`/search?q=${encodeURIComponent(query.trim())}`))
            }}
          >
            <SearchIcon className="size-4" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.nav.search}
              className="flex-1 bg-transparent text-[0.875rem] outline-none"
            />
            <button type="button" aria-label={t.nav.closeSearch} onClick={onClose}>
              <CloseIcon />
            </button>
          </form>
          <div className="mt-5 flex items-center justify-between">
            <p className="uppercase text-muted">{q ? t.nav.productsCount(results.length) : t.nav.suggested}</p>
            <Link
              href={q ? `/search?q=${encodeURIComponent(query.trim())}` : "/collections/all"}
              onClick={onClose}
              className="link-underline uppercase"
            >
              {t.nav.viewAll}
            </Link>
          </div>
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
                    locale,
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

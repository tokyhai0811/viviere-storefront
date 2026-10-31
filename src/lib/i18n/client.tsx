"use client"

import { usePathname } from "next/navigation"
import { createContext, useContext } from "react"
import { LANG_LOCALE, localizePath, splitLangPath, type Lang, type Market } from "./config"
import { dictionaries, type Dictionary } from "./dictionaries"

type I18n = { lang: Lang; market: Market; locale: string; t: Dictionary; href: (path: string) => string }

const I18nContext = createContext<I18n | null>(null)

/** Gives Client Components the page's language, market and interface text. */
export function I18nProvider({ lang, market, children }: { lang: Lang; market: Market; children: React.ReactNode }) {
  const value: I18n = {
    lang,
    market,
    locale: LANG_LOCALE[lang],
    t: dictionaries[lang],
    href: (path) => localizePath(lang, path),
  }
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>")
  return ctx
}

/**
 * The current page's path without the language prefix ("/vi/cart" and "/cart"
 * both give "/cart"). Behind the proxy's rewrite, usePathname() can return the
 * internal /[lang]/[market]/... path during prerendering and the public one in
 * the browser; both normalise to the same value, so the UI hydrates cleanly.
 */
export function usePagePath(): string {
  const pathname = usePathname()
  const { lang, market } = useI18n()
  const internal = `/${lang}/${market}`
  if (pathname === internal) return "/"
  if (pathname.startsWith(`${internal}/`)) return pathname.slice(internal.length)
  return splitLangPath(pathname).path
}

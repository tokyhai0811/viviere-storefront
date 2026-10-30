/**
 * Languages and markets. URLs carry the language (English at the root,
 * Vietnamese under /vi). The market decides the region, and so the currency;
 * it comes from the visitor's country or their choice in the header and never
 * shows in the URL. The proxy rewrites every request to /[lang]/[market]/...
 */

export const LANGS = ["en", "vi"] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = "en"

export const MARKETS = ["vn", "intl"] as const
export type Market = (typeof MARKETS)[number]
export const DEFAULT_MARKET: Market = "vn"

/** Currency of each market's Medusa region. */
export const MARKET_CURRENCY: Record<Market, string> = { vn: "vnd", intl: "usd" }

/** Locale codes Medusa stores translations under, and number/date formatting uses. */
export const LANG_LOCALE: Record<Lang, string> = { en: "en-US", vi: "vi-VN" }

export const LANG_COOKIE = "viviere_lang"
export const MARKET_COOKIE = "viviere_market"

export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang)
export const isMarket = (v: unknown): v is Market => MARKETS.includes(v as Market)

/** Countries served by the Vietnam market; everyone else gets International. */
export const marketForCountry = (country: string | null | undefined): Market =>
  !country || country.toUpperCase() === "VN" ? "vn" : "intl"

/** Public URL of `path` (written without a language prefix) in `lang`. */
export function localizePath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG || !path.startsWith("/")) return path
  return path === "/" ? `/${lang}` : `/${lang}${path}`
}

/** Splits a public URL path into its language and the path without the prefix. */
export function splitLangPath(pathname: string): { lang: Lang; path: string } {
  for (const lang of LANGS) {
    if (lang === DEFAULT_LANG) continue
    if (pathname === `/${lang}`) return { lang, path: "/" }
    if (pathname.startsWith(`/${lang}/`)) return { lang, path: pathname.slice(lang.length + 1) }
  }
  return { lang: DEFAULT_LANG, path: pathname }
}

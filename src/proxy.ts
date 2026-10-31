import { NextResponse, type NextRequest } from "next/server"
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  MARKET_COOKIE,
  isLang,
  isMarket,
  localizePath,
  marketForCountry,
  splitLangPath,
} from "@/lib/i18n/config"

/**
 * Maps public URLs to the internal /[lang]/[market]/... routes.
 * - Language comes from the URL. On a first visit to an English URL, a browser
 *   that prefers Vietnamese is sent to the /vi version once; after that the
 *   URL the visitor opens wins and is remembered.
 * - Market comes from the visitor's choice (cookie) or, failing that, the
 *   country Vercel detects from their IP (VN = Vietnam, else International).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // /en/... is the same page as /...; keep one URL per page.
  if (pathname === `/${DEFAULT_LANG}` || pathname.startsWith(`/${DEFAULT_LANG}/`)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LANG.length + 1) || "/"
    const res = NextResponse.redirect(url)
    res.cookies.set(LANG_COOKIE, DEFAULT_LANG, { path: "/", maxAge: 60 * 60 * 24 * 365 })
    return res
  }

  const { lang, path } = splitLangPath(pathname)
  const savedLang = request.cookies.get(LANG_COOKIE)?.value

  if (!isLang(savedLang) && lang === DEFAULT_LANG && prefersVietnamese(request)) {
    const url = request.nextUrl.clone()
    url.pathname = localizePath("vi", path)
    const res = NextResponse.redirect(url)
    res.cookies.set(LANG_COOKIE, "vi", { path: "/", maxAge: 60 * 60 * 24 * 365 })
    return res
  }

  const savedMarket = request.cookies.get(MARKET_COOKIE)?.value
  const market = isMarket(savedMarket)
    ? savedMarket
    : marketForCountry(request.headers.get("x-vercel-ip-country"))

  const url = request.nextUrl.clone()
  url.pathname = `/${lang}/${market}${path === "/" ? "" : path}`
  url.search = search
  const res = NextResponse.rewrite(url)
  if (savedLang !== lang) res.cookies.set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365 })
  return res
}

function prefersVietnamese(request: NextRequest): boolean {
  const header = request.headers.get("accept-language") ?? ""
  // The first listed language is the browser's preference.
  return header.trim().toLowerCase().startsWith("vi")
}

export const config = {
  // Everything except Next internals and files with an extension (images, favicon).
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
}

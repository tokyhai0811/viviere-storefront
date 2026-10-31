import { lang as langParam, market as marketParam } from "next/root-params"
import { notFound } from "next/navigation"
import { DEFAULT_LANG, DEFAULT_MARKET, isLang, isMarket, type Lang, type Market } from "./config"
import { dictionaries } from "./dictionaries"

/** Current language and market in Server Components, from the /[lang]/[market] root segments. */
export async function getLang(): Promise<Lang> {
  const value = await langParam()
  if (!isLang(value)) notFound()
  return value ?? DEFAULT_LANG
}

export async function getMarket(): Promise<Market> {
  const value = await marketParam()
  if (!isMarket(value)) notFound()
  return value ?? DEFAULT_MARKET
}

export async function getDictionary() {
  return dictionaries[await getLang()]
}

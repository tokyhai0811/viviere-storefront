import type { Metadata } from "next"
import { CartProvider } from "@/lib/cart-context"
import { listCollections, listProducts } from "@/lib/data/products"
import { getRegionId } from "@/lib/data/medusa"
import { medusaEnabled } from "@/lib/medusa/client"
import { LANGS, LANG_LOCALE, MARKETS } from "@/lib/i18n/config"
import { I18nProvider } from "@/lib/i18n/client"
import { getDictionary, getLang, getMarket } from "@/lib/i18n/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
// Fonts from settings_data.json: heading playfair_display_n4, body ibm_plex_sans_n3, accent montserrat_n3.
// Self-hosted via Fontsource so builds never fetch from Google Fonts.
import "@fontsource/playfair-display/400.css"
import "@fontsource/playfair-display/400-italic.css"
import "@fontsource/ibm-plex-sans/300.css"
import "@fontsource/ibm-plex-sans/400.css"
import "@fontsource/ibm-plex-sans/500.css"
import "@fontsource/montserrat/300.css"
import "@fontsource/montserrat/600.css"
import "../../globals.css"

/** Every language in every market is prerendered. */
export async function generateStaticParams() {
  return LANGS.flatMap((lang) => MARKETS.map((market) => ({ lang, market })))
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary()
  return {
    title: { default: "VIVIÈRE", template: "%s | VIVIÈRE" },
    description: t.meta.description,
  }
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]/[market]">) {
  const [lang, market] = await Promise.all([getLang(), getMarket()])
  const [{ products }, collections] = await Promise.all([listProducts(), listCollections()])
  const regionId = medusaEnabled ? await getRegionId() : null

  return (
    <html lang={lang} className="h-full">
      <body className="flex min-h-full flex-col">
        <I18nProvider lang={lang} market={market}>
          <CartProvider regionId={regionId} locale={LANG_LOCALE[lang]}>
            <Header products={products} collections={collections} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  )
}

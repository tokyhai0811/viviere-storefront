import type { Metadata } from "next"
import { CartProvider } from "@/lib/cart-context"
import { listProducts } from "@/lib/data/products"
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
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "VIVIÈRE", template: "%s | VIVIÈRE" },
  description: "VIVIÈRE. The Bateau, a microfiber leather shoulder bag handmade in Vietnam.",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { products } = await listProducts()

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header products={products} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}

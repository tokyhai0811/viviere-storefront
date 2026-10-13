import type { Metadata } from "next"
import { IBM_Plex_Sans, Montserrat, Playfair_Display } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { listProducts } from "@/lib/data/products"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
import "./globals.css"

// Fonts from settings_data.json: heading playfair_display_n4, body ibm_plex_sans_n3, accent montserrat_n3.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  style: ["normal", "italic"],
})

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
})

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "600"],
})

export const metadata: Metadata = {
  title: { default: "VIVIÈRE", template: "%s | VIVIÈRE" },
  description: "VIVIÈRE. The Bateau, a microfiber leather shoulder bag handmade in Vietnam.",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { products } = await listProducts()

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plex.variable} ${montserrat.variable} h-full`}
    >
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

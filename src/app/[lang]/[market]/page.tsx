import { Hero } from "@/components/home/hero"
import { SilhouetteRow } from "@/components/home/silhouette-row"
import { ColorGallery } from "@/components/home/color-gallery"
import { ComparisonSlider } from "@/components/home/comparison-slider"
import { productThumbnail } from "@/components/product-image"
import { colorLabel, listProducts } from "@/lib/data/products"
import { getDictionary } from "@/lib/i18n/server"
import type { StoreProduct } from "@/lib/types"

const side = (p: StoreProduct) => ({
  label: colorLabel(p).toUpperCase(),
  href: `/products/${p.handle}`,
  image: productThumbnail(p),
})

// viviere.vn picks these by hand: four colours in the gallery, the two
// summer colours in the comparison slider.
const GALLERY_COLORS = ["Burgundy", "Brown", "Teal", "Black"]
const SUMMER_COLORS = ["Blue", "Yellow"]

/** Products in the given colours (English metadata colour), in that order. */
const byColor = (products: StoreProduct[], colors: string[]) =>
  colors.flatMap((c) => products.filter((p) => p.metadata?.color === c))

/** Home page, following the enabled sections of templates/index.json in order. */
export default async function HomePage() {
  const [{ products }, t] = await Promise.all([listProducts(), getDictionary()])
  const gallery = byColor(products, GALLERY_COLORS)
  const summer = byColor(products, SUMMER_COLORS)
  // Catalogues without those colours fall back to catalogue order.
  const [before, after] = summer.length === 2 ? summer : products.slice(-2)

  return (
    <>
      <Hero t={t} />
      <SilhouetteRow t={t} />
      <ColorGallery products={gallery.length ? gallery : products} />
      {before && after && (
        <section className="page-width space-y-8 pb-16">
          <h2 className="font-body text-center text-[1.5rem] font-light">{t.home.summerColors}</h2>
          <ComparisonSlider before={side(before)} after={side(after)} />
        </section>
      )}
    </>
  )
}

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

/** Home page, following the enabled sections of templates/index.json in order. */
export default async function HomePage() {
  const [{ products }, t] = await Promise.all([listProducts(), getDictionary()])
  // The live theme compares the last two colours (Blue and Yellow).
  const [before, after] = products.slice(-2)

  return (
    <>
      <Hero t={t} />
      <SilhouetteRow t={t} />
      <ColorGallery products={products} />
      {before && after && (
        <section className="page-width space-y-8 pb-16">
          <h2 className="font-body text-center text-[1.5rem] font-light">{t.home.summerColors}</h2>
          <ComparisonSlider before={side(before)} after={side(after)} />
        </section>
      )}
    </>
  )
}

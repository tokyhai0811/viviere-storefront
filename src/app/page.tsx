import { Hero } from "@/components/home/hero"
import { SilhouetteRow } from "@/components/home/silhouette-row"
import { ColorGallery } from "@/components/home/color-gallery"
import { ComparisonSlider } from "@/components/home/comparison-slider"
import { productThumbnail } from "@/components/product-image"
import { listProducts } from "@/lib/data/products"
import type { StoreProduct } from "@/lib/types"

const side = (p: StoreProduct) => ({
  label: (p.metadata?.color ?? p.title).toUpperCase(),
  href: `/products/${p.handle}`,
  image: productThumbnail(p),
})

/** Home page, following the enabled sections of templates/index.json in order. */
export default async function HomePage() {
  const { products } = await listProducts()
  // The live theme compares the last two colours (Blue and Yellow).
  const [before, after] = products.slice(-2)

  return (
    <>
      <Hero />
      <SilhouetteRow />
      <ColorGallery products={products} />
      {before && after && (
        <section className="page-width space-y-8 pb-16">
          <h2 className="font-body text-center text-[1.5rem] font-light">Meet the New Summer Colors</h2>
          <ComparisonSlider before={side(before)} after={side(after)} />
        </section>
      )}
    </>
  )
}

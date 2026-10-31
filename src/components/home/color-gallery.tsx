import { Link } from "@/components/link"
import type { StoreProduct } from "@/lib/types"
import { colorLabel } from "@/lib/data/products"
import { Placeholder } from "@/components/placeholder"
import { ProductImage, productThumbnail } from "@/components/product-image"

/**
 * blocks/ai_gen_block_499fd59: two columns, a large image on the left and a
 * 2×2 grid of square colour shots with centred labels on the right. The tiles
 * are the first four products in catalogue order.
 */
export function ColorGallery({ products }: { products: StoreProduct[] }) {
  if (!products.length) return null

  return (
    <section className="page-width py-12 md:py-16">
      <div className="grid gap-5 md:grid-cols-2">
        <Placeholder label="The Bateau lifestyle" className="aspect-square w-full md:aspect-auto md:h-full" />
        <div className="grid grid-cols-2 gap-5">
          {products.slice(0, 4).map((p) => {
            const label = colorLabel(p).toUpperCase()
            return (
              <Link key={p.id} href={`/products/${p.handle}`} className="group block">
                <ProductImage
                  src={productThumbnail(p)}
                  alt={p.title}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <p className="mt-2 text-center text-[12px]">{label}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

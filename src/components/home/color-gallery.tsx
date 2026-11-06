import { Link } from "@/components/link"
import type { StoreProduct } from "@/lib/types"
import { colorLabel } from "@/lib/data/products"
import { ProductImage, productThumbnail } from "@/components/product-image"

/**
 * blocks/ai_gen_block_499fd59: two columns, a large image on the left and a
 * 2×2 grid of square colour shots with centred labels on the right. The tiles
 * are the first four products given (the home page picks them).
 */
export function ColorGallery({ products, image }: { products: StoreProduct[]; image?: string | null }) {
  if (!products.length) return null

  return (
    <section className="page-width pt-8 pb-6 md:py-10">
      <div className="grid gap-[15px] md:grid-cols-2 md:gap-5">
        <ProductImage
          src={image}
          alt="The Bateau lifestyle"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[5/7] w-full md:aspect-auto md:h-full"
        />
        <div className="grid grid-cols-2 gap-[15px] md:gap-5">
          {products.slice(0, 4).map((p) => {
            const label = colorLabel(p).toUpperCase()
            return (
              <Link key={p.id} href={`/products/${p.handle}`} className="group block md:pb-6">
                <ProductImage
                  src={productThumbnail(p)}
                  alt={p.title}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <p className="mt-3 text-center text-[12px] leading-[1.4]">{label}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

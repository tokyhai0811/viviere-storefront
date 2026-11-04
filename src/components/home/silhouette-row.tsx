import { ProductImage } from "@/components/product-image"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/** templates/index.json › section_BUa3P4: square image beside a centred italic heading. */
export function SilhouetteRow({ t, image }: { t: Dictionary; image?: string | null }) {
  return (
    <section className="page-width grid items-center gap-8 py-12 md:grid-cols-2 md:gap-0 md:py-0">
      <ProductImage src={image} alt="The Bateau silhouette" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-square w-full" />
      <div className="flex items-center justify-center px-6">
        <h2 className="type-h2 text-center italic">
          {t.home.silhouette[0]}
          <br />
          {t.home.silhouette[1]}
        </h2>
      </div>
    </section>
  )
}

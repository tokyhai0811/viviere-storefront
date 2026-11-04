import { ProductImage } from "@/components/product-image"

/** templates/index.json › section_BUa3P4: square image beside a centred italic heading. */
export function SilhouetteRow({ lines, image }: { lines: string[]; image?: string | null }) {
  return (
    <section className="page-width grid items-center gap-8 py-12 md:grid-cols-2 md:gap-0 md:py-0">
      <ProductImage src={image} alt="The Bateau silhouette" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-square w-full" />
      <div className="flex items-center justify-center px-6">
        <h2 className="type-h2 text-center italic">
          {lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}

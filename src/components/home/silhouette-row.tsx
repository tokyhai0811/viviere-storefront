import { ProductImage } from "@/components/product-image"

/** templates/index.json › section_BUa3P4: square image beside a centred italic heading. */
export function SilhouetteRow({ lines, image }: { lines: string[]; image?: string | null }) {
  return (
    <section className="page-width grid items-center gap-6 pt-[25px] pb-6 md:grid-cols-2 md:gap-8 md:py-10">
      <ProductImage src={image} alt="The Bateau silhouette" sizes="(min-width: 768px) 50vw, 100vw" className="order-2 aspect-square w-full md:order-1" />
      <div className="order-1 flex items-center justify-center md:order-2">
        <h2 className="type-h2 text-center tracking-[-0.5px]">
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

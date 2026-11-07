import { ProductImage } from "@/components/product-image"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { CraftedContent } from "@/lib/product-page"

/**
 * templates/product.json › "Crafted with Enduring Purpose" (blocks/ai_gen_block_f81ba16):
 * three 4:5 images with text below; on mobile a swipeable row that peeks the next card.
 * Images, heading and text come from admin Theme › Product page; empty text
 * keeps viviere.vn's copy and empty images stay grey.
 */
export function CraftedSection({ t, content }: { t: Dictionary; content: CraftedContent }) {
  if (content.hidden) return null
  const heading = content.heading ?? t.product.crafted.heading
  return (
    <section className="page-width py-10">
      <h2 className="type-h2 mb-8 md:ml-[120px]">{heading}</h2>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-[15px] overflow-x-auto px-4 md:mx-auto md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-[30px] md:overflow-visible md:px-0">
        {t.product.crafted.columns.map((fallback, i) => (
          <div key={i} className="w-[71%] shrink-0 snap-start md:w-auto">
            <ProductImage
              src={content.columns[i]?.image}
              alt={`${heading} ${i + 1}`}
              sizes="(min-width: 768px) 400px, 71vw"
              className="aspect-[4/5] w-full"
            />
            <p className="mt-[15px] text-center text-[0.875rem] tracking-[-0.5px] whitespace-pre-line">
              {content.columns[i]?.text ?? fallback}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

import { Placeholder } from "@/components/placeholder"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/**
 * templates/product.json › "Crafted with Enduring Purpose" (blocks/ai_gen_block_f81ba16):
 * three 4:5 images with text below; on mobile a swipeable row that peeks the next card.
 */
export function CraftedSection({ t }: { t: Dictionary }) {
  const columns = t.product.crafted.columns
  return (
    <section className="page-width py-10">
      <h2 className="type-h2 mb-8 md:ml-[120px]">{t.product.crafted.heading}</h2>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-[15px] overflow-x-auto px-4 md:mx-auto md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-[30px] md:overflow-visible md:px-0">
        {columns.map((text, i) => (
          <div key={i} className="w-[71%] shrink-0 snap-start md:w-auto">
            <Placeholder label={`Crafted with Enduring Purpose ${i + 1}`} className="aspect-[4/5] w-full" />
            <p className="mt-[15px] text-center text-[0.875rem] tracking-[-0.5px]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

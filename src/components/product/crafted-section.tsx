import { Placeholder } from "@/components/placeholder"

/**
 * templates/product.json › "Crafted with Enduring Purpose" (blocks/ai_gen_block_f81ba16):
 * three 4:5 images with text below; on mobile a swipeable row that peeks the next card.
 */
const columns = [
  "The Bateau is crafted from microfiber leather on the outside, a synthetic material known for its exceptional durability, supple feel, and strong resistance to wear.",
  "The lining is premium PU, offering a smooth, durable interior that complements the strength and elegance of the exterior.",
  "Each bag is meticulously made by skilled leatherworkers in Vietnam. Produced only in small batches, every piece receives the highest level of precision, care, and quality control.",
]

export function CraftedSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-0">
      <h2 className="mb-5 font-body text-[1.5rem] font-light md:ml-[120px]">Crafted with Enduring Purpose</h2>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        {columns.map((text, i) => (
          <div key={i} className="w-[80%] shrink-0 snap-start md:w-auto">
            <Placeholder label={`Crafted with Enduring Purpose ${i + 1}`} className="aspect-[4/5] w-full" />
            <p className="mt-4 text-[0.875rem] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

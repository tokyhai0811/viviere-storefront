import { Placeholder } from "@/components/placeholder"

/** templates/index.json › section_BUa3P4: square image beside a centred italic heading. */
export function SilhouetteRow() {
  return (
    <section className="page-width grid items-center gap-8 py-12 md:grid-cols-2 md:gap-0 md:py-0">
      <Placeholder label="The Bateau silhouette" className="aspect-square w-full" />
      <div className="flex items-center justify-center px-6">
        <h2 className="type-h2 text-center italic">
          Inspired by the
          <br />
          Silhouette of a “Bateau”
        </h2>
      </div>
    </section>
  )
}

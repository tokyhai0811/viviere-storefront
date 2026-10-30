import { Placeholder } from "@/components/placeholder"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/** templates/index.json › section_BUa3P4: square image beside a centred italic heading. */
export function SilhouetteRow({ t }: { t: Dictionary }) {
  return (
    <section className="page-width grid items-center gap-8 py-12 md:grid-cols-2 md:gap-0 md:py-0">
      <Placeholder label="The Bateau silhouette" className="aspect-square w-full" />
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

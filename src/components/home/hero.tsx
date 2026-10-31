import { Link } from "@/components/link"
import { Placeholder } from "@/components/placeholder"
import type { Dictionary } from "@/lib/i18n/dictionaries"

/** templates/index.json › hero_iyt6zg: full-screen banner, gradient overlay, copy on the right. */
export function Hero({ t }: { t: Dictionary }) {
  return (
    <section className="relative h-svh min-h-[560px] w-full overflow-hidden text-white">
      <Placeholder label="Banner: VIVIÈRE The Bateau in blue" tone="dark" className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="page-width relative flex h-full flex-col items-end justify-center gap-1 text-right">
        <p className="font-heading text-[1.5rem] leading-tight italic">The Bateau</p>
        <p className="text-[0.75rem] leading-tight">
          <Link href="/collections/all" className="link-underline">
            {t.home.explore}
          </Link>
        </p>
      </div>
    </section>
  )
}

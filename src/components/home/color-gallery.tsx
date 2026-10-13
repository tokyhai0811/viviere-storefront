import Link from "next/link"
import { Placeholder } from "@/components/placeholder"

/**
 * blocks/ai_gen_block_499fd59: two columns, a large image on the left and a
 * 2×2 grid of square colour shots with centred labels on the right.
 */
const tiles = [
  { label: "BURGUNDY", href: "/products/microfiber-leather-shoulder-bag-bateau-burgundy" },
  { label: "BROWN", href: "/products/the-bateau-brown" },
  { label: "TEAL", href: "/products/the-bateau-teal" },
  { label: "BLACK", href: "/products/the-bateau-black" },
]

export function ColorGallery() {
  return (
    <section className="page-width py-12 md:py-16">
      <div className="grid gap-5 md:grid-cols-2">
        <Placeholder label="The Bateau lifestyle" className="aspect-square w-full md:aspect-auto md:h-full" />
        <div className="grid grid-cols-2 gap-5">
          {tiles.map((t) => (
            <Link key={t.label} href={t.href} className="group block">
              <div className="overflow-hidden">
                <Placeholder
                  label={`The Bateau in ${t.label.toLowerCase()}`}
                  className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-2 text-center text-[12px]">{t.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

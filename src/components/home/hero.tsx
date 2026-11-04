import { getImageProps } from "next/image"
import { Link } from "@/components/link"
import { Placeholder } from "@/components/placeholder"

/**
 * templates/index.json › hero_iyt6zg: full-screen banner, gradient overlay, copy on the right.
 * The banner comes from admin Theme › Home page images, with an optional
 * portrait version for phones (art direction through <picture>).
 */
export function Hero({
  title,
  linkLabel,
  link,
  image,
  mobileImage,
}: {
  title: string
  linkLabel: string
  link: string
  image?: string | null
  mobileImage?: string | null
}) {
  const desktop = image || mobileImage
  return (
    <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-[#cfcfcf] text-white">
      {desktop ? (
        <Banner desktop={desktop} mobile={mobileImage} />
      ) : (
        <Placeholder label="Banner: VIVIÈRE The Bateau in blue" tone="dark" className="absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="page-width relative flex h-full flex-col items-end justify-center gap-1 text-right">
        <p className="font-heading text-[1.5rem] leading-tight italic">{title}</p>
        <p className="text-[0.75rem] leading-tight">
          <Link href={link} className="link-underline">
            {linkLabel}
          </Link>
        </p>
      </div>
    </section>
  )
}

function Banner({ desktop, mobile }: { desktop: string; mobile?: string | null }) {
  const common = { alt: "VIVIÈRE The Bateau", fill: true, sizes: "100vw", preload: true }
  const { props: wide } = getImageProps({ ...common, src: desktop })
  const narrow = mobile && mobile !== desktop ? getImageProps({ ...common, src: mobile }).props : null
  return (
    <picture>
      {narrow && <source media="(max-width: 767px)" srcSet={narrow.srcSet} sizes={narrow.sizes} />}
      <img {...wide} alt={wide.alt} className="object-cover" />
    </picture>
  )
}

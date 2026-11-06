import Image, { type ImageLoader } from "next/image"
import { Placeholder } from "@/components/placeholder"

/**
 * An image from Medusa (product.images[].url, thumbnail), cropped to the box
 * that `className` gives it. Falls back to a blank placeholder when the
 * product has no image yet.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  className = "",
  preload,
  quality,
  loader,
}: {
  src: string | null | undefined
  alt: string
  sizes: string
  className?: string
  preload?: boolean
  /** 75 unless set; 90 is the only other value next.config allows. */
  quality?: 75 | 90
  /** Overrides the URL per width; the product page uses it to set a minimum. */
  loader?: ImageLoader
}) {
  if (!src) return <Placeholder label={alt} className={className} />
  return (
    <div className={`relative overflow-hidden bg-placeholder ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} quality={quality} loader={loader} className="object-cover" />
    </div>
  )
}

/** The product's main image: its thumbnail, else its first image. */
export function productThumbnail(product: { thumbnail: string | null; images: { url: string }[] }) {
  return product.thumbnail || product.images.find((i) => i.url)?.url || null
}

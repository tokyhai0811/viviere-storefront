"use client"

import { useState } from "react"
import type { StoreImage } from "@/lib/types"
import type { ImageLoader } from "next/image"
import { ProductImage } from "@/components/product-image"
import { PRODUCT_PAGE_IMAGES } from "@/lib/image-settings"

/** Next's own optimizer, but never below `min` pixels wide. */
function minWidthLoader(min: number): ImageLoader {
  return ({ src, width, quality }) =>
    `/_next/image?url=${encodeURIComponent(src)}&w=${Math.max(width, min)}&q=${quality ?? PRODUCT_PAGE_IMAGES.quality}`
}
const desktopLoader = minWidthLoader(PRODUCT_PAGE_IMAGES.minWidthDesktop)
const mobileLoader = minWidthLoader(PRODUCT_PAGE_IMAGES.minWidthMobile)
import { useI18n } from "@/lib/i18n/client"

/**
 * blocks/_product-media-gallery: one-column stacked grid on desktop with no gap,
 * 1/1.25 aspect ratio; swipeable slideshow with dots on mobile.
 */
export function MediaGallery({ images, title }: { images: StoreImage[]; title: string }) {
  const { t } = useI18n()
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* Desktop: stacked */}
      <div className="hidden flex-col gap-px md:flex">
        {images.map((img, i) => (
          <ProductImage
            key={img.id}
            src={img.url}
            alt={t.product.imageAlt(title, i + 1)}
            sizes="50vw"
            quality={PRODUCT_PAGE_IMAGES.quality}
            loader={desktopLoader}
            preload={i === 0}
            className="aspect-[1/1.25] w-full"
          />
        ))}
      </div>

      {/* Mobile: scroll-snap slideshow */}
      <div className="md:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget
            setActive(Math.round(el.scrollLeft / el.clientWidth))
          }}
        >
          {images.map((img, i) => (
            <ProductImage
              key={img.id}
              src={img.url}
              alt={t.product.imageAlt(title, i + 1)}
              sizes="100vw"
              quality={PRODUCT_PAGE_IMAGES.quality}
              loader={mobileLoader}
              className="aspect-[1/1.25] w-full shrink-0 snap-start"
            />
          ))}
        </div>
        <div className="flex justify-center gap-2 py-3" aria-hidden>
          {images.map((img, i) => (
            <span
              key={img.id}
              className={`size-1.5 rounded-full ${i === active ? "bg-black" : "bg-black/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

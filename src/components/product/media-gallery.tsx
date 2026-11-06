"use client"

import { useState } from "react"
import type { StoreImage } from "@/lib/types"
import { ProductImage } from "@/components/product-image"
import { ImageZoom } from "@/components/product/image-zoom"
import { PRODUCT_PAGE_IMAGES, minWidthLoader } from "@/lib/image-settings"

const desktopLoader = minWidthLoader(PRODUCT_PAGE_IMAGES.minWidthDesktop)
const mobileLoader = minWidthLoader(PRODUCT_PAGE_IMAGES.minWidthMobile)
import { useI18n } from "@/lib/i18n/client"

/**
 * blocks/_product-media-gallery: one-column stacked grid on desktop with no gap,
 * 1/1.25 aspect ratio; swipeable slideshow with a segmented progress bar on mobile.
 * Clicking an image opens the zoom dialog at that image.
 */
export function MediaGallery({ images, title }: { images: StoreImage[]; title: string }) {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState<number | null>(null)

  return (
    <div>
      {/* Desktop: stacked */}
      <div className="hidden flex-col md:flex">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            aria-label={t.product.zoom}
            onClick={() => setZoomed(i)}
            className="block w-full cursor-zoom-in"
          >
            <ProductImage
              src={img.url}
              alt={t.product.imageAlt(title, i + 1)}
              sizes="50vw"
              quality={PRODUCT_PAGE_IMAGES.quality}
              loader={desktopLoader}
              preload={i === 0}
              className="aspect-[1/1.25] w-full"
            />
          </button>
        ))}
      </div>

      {/* Mobile: scroll-snap slideshow */}
      <div className="relative md:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget
            setActive(Math.round(el.scrollLeft / el.clientWidth))
          }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={t.product.zoom}
              onClick={() => setZoomed(i)}
              className="block w-full shrink-0 snap-start cursor-zoom-in"
            >
              <ProductImage
                src={img.url}
                alt={t.product.imageAlt(title, i + 1)}
                sizes="100vw"
                quality={PRODUCT_PAGE_IMAGES.quality}
                loader={mobileLoader}
                className="aspect-[1/1.25] w-full"
              />
            </button>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex" aria-hidden>
          {images.map((img, i) => (
            <span
              key={img.id}
              className={`h-0.5 flex-1 ${i === active ? "bg-black" : "bg-black/20"}`}
            />
          ))}
        </div>
      </div>

      {zoomed !== null && (
        <ImageZoom images={images} title={title} startIndex={zoomed} onClose={() => setZoomed(null)} />
      )}
    </div>
  )
}

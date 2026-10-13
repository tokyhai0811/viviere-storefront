"use client"

import { useState } from "react"
import type { StoreImage } from "@/lib/types"
import { Placeholder } from "@/components/placeholder"

/**
 * blocks/_product-media-gallery: one-column stacked grid on desktop with no gap,
 * 1/1.25 aspect ratio; swipeable slideshow with dots on mobile.
 */
export function MediaGallery({ images, title }: { images: StoreImage[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* Desktop: stacked */}
      <div className="hidden flex-col gap-px md:flex">
        {images.map((img, i) => (
          <Placeholder key={img.id} label={`${title}, image ${i + 1}`} className="aspect-[1/1.25] w-full" />
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
            <Placeholder
              key={img.id}
              label={`${title}, image ${i + 1}`}
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

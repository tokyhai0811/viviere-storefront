"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { ProductImage } from "@/components/product-image"

const SIZES = "(min-width: 768px) 33vw, 50vw"

/**
 * Collection card images, like viviere.vn:
 * - desktop: the second photo fades in while the card is hovered;
 * - phones: swipe through every photo, with a thin bar under the image
 *   showing where you are.
 * One image (or none) renders a plain image.
 */
export function CardMedia({ images, alt }: { images: string[]; alt: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  if (images.length < 2) {
    return <ProductImage src={images[0]} alt={alt} sizes={SIZES} className="aspect-[4/5] w-full" />
  }

  const onScroll = () => {
    const el = track.current
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <>
      {/* Desktop: hover swap. */}
      <div className="relative hidden aspect-[4/5] w-full overflow-hidden bg-placeholder md:block">
        <Image src={images[0]} alt={alt} fill sizes={SIZES} className="object-cover" />
        <Image
          src={images[1]}
          alt=""
          fill
          sizes={SIZES}
          className="object-cover opacity-0 transition-opacity duration-500 group-hover/media:opacity-100"
        />
      </div>

      {/* Phones: swipe, with a position bar. */}
      <div className="md:hidden">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex aspect-[4/5] w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div key={src} className="relative h-full w-full shrink-0 snap-start bg-placeholder">
              <Image src={src} alt={i === 0 ? alt : ""} fill sizes={SIZES} className="object-cover" />
            </div>
          ))}
        </div>
        <div className="relative mt-[3px] h-px bg-black/15" aria-hidden>
          <div
            className="absolute -top-px h-[3px] bg-black transition-transform duration-200"
            style={{ width: `${100 / images.length}%`, transform: `translateX(${index * 100}%)` }}
          />
        </div>
      </div>
    </>
  )
}

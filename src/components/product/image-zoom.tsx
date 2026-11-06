"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { StoreImage } from "@/lib/types"
import { useI18n } from "@/lib/i18n/client"
import { PRODUCT_PAGE_IMAGES, minWidthLoader } from "@/lib/image-settings"

const zoomLoader = minWidthLoader(PRODUCT_PAGE_IMAGES.zoomWidth)

/** The live site's full-screen breakpoint: images stack and clicking one closes the zoom. */
const isDesktop = () => window.matchMedia("(min-width: 750px)").matches

/**
 * Horizon's zoom dialog, as on viviere.vn: a white full-screen view with every
 * image at full width, opened at the one clicked. Desktop scrolls a stack, with
 * thumbnails down the right edge, and a click on an image closes it. Phones
 * swipe between slides, pinch to zoom, and have thumbnails along the bottom.
 */
export function ImageZoom({
  images,
  title,
  startIndex,
  onClose,
}: {
  images: StoreImage[]
  title: string
  startIndex: number
  onClose: () => void
}) {
  const { t } = useI18n()
  const dialog = useRef<HTMLDialogElement>(null)
  const gallery = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(startIndex)

  const scrollTo = (index: number, behavior: ScrollBehavior) =>
    gallery.current?.children[index]?.scrollIntoView({ behavior, block: "start", inline: "start" })

  useEffect(() => {
    dialog.current?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    gallery.current?.children[startIndex]?.scrollIntoView({ block: "start", inline: "start" })
  }, [startIndex])

  // The current image is the one crossing the middle of the screen; images can
  // be taller than the viewport, so a share-of-image threshold would miss them.
  useEffect(() => {
    const root = gallery.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Array.from(root.children).indexOf(entry.target))
        }
      },
      { root, rootMargin: "-50% -50% -50% -50%" }
    )
    Array.from(root.children).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      onClose={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-white p-0 text-black"
    >
      <ul
        ref={gallery}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-none md:block md:snap-none md:overflow-x-hidden md:overflow-y-auto md:[scrollbar-width:thin]"
      >
        {images.map((img, i) => (
          <li
            key={img.id}
            className="relative h-full w-full shrink-0 snap-start touch-pinch-zoom md:h-auto md:aspect-[3840/5334] md:cursor-zoom-out"
            onClick={() => isDesktop() && dialog.current?.close()}
          >
            <Image
              src={img.url}
              alt={t.product.imageAlt(title, i + 1)}
              fill
              sizes="100vw"
              quality={PRODUCT_PAGE_IMAGES.quality}
              loader={zoomLoader}
              loading={i === startIndex ? "eager" : "lazy"}
              className="object-contain"
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label={t.product.closeZoom}
        onClick={() => dialog.current?.close()}
        className="fixed top-4 right-4 flex size-11 items-center justify-center text-white mix-blend-difference"
      >
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden>
          <path d="M12 2L2 12M12 12L2 2" />
        </svg>
      </button>

      <div className="fixed inset-x-0 bottom-0 flex md:static">
        <div className="no-scrollbar mx-auto flex max-w-full gap-2 overflow-x-auto p-4 md:fixed md:top-1/2 md:right-0 md:mx-0 md:max-h-[calc(100vh-200px)] md:-translate-y-1/2 md:flex-col md:overflow-x-hidden md:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={t.product.imageAlt(title, i + 1)}
              aria-current={i === active ? "true" : undefined}
              onClick={() => scrollTo(i, "smooth")}
              className="relative aspect-[4/5] w-[57px] shrink-0 aria-current:outline aria-current:outline-1 aria-current:outline-offset-2 aria-current:outline-black"
            >
              <Image src={img.url} alt="" fill sizes="57px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </dialog>
  )
}

"use client"

import Image from "next/image"
import { Link } from "@/components/link"
import { useCallback, useRef, useState } from "react"
import { useI18n } from "@/lib/i18n/client"

/**
 * blocks/ai_gen_block_ec3fd3e: before/after image comparison slider (16:9),
 * draggable white handle, linked labels at the bottom corners.
 * Without product images, two blank tones keep the split visible.
 */
type Side = { label: string; href: string; image: string | null }

export function ComparisonSlider({ before, after }: { before: Side; after: Side }) {
  const { t } = useI18n()
  const [position, setPosition] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  return (
    <div
      ref={ref}
      className="relative aspect-video w-full touch-pan-y select-none overflow-hidden"
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div role="img" aria-label={t.home.bateauIn(after.label.toLowerCase())} className="absolute inset-0 bg-[#e4e1d8]">
        {after.image && <Image src={after.image} alt="" fill sizes="100vw" className="object-cover" draggable={false} />}
      </div>
      <div
        role="img"
        aria-label={t.home.bateauIn(before.label.toLowerCase())}
        className="absolute inset-0 bg-[#dde1e6]"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {before.image && <Image src={before.image} alt="" fill sizes="100vw" className="object-cover" draggable={false} />}
      </div>

      {/* Divider line + handle */}
      <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left: `${position}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={t.home.compare}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5))
            if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5))
          }}
          className="absolute top-1/2 left-1/2 flex size-[50px] -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center gap-1 rounded-full bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-[#f5f5f5]"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <Link
        href={before.href}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1 left-2.5 rounded px-1 py-1.5 font-body text-[12px] leading-[1.6] font-normal text-black md:top-auto md:bottom-[30px] md:left-[30px] md:px-4 md:py-2 md:text-[18px]"
      >
        {before.label}
      </Link>
      <Link
        href={after.href}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1 right-2.5 rounded px-1 py-1.5 font-body text-[12px] leading-[1.6] font-normal text-black md:top-auto md:right-[30px] md:bottom-[30px] md:px-4 md:py-2 md:text-[18px]"
      >
        {after.label}
      </Link>
    </div>
  )
}

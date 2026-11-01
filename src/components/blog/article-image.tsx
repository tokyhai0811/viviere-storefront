import { Placeholder } from "@/components/placeholder"

/**
 * An article's cover. The URL is pasted in the admin and can be on any host,
 * so it is a plain <img> rather than next/image (which needs allowed hosts).
 */
export function ArticleImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  if (!src) return <Placeholder label={alt} className={className} />
  return (
    <div className={`relative overflow-hidden bg-placeholder ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
    </div>
  )
}

export function formatArticleDate(date: string | null, locale: string) {
  if (!date) return null
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(date)
  )
}

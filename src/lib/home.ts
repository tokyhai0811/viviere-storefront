/**
 * Admin Theme › Home page text and products, stored as JSON in
 * store.metadata.theme_home (see the backend's src/admin/components/home-content.tsx).
 * Empty values fall back to the dictionary copy and default colours.
 */
export type HomeContent = {
  heroTitle?: string
  heroLinkLabel?: string
  heroLink?: string
  silhouette?: string[]
  summerTitle?: string
  galleryProducts: string[]
  summerProducts: string[]
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined)
const ids = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [])

export function parseHomeContent(raw: string | null | undefined, lang: string): HomeContent {
  let v: Record<string, unknown> = {}
  try {
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === "object") v = parsed
  } catch {
    // Invalid JSON: use the defaults.
  }
  // Vietnamese uses the _vi field, else the English one.
  const pick = (key: string) => (lang === "vi" ? str(v[`${key}_vi`]) : undefined) ?? str(v[key])
  const link = str(v.hero_link)
  return {
    heroTitle: pick("hero_title"),
    heroLinkLabel: pick("hero_link_label"),
    // Only links within the site.
    heroLink: link?.startsWith("/") && !link.startsWith("//") ? link : undefined,
    silhouette: pick("silhouette_text")?.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
    summerTitle: pick("summer_title"),
    galleryProducts: ids(v.gallery_products),
    summerProducts: ids(v.summer_products),
  }
}

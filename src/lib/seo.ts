import type { Metadata } from "next"
import { cacheLife } from "next/cache"
import { medusaEnabled, sdk } from "@/lib/medusa/client"
import { DEFAULT_LANG, LANGS, localizePath, type Lang } from "@/lib/i18n/config"

/**
 * Search engine listings. Titles and descriptions come from the admin's
 * "Search engine listing" fields (seo_title, seo_description and their _vi
 * twins on products, collections, pages, articles and the store), falling
 * back to the record's own title and text. Every page gets a canonical URL,
 * links to its other-language version, and Open Graph / Twitter tags.
 */

/** The public origin. Set NEXT_PUBLIC_SITE_URL once the store runs on its own domain. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

export const SITE_NAME = "VIVIÈRE"

export type SiteSettings = {
  seo_title: string | null
  seo_description: string | null
  seo_title_vi: string | null
  seo_description_vi: string | null
  seo_image: string | null
  google_site_verification: string | null
  /** Theme › Typography, as JSON. See src/lib/typography.ts. */
  theme_typography?: string | null
}

// viviere.vn's home page listing, used without a backend.
const DEFAULT_SETTINGS: SiteSettings = {
  seo_title: "VIVIÈRE | Leather Handbags and Accessories",
  seo_description:
    "Explore handbags and accessories by VIVIÈRE. Modern styles, quality craftsmanship, and versatile designs for everyday wear.",
  seo_title_vi: null,
  seo_description_vi: null,
  seo_image: null,
  google_site_verification: null,
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache"
  cacheLife("minutes")
  if (!medusaEnabled) return DEFAULT_SETTINGS
  try {
    const { settings } = await sdk.client.fetch<{ settings: SiteSettings }>("/store/site-settings")
    return settings
  } catch {
    // An older backend without the route.
    return DEFAULT_SETTINGS
  }
}

type SeoSource = Record<string, unknown> | null | undefined

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined)

/** The SEO title and description set in the admin for `lang`, Vietnamese falling back to English. */
export function pickSeo(source: SeoSource, lang: Lang): { title?: string; description?: string } {
  const field = (key: string) => (lang !== DEFAULT_LANG && str(source?.[`${key}_${lang}`])) || str(source?.[key])
  return { title: field("seo_title"), description: field("seo_description") }
}

/** Plain text from HTML or Markdown, cut at a word boundary for a meta description. */
export function excerpt(text: string | null | undefined, max = 160): string | undefined {
  if (!text) return undefined
  const plain = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`[\]()!-]+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
  if (plain.length <= max) return plain || undefined
  return plain.slice(0, plain.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "") + "…"
}

const OG_LOCALE: Record<Lang, string> = { en: "en_US", vi: "vi_VN" }

/**
 * Metadata for a page at `path` (without the language prefix). `seoTitle`
 * replaces the whole <title> like Shopify's SEO title does; `title` gets the
 * "| VIVIÈRE" suffix from the layout. Without an image, the store's share
 * image (admin › Settings › Store) is used.
 */
export async function pageMetadata({
  path,
  lang,
  title,
  seoTitle,
  description,
  image,
  type = "website",
  noindex = false,
  extra,
}: {
  path: string
  lang: Lang
  title?: string
  seoTitle?: string
  description?: string
  image?: string | null
  type?: "website" | "article"
  noindex?: boolean
  extra?: Partial<Metadata>
}): Promise<Metadata> {
  const url = localizePath(lang, path)
  // A page's Open Graph replaces the layout's, so the default share image is repeated here.
  image ||= (await getSiteSettings()).seo_image
  const shownTitle = seoTitle ?? (title ? `${title} | ${SITE_NAME}` : SITE_NAME)
  const images = image ? [{ url: image }] : undefined
  return {
    title: seoTitle ? { absolute: seoTitle } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LANGS.map((l) => [l, localizePath(l, path)])),
        "x-default": path,
      },
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      title: shownTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shownTitle,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    ...extra,
  }
}

/** Metadata for pages that should stay out of search results (cart, checkout, order, search). */
export const noindex: Metadata["robots"] = { index: false, follow: true }

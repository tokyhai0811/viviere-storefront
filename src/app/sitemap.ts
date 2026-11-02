import type { MetadataRoute } from "next"
import { medusaEnabled, sdk } from "@/lib/medusa/client"
import { collections as mockCollections, products as mockProducts } from "@/lib/data/mock"
import { listPages } from "@/lib/data/pages"
import { BLOGS, listArticles } from "@/lib/data/articles"
import { LANGS, localizePath } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/seo"

/**
 * /sitemap.xml, like Shopify's: home, collections, products, pages, policies,
 * blogs and articles, each in English with its Vietnamese alternate.
 */

// Handles served under /policies/ rather than /pages/ (as on Shopify).
const POLICIES = new Set(["refund-policy", "shipping-policy", "privacy-policy", "terms-of-service"])

const abs = (path: string) => new URL(path, SITE_URL).href

/**
 * Product and collection handles. Read straight from the Store API: the
 * catalogue helpers depend on the page's language and market, which this
 * route (outside /[lang]/[market]) doesn't have.
 */
async function catalogueHandles() {
  if (!medusaEnabled) {
    return {
      products: mockProducts.map((p) => ({ handle: p.handle, updated_at: null })),
      collections: mockCollections.map((c) => c.handle),
    }
  }
  const [{ products }, { collections }] = await Promise.all([
    sdk.store.product.list({ fields: "handle,updated_at", limit: 1000 }),
    sdk.store.collection.list({ fields: "handle", limit: 1000 }),
  ])
  return {
    products: products.map((p) => ({ handle: p.handle, updated_at: (p.updated_at as string | null) ?? null })),
    // Shopify's built-in /collections/all comes first.
    collections: ["all", ...collections.map((c) => c.handle)],
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ products, collections }, pages, blogs] = await Promise.all([
    catalogueHandles(),
    listPages(),
    Promise.all(BLOGS.map(async (blog) => ({ blog, articles: await listArticles(blog) }))),
  ])

  const entry = (path: string, lastModified?: string | null): MetadataRoute.Sitemap[number] => ({
    url: abs(path),
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, abs(localizePath(l, path))])) },
  })

  return [
    entry("/"),
    ...collections.map((handle) => entry(`/collections/${handle}`)),
    ...products.map((p) => entry(`/products/${p.handle}`, p.updated_at)),
    ...pages.map((p) =>
      entry(`${POLICIES.has(p.handle) ? "/policies" : "/pages"}/${p.handle}`, p.updated_at)
    ),
    ...blogs.flatMap(({ blog, articles }) => [
      entry(`/blogs/${blog}`),
      ...articles.map((a) => entry(`/blogs/${blog}/${a.handle}`, a.published_at)),
    ]),
  ]
}

import { cacheLife } from "next/cache"
import { medusaEnabled, sdk } from "@/lib/medusa/client"

/**
 * Blog articles (viviere.vn/blogs/blogs). The backend's content module serves
 * them at /store/articles; they are edited in the admin under "Blog". Without
 * a backend, the two viviere.vn articles are listed with placeholder bodies.
 */

/** viviere.vn has a single blog, /blogs/blogs. */
export const BLOGS = ["blogs"]

export type StoreArticle = {
  id: string
  blog: string
  handle: string
  title: string
  excerpt: string
  /** HTML from the admin editor (or Markdown). Not included in lists. */
  body?: string
  image_url: string | null
  author: string | null
  published_at: string | null
}

const MOCK_ARTICLES: StoreArticle[] = [
  {
    handle: "types-of-handbags-a-complete-guide-to-timeless-styles-and-everyday-use",
    title: "Types of Handbags: A Complete Guide to Timeless Styles and Everyday Use",
    excerpt:
      "A handbag is never simply an accessory. It defines how you carry your day, what you choose to keep close, and how you move through each moment with intention.",
    published_at: "2026-04-24T00:00:00Z",
  },
  {
    handle: "what-is-mircrofiber-leather",
    title: "What Is Microfiber Leather? Lifespan, Uses, and How It Compares to PU and Genuine Leather",
    excerpt: "Microfiber leather is a high performance synthetic leather designed to replicate the look and feel of genuine leather.",
    published_at: "2026-03-31T00:00:00Z",
  },
].map((a) => ({
  ...a,
  id: `art_${a.handle}`,
  blog: "blogs",
  image_url: null,
  author: null,
  body: `<p>${a.excerpt}</p><p>Placeholder text. Connect the Medusa backend to edit this article in the admin.</p>`,
}))

export async function listArticles(blog: string): Promise<StoreArticle[]> {
  "use cache"
  cacheLife("minutes")
  if (!medusaEnabled) return blog === "blogs" ? MOCK_ARTICLES : []
  try {
    const { articles } = await sdk.client.fetch<{ articles: StoreArticle[] }>("/store/articles", {
      query: { blog },
    })
    return articles
  } catch {
    // An older backend without the blog.
    return []
  }
}

export async function getArticle(blog: string, handle: string): Promise<StoreArticle | null> {
  "use cache"
  cacheLife("minutes")
  if (!medusaEnabled) return MOCK_ARTICLES.find((a) => a.blog === blog && a.handle === handle) ?? null
  try {
    const { article } = await sdk.client.fetch<{ article: StoreArticle }>(
      `/store/articles/${encodeURIComponent(handle)}`,
      { query: { blog } }
    )
    return article
  } catch {
    return null
  }
}

import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

/** /robots.txt: everything but the cart, checkout, order and search pages, like Shopify's. */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/cart", "/checkout", "/order", "/search"]
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...privatePaths, ...privatePaths.map((p) => `/vi${p}`)],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  }
}

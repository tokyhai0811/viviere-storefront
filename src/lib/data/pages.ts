import { cacheLife } from "next/cache"
import { medusaEnabled, sdk } from "@/lib/medusa/client"

/**
 * Content pages (About Us, Contact, policies). Medusa has no CMS, so the
 * backend adds a small "Pages" module edited in the admin and served at
 * /store/pages. Without a backend, a placeholder page is shown.
 */

export type StorePage = {
  id: string
  handle: string
  title: string
  /** Markdown. */
  body: string
}

const MOCK_PAGES: StorePage[] = [
  { handle: "about-us", title: "About Us" },
  { handle: "contact", title: "Contact" },
  { handle: "shipping-policy", title: "Shipping Policy" },
  { handle: "refund-policy", title: "Refund Policy" },
  { handle: "privacy-policy", title: "Privacy Policy" },
  { handle: "terms-of-service", title: "Terms of Service" },
].map((p) => ({ ...p, id: `page_${p.handle}`, body: "Placeholder text. Connect the Medusa backend to edit this page in the admin." }))

export async function listPages(): Promise<Pick<StorePage, "handle" | "title">[]> {
  "use cache"
  cacheLife("minutes")
  if (!medusaEnabled) return MOCK_PAGES
  try {
    const { pages } = await sdk.client.fetch<{ pages: StorePage[] }>("/store/pages")
    return pages
  } catch {
    return []
  }
}

export async function getPage(handle: string): Promise<StorePage | null> {
  "use cache"
  cacheLife("minutes")
  if (!medusaEnabled) return MOCK_PAGES.find((p) => p.handle === handle) ?? null
  try {
    const { page } = await sdk.client.fetch<{ page: StorePage }>(`/store/pages/${encodeURIComponent(handle)}`)
    return page
  } catch {
    // 404 for unknown or unpublished handles.
    return null
  }
}

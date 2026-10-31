import type { Metadata } from "next"
import { Suspense } from "react"
import { listProducts } from "@/lib/data/products"
import { getDictionary } from "@/lib/i18n/server"
import { SearchResults } from "@/components/search/search-results"

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.search }
}

/** Shopify's /search?q=…, opened from "View all" in the search drawer. */
export default async function SearchPage() {
  const [{ products }, t] = await Promise.all([listProducts(), getDictionary()])
  return (
    <section className="page-width pt-10 pb-[66px]">
      <h1 className="type-h2 mb-8 text-center">{t.search.title}</h1>
      {/* The query is read in the browser, so the page itself stays static. */}
      <Suspense>
        <SearchResults products={products} />
      </Suspense>
    </section>
  )
}

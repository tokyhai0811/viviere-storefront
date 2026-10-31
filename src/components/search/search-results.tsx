"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import type { StoreProduct } from "@/lib/types"
import { useI18n } from "@/lib/i18n/client"
import { ProductCard } from "@/components/product/product-card"
import { SearchIcon } from "@/components/icons"

/** Products whose title matches `?q=`, with a search box to refine it. */
export function SearchResults({ products }: { products: StoreProduct[] }) {
  const { t, locale, href } = useI18n()
  const router = useRouter()
  const q = useSearchParams().get("q")?.trim() ?? ""
  const [query, setQuery] = useState(q)
  const needle = q.toLowerCase()
  const results = needle ? products.filter((p) => p.title.toLowerCase().includes(needle)) : products

  return (
    <>
      <form
        role="search"
        className="mx-auto mb-10 flex max-w-[480px] items-center gap-3 border-b border-black pb-2"
        onSubmit={(e) => {
          e.preventDefault()
          router.replace(href(`/search?q=${encodeURIComponent(query.trim())}`))
        }}
      >
        <SearchIcon className="size-4" />
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          aria-label={t.search.placeholder}
          className="flex-1 bg-transparent text-[0.875rem] outline-none"
        />
      </form>
      {needle && (
        <p className="mb-6 text-center uppercase text-muted">
          {results.length ? t.search.results(results.length, q) : t.search.noResults(q)}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-5">
        {results.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} locale={locale} t={t} />
          </li>
        ))}
      </ul>
    </>
  )
}

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
        className="relative mx-auto mb-[69px] flex max-w-[675px] items-center"
        onSubmit={(e) => {
          e.preventDefault()
          router.replace(href(`/search?q=${encodeURIComponent(query.trim())}`))
        }}
      >
        <SearchIcon className="pointer-events-none absolute left-5 size-[22px]" />
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          aria-label={t.search.placeholder}
          className="w-full border border-black/13 bg-white px-[54px] py-4 text-[0.75rem] leading-[1.6] outline-none focus:border-black"
        />
      </form>
      {needle && (
        <p className="mb-6 text-center uppercase text-muted">
          {results.length ? t.search.results(results.length, q) : t.search.noResults(q)}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {results.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} locale={locale} t={t} />
          </li>
        ))}
      </ul>
    </>
  )
}

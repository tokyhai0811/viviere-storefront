import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCollectionByHandle, listCollections, listProducts } from "@/lib/data/products"
import { ProductCard } from "@/components/product/product-card"
import { LANG_LOCALE } from "@/lib/i18n/config"
import { getDictionary, getLang } from "@/lib/i18n/server"

/**
 * templates/collection.json: no title banner (disabled on the live site),
 * filters and sorting off, large cards (3 per row desktop, 2 mobile), 20px gaps.
 */

export async function generateStaticParams() {
  const collections = await listCollections()
  return collections.map((c) => ({ handle: c.handle }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[market]/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params
  const [collection, t] = await Promise.all([getCollectionByHandle(handle), getDictionary()])
  return { title: collection?.title ?? t.meta.collection }
}

export default async function CollectionPage({ params }: PageProps<"/[lang]/[market]/collections/[handle]">) {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  const [{ products }, lang] = await Promise.all([listProducts({ collection_id: collection.id }), getLang()])

  return (
    <section className="page-width pt-6 pb-[66px] md:pt-10">
      <h1 className="sr-only">{collection.title}</h1>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-5">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} locale={LANG_LOCALE[lang]} />
          </li>
        ))}
      </ul>
    </section>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCollectionByHandle, listCollections, listProducts } from "@/lib/data/products"
import { ProductCard } from "@/components/product/product-card"
import { LANG_LOCALE } from "@/lib/i18n/config"
import { getDictionary, getLang } from "@/lib/i18n/server"
import { getSiteSettings, pageMetadata, pickSeo } from "@/lib/seo"

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
  const [collection, t, lang, settings] = await Promise.all([
    getCollectionByHandle(handle),
    getDictionary(),
    getLang(),
    getSiteSettings(),
  ])
  if (!collection) return { title: t.meta.collection }
  const seo = pickSeo(collection.metadata, lang)
  return pageMetadata({
    path: `/collections/${handle}`,
    lang,
    title: collection.title,
    seoTitle: seo.title,
    // viviere.vn's collections reuse the store description.
    description: seo.description ?? pickSeo(settings, lang).description,
  })
}

export default async function CollectionPage({ params }: PageProps<"/[lang]/[market]/collections/[handle]">) {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  const [{ products }, lang, t] = await Promise.all([
    listProducts({ collection_id: collection.id }),
    getLang(),
    getDictionary(),
  ])

  return (
    <section className="page-width pb-[66px] max-md:px-0!">
      <h1 className="sr-only">{collection.title}</h1>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} locale={LANG_LOCALE[lang]} t={t} />
          </li>
        ))}
      </ul>
    </section>
  )
}

import type { Metadata } from "next"
import { getPage, listPages } from "@/lib/data/pages"
import { ContentPage } from "@/components/content/content-page"
import { getDictionary, getLang } from "@/lib/i18n/server"
import { excerpt, pageMetadata, pickSeo } from "@/lib/seo"

/** Shopify's /pages/<handle> URLs, served from the Pages section of the Medusa admin. */

export async function generateStaticParams() {
  const pages = await listPages()
  return pages.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[market]/pages/[handle]">): Promise<Metadata> {
  const { handle } = await params
  const [page, t, lang] = await Promise.all([getPage(handle), getDictionary(), getLang()])
  if (!page) return { title: t.meta.page }
  const seo = pickSeo(page, lang)
  return pageMetadata({
    path: `/pages/${handle}`,
    lang,
    title: page.title,
    seoTitle: seo.title,
    description: seo.description ?? excerpt(page.body),
  })
}

export default async function Page({ params }: PageProps<"/[lang]/[market]/pages/[handle]">) {
  const { handle } = await params
  return <ContentPage handle={handle} />
}

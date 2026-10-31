import type { Metadata } from "next"
import { getPage, listPages } from "@/lib/data/pages"
import { ContentPage } from "@/components/content/content-page"
import { getDictionary } from "@/lib/i18n/server"

/** Shopify's /pages/<handle> URLs, served from the Pages section of the Medusa admin. */

export async function generateStaticParams() {
  const pages = await listPages()
  return pages.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[market]/pages/[handle]">): Promise<Metadata> {
  const { handle } = await params
  return { title: (await getPage(handle))?.title ?? (await getDictionary()).meta.page }
}

export default async function Page({ params }: PageProps<"/[lang]/[market]/pages/[handle]">) {
  const { handle } = await params
  return <ContentPage handle={handle} />
}

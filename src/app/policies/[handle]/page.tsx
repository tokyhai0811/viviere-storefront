import type { Metadata } from "next"
import { getPage, listPages } from "@/lib/data/pages"
import { ContentPage } from "@/components/content/content-page"

/** Shopify's /policies/<handle> URLs, served from the Pages section of the Medusa admin. */

export async function generateStaticParams() {
  const pages = await listPages()
  return pages.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const { handle } = await params
  return { title: (await getPage(handle))?.title ?? "Page" }
}

export default async function Page({ params }: PageProps<"/policies/[handle]">) {
  const { handle } = await params
  return <ContentPage handle={handle} />
}

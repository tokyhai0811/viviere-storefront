import { marked } from "marked"
import { notFound } from "next/navigation"
import { getPage } from "@/lib/data/pages"

/** templates/page.json: centred narrow column, title then rich text. */
export async function ContentPage({ handle }: { handle: string }) {
  const page = await getPage(handle)
  if (!page) notFound()

  // The body is written by staff in the Medusa admin, so it is trusted HTML.
  const html = await marked.parse(page.body)

  return (
    <section className="page-width max-w-[720px] py-12 md:py-20">
      <h1 className="type-h2 mb-8 text-center">{page.title}</h1>
      <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  )
}

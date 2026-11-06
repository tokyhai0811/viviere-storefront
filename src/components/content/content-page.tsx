import { notFound } from "next/navigation"
import { getPage } from "@/lib/data/pages"
import { renderRichText } from "@/lib/rich-text"
import { ContactForm } from "@/components/content/contact-form"

/** templates/page.json: centred narrow column, title then rich text. */
export async function ContentPage({ handle }: { handle: string }) {
  const page = await getPage(handle)
  if (!page) notFound()

  // HTML from the admin's editor (or older Markdown), sanitized.
  const html = await renderRichText(page.body)

  return (
    <section className="mx-auto w-full max-w-[672px] px-4 pt-10 pb-8 md:px-0">
      <h1 className="type-h2 mb-[33px] text-center">{page.title}</h1>
      <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
      {/* viviere.vn's Contact & Complaints page ends with a contact form. */}
      {handle === "contact" && <ContactForm />}
    </section>
  )
}

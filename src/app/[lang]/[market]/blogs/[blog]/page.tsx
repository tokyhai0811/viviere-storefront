import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Link } from "@/components/link"
import { ArticleImage } from "@/components/blog/article-image"
import { BLOGS, listArticles } from "@/lib/data/articles"
import { getDictionary, getLang } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"

const BLOG_TITLE = "Blogs"

export function generateStaticParams() {
  return BLOGS.map((blog) => ({ blog }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[market]/blogs/[blog]">): Promise<Metadata> {
  const [{ blog }, lang] = await Promise.all([params, getLang()])
  return pageMetadata({ path: `/blogs/${blog}`, lang, title: BLOG_TITLE })
}

/** templates/blog.json (Horizon main-blog): title, a wide lead article beside its text, then two columns. */
export default async function BlogPage({ params }: PageProps<"/[lang]/[market]/blogs/[blog]">) {
  const { blog } = await params
  if (!BLOGS.includes(blog)) notFound()
  const [articles, t] = await Promise.all([listArticles(blog), getDictionary()])

  return (
    <section className="page-width pt-12 pb-12">
      <h1 className="type-h2 mb-[49px]">{BLOG_TITLE}</h1>
      {articles.length === 0 && <p className="text-center text-muted">{t.blog.empty}</p>}
      <ul className="grid gap-9 md:grid-cols-2">
        {articles.map((a, i) => (
          <li key={a.id} className={i === 0 ? "md:col-span-2" : undefined}>
            <Link href={`/blogs/${blog}/${a.handle}`} className={`group block ${i === 0 ? "md:flex md:gap-9" : ""}`}>
              <ArticleImage
                src={a.image_url}
                alt={a.title}
                className={`aspect-[3/2] w-full md:aspect-auto ${i === 0 ? "md:h-[400px] md:w-[70%] md:shrink-0" : "md:h-[320px]"}`}
              />
              <div className="mt-[18px] md:flex-1">
                <h2 className="font-heading text-[1.125rem] leading-[1.4] not-italic group-hover:opacity-70">{a.title}</h2>
                {a.excerpt && <p className="mt-4 line-clamp-3">{a.excerpt}</p>}
                <span className="link-underline mt-3 inline-block text-muted">{t.blog.readMore}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

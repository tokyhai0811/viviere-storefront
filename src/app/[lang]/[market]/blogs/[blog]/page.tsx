import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Link } from "@/components/link"
import { ArticleImage, formatArticleDate } from "@/components/blog/article-image"
import { BLOGS, listArticles } from "@/lib/data/articles"
import { LANG_LOCALE } from "@/lib/i18n/config"
import { getDictionary, getLang } from "@/lib/i18n/server"

const BLOG_TITLE = "Blogs"

export function generateStaticParams() {
  return BLOGS.map((blog) => ({ blog }))
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: BLOG_TITLE }
}

/** templates/blog.json (Horizon main-blog): title, then a grid of article cards. */
export default async function BlogPage({ params }: PageProps<"/[lang]/[market]/blogs/[blog]">) {
  const { blog } = await params
  if (!BLOGS.includes(blog)) notFound()
  const [articles, t, lang] = await Promise.all([listArticles(blog), getDictionary(), getLang()])

  return (
    <section className="page-width py-12 md:py-16">
      <h1 className="type-h2 mb-10 text-center">{BLOG_TITLE}</h1>
      {articles.length === 0 && <p className="text-center text-muted">{t.blog.empty}</p>}
      <ul className="grid gap-x-5 gap-y-12 md:grid-cols-2">
        {articles.map((a) => (
          <li key={a.id}>
            <Link href={`/blogs/${blog}/${a.handle}`} className="group block">
              <ArticleImage src={a.image_url} alt={a.title} className="aspect-[3/2] w-full" />
              <p className="mt-4 text-[0.75rem] uppercase text-muted">
                {formatArticleDate(a.published_at, LANG_LOCALE[lang])}
              </p>
              <h2 className="mt-1 font-body text-[1.125rem] leading-snug group-hover:opacity-70">{a.title}</h2>
              {a.excerpt && <p className="mt-2 line-clamp-3 text-[0.875rem] leading-relaxed">{a.excerpt}</p>}
              <span className="link-underline mt-3 inline-block text-[0.75rem] uppercase">{t.blog.readMore}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

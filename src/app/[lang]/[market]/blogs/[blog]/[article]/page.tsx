import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Link } from "@/components/link"
import { ArticleImage, formatArticleDate } from "@/components/blog/article-image"
import { BLOGS, getArticle, listArticles } from "@/lib/data/articles"
import { renderRichText } from "@/lib/rich-text"
import { LANG_LOCALE } from "@/lib/i18n/config"
import { getDictionary, getLang } from "@/lib/i18n/server"

// Both segments are listed here: Next needs every param of the leaf route.
export async function generateStaticParams() {
  const lists = await Promise.all(BLOGS.map(async (blog) => ({ blog, articles: await listArticles(blog) })))
  return lists.flatMap(({ blog, articles }) => articles.map((a) => ({ blog, article: a.handle })))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[market]/blogs/[blog]/[article]">): Promise<Metadata> {
  const { blog, article: handle } = await params
  const [article, t] = await Promise.all([getArticle(blog, handle), getDictionary()])
  return { title: article?.title ?? t.meta.blog, description: article?.excerpt || undefined }
}

/** templates/article.json: title, date, cover image, then the rich text body. */
export default async function ArticlePage({ params }: PageProps<"/[lang]/[market]/blogs/[blog]/[article]">) {
  const { blog, article: handle } = await params
  const article = await getArticle(blog, handle)
  if (!article) notFound()

  const [t, lang, html] = await Promise.all([getDictionary(), getLang(), renderRichText(article.body ?? "")])
  const date = formatArticleDate(article.published_at, LANG_LOCALE[lang])

  return (
    <article className="page-width max-w-[760px] py-12 md:py-16">
      <header className="mb-8 text-center">
        {date && <p className="text-[0.75rem] uppercase text-muted">{date}</p>}
        <h1 className="type-h2 mt-2">{article.title}</h1>
        {article.author && <p className="mt-2 text-muted">{article.author}</p>}
      </header>
      {article.image_url && <ArticleImage src={article.image_url} alt={article.title} className="mb-10 aspect-[3/2] w-full" />}
      <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
      <p className="mt-12 text-center">
        <Link href={`/blogs/${blog}`} className="link-underline text-[0.75rem] uppercase">
          ← {t.blog.back}
        </Link>
      </p>
    </article>
  )
}

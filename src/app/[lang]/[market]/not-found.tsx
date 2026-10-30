"use client"

import { Link } from "@/components/link"
import { useI18n } from "@/lib/i18n/client"

export default function NotFound() {
  const { t } = useI18n()
  return (
    <section className="page-width flex flex-col items-center gap-6 py-32 text-center">
      <h1 className="type-h1">{t.notFound.title}</h1>
      <p>{t.notFound.body}</p>
      <Link href="/collections/all" className="btn-primary">{t.notFound.continueShopping}</Link>
    </section>
  )
}

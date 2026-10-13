import Link from "next/link"

export default function NotFound() {
  return (
    <section className="page-width flex flex-col items-center gap-6 py-32 text-center">
      <h1 className="type-h1">Page not found</h1>
      <p>This page is not part of the frontend prototype yet.</p>
      <Link href="/collections/all" className="btn-primary">Continue shopping</Link>
    </section>
  )
}

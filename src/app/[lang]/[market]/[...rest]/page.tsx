import { notFound } from "next/navigation"

/** Any URL no route matches gets the localized not-found page inside the layout. */
export default function CatchAll() {
  notFound()
}

"use client"

import NextLink from "next/link"
import type { ComponentProps } from "react"
import { useI18n } from "@/lib/i18n/client"

/** next/link that keeps the visitor's language: "/cart" becomes "/vi/cart" on Vietnamese pages. */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { href: localize } = useI18n()
  return <NextLink href={typeof href === "string" ? localize(href) : href} {...props} />
}

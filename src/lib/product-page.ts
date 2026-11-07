/**
 * Admin Theme › Product page, stored as JSON in store.metadata.theme_product
 * (see the backend's src/admin/components/product-page-editor.tsx). Empty
 * text falls back to the dictionary copy.
 */
export type CraftedContent = {
  hidden: boolean
  heading?: string
  columns: { image?: string; text?: string }[]
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined)

export function parseProductPage(raw: string | null | undefined, lang: string): CraftedContent {
  let v: Record<string, unknown> = {}
  try {
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === "object") v = parsed
  } catch {
    // Invalid JSON: use the defaults.
  }
  // Vietnamese uses the _vi field, else the English one.
  const pick = (o: Record<string, unknown>, key: string) => (lang === "vi" ? str(o[`${key}_vi`]) : undefined) ?? str(o[key])
  const columns = Array.isArray(v.crafted_columns) ? (v.crafted_columns as Record<string, unknown>[]) : []
  return {
    hidden: v.crafted_hidden === true,
    heading: pick(v, "crafted_heading"),
    columns: [0, 1, 2].map((i) => {
      const c = columns[i] && typeof columns[i] === "object" ? columns[i] : {}
      return { image: str(c.image), text: pick(c, "text") }
    }),
  }
}

/**
 * Theme typography, edited in the admin under Theme › Typography (Shopify
 * Horizon's "Typography" settings) and stored as JSON in the store's
 * `theme_typography` metadata. The layout turns it into CSS variables that
 * globals.css reads, so changing a font or size needs no redeploy.
 *
 * Everything is validated here: values come from the database and end up in
 * a <style> tag, so only known fonts and clamped numbers get through.
 */

/**
 * Fonts that support Vietnamese, with the weights each one has. The first
 * three ship with the site (Fontsource, imported in the layout); the rest
 * load from Google Fonts only when chosen.
 */
export const FONTS: Record<string, { fallback: "serif" | "sans-serif"; weights: number[]; bundled?: boolean }> = {
  "Playfair Display": { fallback: "serif", weights: [400, 500, 600, 700], bundled: true },
  "IBM Plex Sans": { fallback: "sans-serif", weights: [300, 400, 500, 600], bundled: true },
  Montserrat: { fallback: "sans-serif", weights: [300, 400, 500, 600], bundled: true },
  "Cormorant Garamond": { fallback: "serif", weights: [300, 400, 500, 600, 700] },
  "EB Garamond": { fallback: "serif", weights: [400, 500, 600, 700] },
  Lora: { fallback: "serif", weights: [400, 500, 600, 700] },
  "Noto Serif": { fallback: "serif", weights: [300, 400, 500, 600, 700] },
  Inter: { fallback: "sans-serif", weights: [300, 400, 500, 600, 700] },
  "Be Vietnam Pro": { fallback: "sans-serif", weights: [300, 400, 500, 600, 700] },
  Roboto: { fallback: "sans-serif", weights: [300, 400, 500, 600, 700] },
  "Open Sans": { fallback: "sans-serif", weights: [300, 400, 500, 600, 700] },
  "Josefin Sans": { fallback: "sans-serif", weights: [300, 400, 500, 600, 700] },
  Raleway: { fallback: "sans-serif", weights: [300, 400, 500, 600, 700] },
}

/** The available weight closest to `w`. */
const nearestWeight = (family: string, w: number) =>
  FONTS[family].weights.reduce((best, x) => (Math.abs(x - w) < Math.abs(best - w) ? x : best))

const ROLES = ["heading", "body", "accent"] as const
const LEVELS = ["h1", "h2", "h3", "h4", "h5"] as const

export type FontRole = (typeof ROLES)[number]
export type FontSetting = { family: string; weight: number }
export type HeadingSetting = { font: FontRole; size: number; uppercase: boolean; letter_spacing: number }
export type Typography = {
  fonts: Record<FontRole, FontSetting>
  /** Paragraph size in px. */
  body_size: number
  body_line_height: number
  headings: Record<(typeof LEVELS)[number], HeadingSetting>
}

/** viviere.vn as rendered: Playfair 400 / IBM Plex Sans 400 / Montserrat 300, 12px text on a 1.6 line height. */
export const DEFAULT_TYPOGRAPHY: Typography = {
  fonts: {
    heading: { family: "Playfair Display", weight: 400 },
    body: { family: "IBM Plex Sans", weight: 400 },
    accent: { family: "Montserrat", weight: 300 },
  },
  body_size: 12,
  body_line_height: 1.6,
  headings: {
    h1: { font: "heading", size: 32, uppercase: false, letter_spacing: 0 },
    h2: { font: "heading", size: 24, uppercase: false, letter_spacing: 0 },
    h3: { font: "heading", size: 20, uppercase: false, letter_spacing: 0 },
    h4: { font: "heading", size: 18, uppercase: false, letter_spacing: 0 },
    h5: { font: "body", size: 12, uppercase: true, letter_spacing: 0 },
  },
}

const num = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback

/** Parses the stored JSON (string or object), keeping defaults for anything missing or invalid. */
export function parseTypography(raw: unknown): Typography {
  let value: Record<string, unknown> = {}
  try {
    value = (typeof raw === "string" ? JSON.parse(raw) : raw) ?? {}
  } catch {
    return DEFAULT_TYPOGRAPHY
  }
  if (typeof value !== "object") return DEFAULT_TYPOGRAPHY
  const d = DEFAULT_TYPOGRAPHY
  const fonts = (value.fonts ?? {}) as Record<string, Partial<FontSetting>>
  const headings = (value.headings ?? {}) as Record<string, Partial<HeadingSetting>>
  return {
    fonts: Object.fromEntries(
      ROLES.map((role) => {
        const f = fonts[role] ?? {}
        const family = typeof f.family === "string" && f.family in FONTS ? f.family : d.fonts[role].family
        const weight = nearestWeight(family, typeof f.weight === "number" ? f.weight : d.fonts[role].weight)
        return [role, { family, weight }]
      })
    ) as Typography["fonts"],
    body_size: num(value.body_size, 10, 24, d.body_size),
    body_line_height: num(value.body_line_height, 1, 2.5, d.body_line_height),
    headings: Object.fromEntries(
      LEVELS.map((level) => {
        const h = headings[level] ?? {}
        const def = d.headings[level]
        return [
          level,
          {
            font: ROLES.includes(h.font as FontRole) ? (h.font as FontRole) : def.font,
            size: num(h.size, 10, 96, def.size),
            uppercase: typeof h.uppercase === "boolean" ? h.uppercase : def.uppercase,
            letter_spacing: num(h.letter_spacing, -0.1, 0.5, def.letter_spacing),
          },
        ]
      })
    ) as Typography["headings"],
  }
}

const stack = (family: string) => `"${family}", ${FONTS[family]?.fallback ?? "sans-serif"}`
const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`

/** The CSS variables globals.css reads. */
export function typographyCss(t: Typography): string {
  const vars: string[] = []
  for (const role of ROLES) {
    vars.push(`--font-${role}: ${stack(t.fonts[role].family)};`, `--font-${role}-weight: ${t.fonts[role].weight};`)
  }
  vars.push(`--text-body: ${rem(t.body_size)};`, `--text-body--line-height: ${t.body_line_height};`)
  for (const level of LEVELS) {
    const h = t.headings[level]
    vars.push(
      `--type-${level}-font: var(--font-${h.font});`,
      `--type-${level}-weight: var(--font-${h.font}-weight);`,
      `--type-${level}-size: ${rem(h.size)};`,
      `--type-${level}-case: ${h.uppercase ? "uppercase" : "none"};`,
      `--type-${level}-tracking: ${h.letter_spacing}em;`
    )
  }
  // Doubled to win over the defaults in globals.css whatever the load order.
  return `:root:root{${vars.join("")}}`
}

/** Google Fonts stylesheet for chosen fonts that aren't bundled, or null when all are. */
export function googleFontsHref(t: Typography): string | null {
  const families = [...new Set(ROLES.map((r) => t.fonts[r].family))].filter((f) => !FONTS[f]?.bundled)
  if (!families.length) return null
  const params = families.map((f) => {
    // The chosen weights plus regular and semibold, which bold text and labels use.
    const wanted = ROLES.filter((r) => t.fonts[r].family === f).map((r) => t.fonts[r].weight).concat([400, 600])
    const weights = [...new Set(wanted.map((w) => nearestWeight(f, w)))].sort((a, b) => a - b)
    // Italic too: headings use it (e.g. "Contact us" in the footer).
    const axes = [0, 1].flatMap((i) => weights.map((w) => `${i},${w}`)).join(";")
    return `family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@${axes}`
  })
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`
}

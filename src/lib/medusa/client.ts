import Medusa from "@medusajs/js-sdk"

/**
 * Medusa is used only when both env vars are set. Without them the storefront
 * runs on the mock catalogue in src/lib/data/mock.ts and a localStorage cart.
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const medusaEnabled = Boolean(BACKEND_URL && PUBLISHABLE_KEY)

export const sdk = new Medusa({
  baseUrl: BACKEND_URL ?? "http://localhost:9000",
  publishableKey: PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
})

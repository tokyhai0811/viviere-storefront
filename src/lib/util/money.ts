/** Mirrors `convertToLocale` from the Medusa Next.js starter. */
export function convertToLocale({
  amount,
  currency_code,
  locale = "vi-VN",
}: {
  amount: number
  currency_code: string
  locale?: string
}) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount)
}

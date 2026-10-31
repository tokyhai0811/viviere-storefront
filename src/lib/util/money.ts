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
  // viviere.vn writes đồng the Vietnamese way (1.836.000 ₫) in both languages.
  if (currency_code.toLowerCase() === "vnd") locale = "vi-VN"
  // Whole amounts show without decimals ($95, 2.490.000 ₫); cents only when present.
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

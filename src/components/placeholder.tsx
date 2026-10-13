/**
 * Blank stand-in for every image on the site. Swap for `next/image` once real
 * media comes from Medusa (product.images[].url / thumbnail).
 */
export function Placeholder({
  label,
  className = "",
  tone = "light",
}: {
  label: string
  className?: string
  tone?: "light" | "dark"
}) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={`${tone === "dark" ? "bg-[#cfcfcf]" : "bg-placeholder"} ${className}`}
    />
  )
}

import { Link } from "@/components/link"
import type { StoreProduct } from "@/lib/types"
import { convertToLocale } from "@/lib/util/money"
import { ProductImage, productThumbnail } from "@/components/product-image"
import { QuickAdd } from "@/components/product/quick-add"
import type { Dictionary } from "@/lib/i18n/dictionaries"

export function productPrice(product: StoreProduct, locale?: string) {
  const price = product.variants[0]?.calculated_price
  if (!price) return null
  return convertToLocale({ amount: price.calculated_amount, currency_code: price.currency_code, locale })
}

/** True when every variant tracks stock and none is left. */
export function isSoldOut(product: StoreProduct) {
  return (
    product.variants.length > 0 &&
    product.variants.every((v) => v.manage_inventory && v.inventory_quantity <= 0)
  )
}

/**
 * Product card from templates/collection.json: portrait image, then title and
 * price in one row (stacked and centred on mobile), uppercase 12px. Like
 * viviere.vn, the card lifts on hover and a "Sold out" badge or a round
 * add-to-cart button (desktop hover only) sits on the image.
 */
export function ProductCard({ product, locale, t }: { product: StoreProduct; locale?: string; t: Dictionary }) {
  const soldOut = isSoldOut(product)
  return (
    <Link href={`/products/${product.handle}`} className="group block transition-transform duration-300 hover:-translate-y-[3px]">
      <div className="group/media relative overflow-hidden">
        <ProductImage
          src={productThumbnail(product)}
          alt={product.title}
          sizes="(min-width: 768px) 33vw, 50vw"
          className="aspect-[4/5] w-full"
        />
        {soldOut ? (
          <span className="absolute left-2 top-2 bg-black px-2.5 py-1 text-[13px] font-light uppercase text-white">
            {t.product.soldOut}
          </span>
        ) : (
          <QuickAdd product={product} />
        )}
      </div>
      <div className="mt-3 flex flex-col items-center px-2 pb-[21px] text-center font-light leading-[1.2] uppercase md:flex-row md:items-start md:justify-between md:px-0 md:pb-0 md:text-left">
        <h3 className="font-body text-[0.75rem] leading-[1.2] font-light not-italic">{product.title}</h3>
        <p className="whitespace-nowrap">{productPrice(product, locale)}</p>
      </div>
    </Link>
  )
}

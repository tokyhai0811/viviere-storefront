import type { Metadata } from "next"
import Link from "next/link"
import { listProducts } from "@/lib/data/products"
import { CartContents } from "@/components/cart/cart-contents"
import { ProductCard } from "@/components/product/product-card"

export const metadata: Metadata = { title: "Cart" }

/** templates/cart.json: main cart, then "You may also like" (4 products), then a divider. */
export default async function CartPage() {
  const { products } = await listProducts({ limit: 4 })

  return (
    <>
      <CartContents />

      <section className="page-width py-12">
        <div className="mb-7 flex items-end justify-between">
          <h3 className="font-body text-[1.125rem] font-light">You may also like</h3>
          <Link href="/collections/all" className="link-underline uppercase">View all</Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-[26px] gap-y-9 md:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      <div className="page-width pt-[84px] pb-4">
        <hr className="border-border" />
      </div>
    </>
  )
}

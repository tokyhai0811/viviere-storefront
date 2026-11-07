import Image from "next/image"
import type { Metadata } from "next"
import { Link } from "@/components/link"
import { notFound } from "next/navigation"
import { getProductByHandle, listColorSiblings, listProducts, metaText } from "@/lib/data/products"
import { LANG_LOCALE, localizePath, type Lang } from "@/lib/i18n/config"
import { getDictionary, getLang, getMarket } from "@/lib/i18n/server"
import { isSoldOut, productPrice } from "@/components/product/product-card"
import { productThumbnail } from "@/components/product-image"
import { JsonLd } from "@/components/json-ld"
import { SITE_NAME, SITE_URL, excerpt, getSiteSettings, pageMetadata, pickSeo } from "@/lib/seo"
import type { StoreProduct } from "@/lib/types"
import { MediaGallery } from "@/components/product/media-gallery"
import { AddToCart } from "@/components/product/add-to-cart"
import { Accordion } from "@/components/product/accordion"
import { CraftedSection } from "@/components/product/crafted-section"
import { parseProductPage } from "@/lib/product-page"

/**
 * templates/product.json: equal columns, media left (full bleed), sticky
 * details right. Title and price in Montserrat, colour swatches linking
 * sibling products, description, add to cart, accordion of metafields.
 */

export async function generateStaticParams() {
  const { products } = await listProducts()
  return products.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[market]/products/[handle]">): Promise<Metadata> {
  const { handle } = await params
  const [product, t, lang] = await Promise.all([getProductByHandle(handle), getDictionary(), getLang()])
  if (!product) return { title: t.meta.product }
  const seo = pickSeo(product.metadata, lang)
  const price = product.variants[0]?.calculated_price
  return pageMetadata({
    path: `/products/${handle}`,
    lang,
    title: product.title,
    seoTitle: seo.title,
    description: seo.description ?? excerpt(product.description),
    image: productThumbnail(product),
    // Shopify's og:price tags, read by Facebook and Zalo link previews.
    extra: price
      ? {
          other: {
            "product:price:amount": String(price.calculated_amount),
            "product:price:currency": price.currency_code.toUpperCase(),
          },
        }
      : undefined,
  })
}

/** schema.org Product, so Google can show price and stock in results. */
function productJsonLd(product: StoreProduct, lang: Lang) {
  const price = product.variants[0]?.calculated_price
  const url = new URL(localizePath(lang, `/products/${product.handle}`), SITE_URL).href
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.images.map((i) => i.url).filter(Boolean),
    sku: product.variants[0]?.sku ?? undefined,
    color: product.metadata?.color,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: price.calculated_amount,
            priceCurrency: price.currency_code.toUpperCase(),
            availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }
      : {}),
  }
}

export default async function ProductPage({ params }: PageProps<"/[lang]/[market]/products/[handle]">) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()

  const [siblings, t, lang, market, settings] = await Promise.all([
    listColorSiblings(product),
    getDictionary(),
    getLang(),
    getMarket(),
    getSiteSettings(),
  ])
  const meta = (key: Parameters<typeof metaText>[1]) => metaText(product, key, lang)

  return (
    <>
      <JsonLd data={productJsonLd(product, lang)} />
      <section className="grid md:grid-cols-2 md:pt-20">
        <div className="pt-14 md:pt-0">
          <MediaGallery images={product.images} title={product.title} />
        </div>

        <div className="flex justify-center px-4 md:pr-4 md:pl-0">
          <div className="flex w-full flex-col gap-3 pt-5 pb-10 md:sticky md:top-[84px] md:mt-[71px] md:max-w-[400px] md:self-start">
            <div className="flex items-start justify-between gap-3">
              <h1 className="w-[65%] font-accent text-[0.875rem] leading-[1.4] font-semibold not-italic">{product.title}</h1>
              <p className="w-[30%] text-right font-accent text-[0.875rem] leading-[1.4] font-light">{productPrice(product, LANG_LOCALE[lang])}</p>
            </div>
            {/* viviere.vn: "Price includes VAT. Free shipping within Vietnam." */}
            <p className="text-right text-[0.75rem] text-black/55">
              {t.product.taxIncluded}
              {market === "vn" && ` ${t.product.freeShippingVn}`}
            </p>
            <hr className="border-border" />

            {siblings.length > 0 && (
              <div className="mt-2">
                <span className="mb-1.5 block text-[14px]">{t.product.color}</span>
                <div className="flex gap-3">
                  {siblings.map((s) => {
                    const active = s.id === product.id
                    return (
                      <Link
                        key={s.id}
                        href={`/products/${s.handle}`}
                        title={s.metadata?.color}
                        aria-label={s.metadata?.color}
                        aria-current={active ? "page" : undefined}
                        className="relative inline-block h-6 w-10 hover:opacity-85"
                        style={{ backgroundColor: s.metadata?.swatch_hex ?? "#ccc" }}
                      >
                        {/* Swatch image (a colour or a texture) from the admin; else the hex colour. */}
                        {s.metadata?.swatch_image && (
                          <Image src={s.metadata.swatch_image} alt="" fill sizes="40px" className="object-cover" />
                        )}
                        {active && <span className="absolute inset-x-0 -bottom-1.5 h-px bg-black" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="py-5 text-[0.75rem] tracking-[-0.5px]">{product.description}</p>

            <div className="pb-6">
              <AddToCart product={product} />
            </div>

            <Accordion
              rows={[
                { heading: t.product.size, content: meta("size") },
                { heading: t.product.material, content: meta("material_and_care") },
                { heading: t.product.origin, content: meta("origin") },
                { heading: t.product.shippingReturns, content: meta("shipping_returns") },
              ]}
            />
          </div>
        </div>
      </section>

      <CraftedSection t={t} content={parseProductPage(settings.theme_product, lang)} />
    </>
  )
}

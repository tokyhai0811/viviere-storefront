import { Hero } from "@/components/home/hero"
import { SilhouetteRow } from "@/components/home/silhouette-row"
import { ColorGallery } from "@/components/home/color-gallery"
import { ComparisonSlider } from "@/components/home/comparison-slider"
import { productThumbnail } from "@/components/product-image"
import { colorLabel, listProducts } from "@/lib/data/products"
import type { Metadata } from "next"
import { getDictionary, getLang } from "@/lib/i18n/server"
import { localizePath } from "@/lib/i18n/config"
import { JsonLd } from "@/components/json-ld"
import { SITE_NAME, SITE_URL, getSiteSettings, pageMetadata, pickSeo } from "@/lib/seo"
import type { StoreProduct } from "@/lib/types"
import { parseHomeContent } from "@/lib/home"

const side = (p: StoreProduct) => ({
  label: colorLabel(p).toUpperCase(),
  href: `/products/${p.handle}`,
  image: productThumbnail(p),
})

// viviere.vn picks these by hand: four colours in the gallery, the two
// summer colours in the comparison slider.
const GALLERY_COLORS = ["Burgundy", "Brown", "Teal", "Black"]
const SUMMER_COLORS = ["Blue", "Yellow"]

/** Products in the given colours (English metadata colour), in that order. */
const byColor = (products: StoreProduct[], colors: string[]) =>
  colors.flatMap((c) => products.filter((p) => p.metadata?.color === c))

/**
 * The products picked in the admin, slot by slot; an empty slot (or a product
 * since deleted) takes the default colour for that slot.
 */
const pickSlots = (products: StoreProduct[], ids: string[], defaults: StoreProduct[], count: number) => {
  const picked = Array.from({ length: count }, (_, i) => products.find((p) => p.id === ids[i]) ?? defaults[i])
  return picked.filter((p): p is StoreProduct => !!p)
}

export async function generateMetadata(): Promise<Metadata> {
  const [lang, settings, t] = await Promise.all([getLang(), getSiteSettings(), getDictionary()])
  const seo = pickSeo(settings, lang)
  return pageMetadata({ path: "/", lang, seoTitle: seo.title ?? SITE_NAME, description: seo.description ?? t.meta.description })
}

// The brand, for Google's knowledge panel and sitelinks.
const organization = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "NGUYEN HUYNH LAN PHUONG COMPANY LIMITED",
  url: new URL(lang === "en" ? "/" : `/${lang}`, SITE_URL).href,
  email: "hello@viviere.vn",
  telephone: "+84352122093",
  taxID: "0317420229",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 13, Street 16, Ven Song Residential Area, Tan Hung Ward",
    addressLocality: "Ho Chi Minh City",
    addressCountry: "VN",
  },
  sameAs: [
    "https://www.facebook.com/viviere.official",
    "https://www.instagram.com/viviere.official",
    "https://www.tiktok.com/@viviere.official",
  ],
})

/** Home page, following the enabled sections of templates/index.json in order. */
export default async function HomePage() {
  const [{ products }, t, lang, settings] = await Promise.all([listProducts(), getDictionary(), getLang(), getSiteSettings()])
  const home = parseHomeContent(settings.theme_home, lang)
  // Catalogues without the default colours fall back to catalogue order.
  const defaultGallery = byColor(products, GALLERY_COLORS)
  const defaultSummer = byColor(products, SUMMER_COLORS)
  const gallery = pickSlots(products, home.galleryProducts, defaultGallery.length ? defaultGallery : products, 4)
  const [before, after] = pickSlots(products, home.summerProducts, defaultSummer.length === 2 ? defaultSummer : products.slice(-2), 2)

  return (
    <>
      <JsonLd data={organization(lang)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: new URL(localizePath(lang, "/"), SITE_URL).href,
          inLanguage: lang,
          potentialAction: {
            "@type": "SearchAction",
            target: `${new URL(localizePath(lang, "/search"), SITE_URL).href}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Hero
        title={home.heroTitle ?? "The Bateau"}
        linkLabel={home.heroLinkLabel ?? t.home.explore}
        link={home.heroLink ?? "/collections/all"}
        image={settings.home_hero_image}
        mobileImage={settings.home_hero_image_mobile}
      />
      <SilhouetteRow lines={home.silhouette ?? t.home.silhouette} image={settings.home_silhouette_image} />
      <ColorGallery products={gallery} image={settings.home_lifestyle_image} />
      {before && after && (
        <section className="page-width pt-8 pb-4 md:py-10">
          <h2 className="type-h2 mb-5 text-center">{home.summerTitle ?? t.home.summerColors}</h2>
          <ComparisonSlider before={side(before)} after={side(after)} />
        </section>
      )}
    </>
  )
}

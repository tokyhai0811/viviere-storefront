import { Link } from "@/components/link"
import { getDictionary } from "@/lib/i18n/server"

/** Footer from sections/footer-group.json (color scheme 5: black background). */

const social = [
  { title: "Facebook", href: "https://www.facebook.com/viviere.official" },
  { title: "Instagram", href: "https://www.instagram.com/viviere.official" },
  { title: "TikTok", href: "https://www.tiktok.com/@viviere.official" },
]

export async function Footer() {
  const t = await getDictionary()
  // footer-menu-2 lives in Shopify admin; these are typical Support links.
  const supportMenu = [
    { title: t.footer.shippingPolicy, href: "/policies/shipping-policy" },
    { title: t.footer.refundPolicy, href: "/policies/refund-policy" },
    { title: t.footer.privacyPolicy, href: "/policies/privacy-policy" },
    { title: t.footer.termsOfService, href: "/policies/terms-of-service" },
    { title: t.footer.contact, href: "/pages/contact" },
  ]

  return (
    <footer className="mt-auto bg-black text-white">
      <div className="page-width grid gap-12 py-14 text-center md:grid-cols-3 md:py-16">
        <div className="space-y-2">
          <h3 className="type-h3 italic">{t.footer.contactUs}</h3>
          <p>
            {t.footer.email}:{" "}
            <a href="mailto:hello@viviere.vn" className="link-underline">
              hello@viviere.vn
            </a>
          </p>
          <h3 className="type-h3 pt-8 italic">{t.footer.company}</h3>
          <p>
            <Link href="/pages/about-us" className="hover:opacity-60">{t.nav.aboutUs}</Link>
          </p>
          <p>
            <Link href="/blogs/blogs" className="hover:opacity-60">{t.nav.blogs}</Link>
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="type-h3">{t.footer.support}</h3>
          <ul className="space-y-2">
            {supportMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:opacity-60">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="type-h3">{t.footer.followUs}</h3>
          <ul className="space-y-2">
            {social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:opacity-60">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="page-width border-t border-[#666666] py-5 text-center text-[0.75rem] uppercase">
        © 2026 VIVIÈRE
      </div>
    </footer>
  )
}

import { Link } from "@/components/link"
import { getDictionary } from "@/lib/i18n/server"

/**
 * Footer from sections/footer-group.json (color scheme 5: black background),
 * with the menus, contact details and company details of viviere.vn.
 */

const social = [
  { title: "Facebook", href: "https://www.facebook.com/viviere.official" },
  { title: "Instagram", href: "https://www.instagram.com/viviere.official" },
  { title: "TikTok", href: "https://www.tiktok.com/@viviere.official" },
]

export async function Footer() {
  const t = await getDictionary()
  // viviere.vn's footer-menu-2 ("Support"), in its order.
  const supportMenu = [
    { title: t.footer.refundPolicy, href: "/policies/refund-policy" },
    { title: t.footer.shippingPolicy, href: "/policies/shipping-policy" },
    { title: t.footer.paymentPolicy, href: "/pages/payment-policy" },
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
          <p>
            {t.footer.phone}:{" "}
            <a href="tel:+84352122093" className="link-underline">
              {t.footer.phoneNumber}
            </a>{" "}
            ({t.footer.hours})
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

      <div className="page-width border-t border-[#666666] py-6 text-center text-[0.75rem] leading-relaxed text-white/80">
        {t.footer.legal.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="mt-4 uppercase text-white">© 2026 VIVIÈRE</p>
      </div>
    </footer>
  )
}

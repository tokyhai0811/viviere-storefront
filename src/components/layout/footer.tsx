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

const COMPANY_NAME = /NGUYEN HUYNH LAN PHUONG COMPANY LIMITED|CÔNG TY TNHH NGUYỄN HUỲNH LAN PHƯƠNG/

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
      <div className="page-width py-10">
        <div className="grid gap-14 text-center md:grid-cols-3 md:gap-20">
          <div className="flex flex-col gap-3">
            <h3 className="type-h3">{t.footer.contactUs}</h3>
            <p className="mx-auto max-w-[360px] tracking-[-0.5px]">
              {t.footer.email}:{" "}
              <a href="mailto:hello@viviere.vn" className="hover:opacity-60">
                hello@viviere.vn
              </a>
            </p>
            <p className="mx-auto max-w-[360px] tracking-[-0.5px]">
              {t.footer.phone}:{" "}
              <a href="tel:+84352122093" className="hover:opacity-60">
                {t.footer.phoneNumber}
              </a>
              <br />
              ({t.footer.hours})
            </p>
            <h3 className="type-h3 pt-3">{t.footer.company}</h3>
            <p className="tracking-[-0.5px]">
              <Link href="/pages/about-us" className="hover:opacity-60">{t.nav.aboutUs}</Link>
            </p>
            <p className="tracking-[-0.5px]">
              <Link href="/blogs/blogs" className="hover:opacity-60">{t.nav.blogs}</Link>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="type-h3">{t.footer.support}</h3>
            <ul className="flex flex-col gap-3">
              {supportMenu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:opacity-60">{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="type-h3">{t.footer.followUs}</h3>
            <ul className="flex flex-col gap-3 tracking-[-0.5px]">
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

        <div className="mt-6 text-center tracking-[-0.5px]">
          {t.footer.legal.map((line) => {
            // The company name is bold, in either language.
            const [before, after] = line.split(COMPANY_NAME)
            const name = line.match(COMPANY_NAME)?.[0]
            return (
              <p key={line}>
                {before}
                {name && <strong className="font-bold">{name}</strong>}
                {after}
              </p>
            )
          })}
        </div>
      </div>

      <div className="page-width">
        <p className="border-t border-[#666666] pt-3 pb-4 uppercase text-white/60">
          © 2026{" "}
          <Link href="/" className="underline underline-offset-[1.5px]">
            VIVIÈRE
          </Link>
        </p>
      </div>
    </footer>
  )
}

import Link from "next/link"

/** Footer from sections/footer-group.json (color scheme 5: black background). */

// footer-menu-2 lives in Shopify admin; these are typical Support links.
const supportMenu = [
  { title: "Shipping Policy", href: "/policies/shipping-policy" },
  { title: "Refund Policy", href: "/policies/refund-policy" },
  { title: "Privacy Policy", href: "/policies/privacy-policy" },
  { title: "Terms of Service", href: "/policies/terms-of-service" },
  { title: "Contact", href: "/pages/contact" },
]

const social = [
  { title: "Facebook", href: "https://www.facebook.com/viviere.official" },
  { title: "Instagram", href: "https://www.instagram.com/viviere.official" },
  { title: "TikTok", href: "https://www.tiktok.com/@viviere.official" },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="page-width grid gap-12 py-14 text-center md:grid-cols-3 md:py-16">
        <div className="space-y-2">
          <h3 className="type-h3 italic">Contact us</h3>
          <p>
            Email:{" "}
            <a href="mailto:hello@viviere.vn" className="link-underline">
              hello@viviere.vn
            </a>
          </p>
          <h3 className="type-h3 pt-8 italic">Company</h3>
          <p>
            <Link href="/pages/about-us" className="hover:opacity-60">About Us</Link>
          </p>
          <p>
            <Link href="/blogs/blogs" className="hover:opacity-60">Blogs</Link>
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="type-h3">Support</h3>
          <ul className="space-y-2">
            {supportMenu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:opacity-60">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="type-h3">Follow us</h3>
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

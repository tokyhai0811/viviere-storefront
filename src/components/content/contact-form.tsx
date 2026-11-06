"use client"

import { useState, type FormEvent } from "react"
import { medusaEnabled, sdk } from "@/lib/medusa/client"
import { useI18n, usePagePath } from "@/lib/i18n/client"

type Status = "idle" | "sending" | "sent" | "failed"

const field = "w-full border border-black/13 bg-white px-5 py-4 text-[0.75rem] leading-[1.6] outline-none placeholder:text-black/60 focus:border-black"

/**
 * viviere.vn's contact form (Name, Email, Phone number, Comment). Messages go
 * to the backend and show up in the admin under "Messages".
 */
export function ContactForm() {
  const { t } = useI18n()
  const page = usePagePath()
  const [status, setStatus] = useState<Status>("idle")

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const value = (key: string) => String(form.get(key) ?? "").trim()
    setStatus("sending")
    try {
      await sdk.client.fetch("/store/contact-messages", {
        method: "POST",
        body: {
          name: value("name"),
          email: value("email"),
          phone: value("phone"),
          body: value("body"),
          page,
          website: value("website"),
        },
      })
      setStatus("sent")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <section className="mt-[45px]">
      <h2 className="type-h2 mb-8 text-center">{t.contactForm.heading}</h2>
      {status === "sent" ? (
        <p role="status" className="text-center">{t.contactForm.sent}</p>
      ) : (
        <form onSubmit={submit} className="grid gap-[15px] md:-mx-[1.5px] md:grid-cols-2">
          <label>
            <span className="sr-only">{t.contactForm.name}</span>
            <input name="name" autoComplete="name" placeholder={t.contactForm.name} className={field} />
          </label>
          <label>
            <span className="sr-only">{t.contactForm.email}</span>
            <input name="email" type="email" required autoComplete="email" placeholder={`${t.contactForm.email} *`} className={field} />
          </label>
          <label className="md:col-span-2">
            <span className="sr-only">{t.contactForm.phone}</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder={t.contactForm.phone} className={field} />
          </label>
          <label className="md:col-span-2">
            <span className="sr-only">{t.contactForm.comment}</span>
            <textarea name="body" required placeholder={`${t.contactForm.comment} *`} className={`${field} block h-[226px]`} />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div className="md:col-span-2">
            <button type="submit" disabled={!medusaEnabled || status === "sending"} className="btn-secondary w-full px-6! md:w-auto disabled:opacity-50">
              {status === "sending" ? t.contactForm.sending : t.contactForm.send}
            </button>
            {status === "failed" && <p role="alert" className="mt-3 text-[0.875rem] text-red-700">{t.contactForm.failed}</p>}
            {!medusaEnabled && <p className="mt-3 text-[0.875rem] text-muted">{t.contactForm.needsBackend}</p>}
          </div>
        </form>
      )}
    </section>
  )
}

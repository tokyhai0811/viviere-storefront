"use client"

import { useState, type FormEvent } from "react"
import { medusaEnabled, sdk } from "@/lib/medusa/client"
import { useI18n, usePagePath } from "@/lib/i18n/client"

type Status = "idle" | "sending" | "sent" | "failed"

const field = "w-full border border-border bg-transparent px-3 py-2.5 text-[0.875rem] outline-none focus:border-black"

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
    <section className="mt-14 border-t border-border pt-10">
      <h2 className="type-h3 mb-6 text-center">{t.contactForm.heading}</h2>
      {status === "sent" ? (
        <p role="status" className="text-center">{t.contactForm.sent}</p>
      ) : (
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.75rem] uppercase">{t.contactForm.name}</span>
            <input name="name" autoComplete="name" className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[0.75rem] uppercase">{t.contactForm.email} *</span>
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-[0.75rem] uppercase">{t.contactForm.phone}</span>
            <input name="phone" type="tel" autoComplete="tel" className={field} />
          </label>
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="text-[0.75rem] uppercase">{t.contactForm.comment} *</span>
            <textarea name="body" required rows={5} className={field} />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div className="md:col-span-2">
            <button type="submit" disabled={!medusaEnabled || status === "sending"} className="btn-primary w-full md:w-auto md:px-12 disabled:opacity-50">
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

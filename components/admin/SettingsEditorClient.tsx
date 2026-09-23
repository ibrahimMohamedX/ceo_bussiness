'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Field,
  LocalizedTextField,
  cls,
} from '@/components/admin/ui'
import type { SiteSettingsRecord } from '@/src/lib/admin/settings'

/**
 * Singleton settings editor for the siteSettings/global document (About page
 * company info: name, contact details, address, social links). Reuses the
 * shared admin form primitives; no CRUD table — a single editable record.
 */
export default function SettingsEditorClient({
  initial,
}: {
  initial: SiteSettingsRecord
}) {
  const router = useRouter()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [companyName, setCompanyName] = useState(initial.companyName ?? '')
  const [contactEmail, setContactEmail] = useState(initial.contactEmail ?? '')
  const [contactPhone, setContactPhone] = useState(initial.contactPhone ?? '')
  const [address, setAddress] = useState({
    en: initial.address?.en ?? '',
    ar: initial.address?.ar ?? '',
  })
  const [socialLinks, setSocialLinks] = useState({
    linkedin: initial.socialLinks?.linkedin ?? '',
    github: initial.socialLinks?.github ?? '',
    instagram: initial.socialLinks?.instagram ?? '',
    facebook: initial.socialLinks?.facebook ?? '',
    x: initial.socialLinks?.x ?? '',
  })

  const handleSave = async () => {
    if (!companyName.trim())
      return setError('Company name is required')
    if (contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim()))
      return setError('Contact email must be a valid email address')

    setError(null)
    setSaved(false)
    setBusy(true)
    try {
      const input = {
        companyName: companyName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        address: {
          en: address.en.trim() || undefined,
          ar: address.ar.trim() || undefined,
        },
        socialLinks: {
          linkedin: socialLinks.linkedin.trim() || undefined,
          github: socialLinks.github.trim() || undefined,
          instagram: socialLinks.instagram.trim() || undefined,
          facebook: socialLinks.facebook.trim() || undefined,
          x: socialLinks.x.trim() || undefined,
        },
      }

      const res = await fetch('/admin/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Save failed')
      }
      setSaved(true)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-[var(--foreground)]">Settings</h1>
        <p className="text-[12px] text-[var(--muted-foreground)]">
          Company info shown on the public About page
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-[13px] text-emerald-400">
          Settings saved.
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Company</legend>
          <Field label="Company name" htmlFor="companyName">
            <input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={cls.input}
              placeholder="NODAL"
            />
          </Field>
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Contact</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact email" htmlFor="contactEmail">
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={cls.input}
                placeholder="hello@nodal.dev"
              />
            </Field>
            <Field label="Contact phone" htmlFor="contactPhone" hint="Optional">
              <input
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={cls.input}
                placeholder="+1 555 000 0000"
              />
            </Field>
          </div>
          <LocalizedTextField
            id="address"
            label="Address"
            en={address.en}
            ar={address.ar}
            dir="ltr"
            onChange={setAddress}
            area
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Social links</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL" htmlFor="linkedin">
              <input
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                className={cls.input}
                placeholder="https://linkedin.com/company/…"
              />
            </Field>
            <Field label="GitHub URL" htmlFor="github">
              <input
                id="github"
                value={socialLinks.github}
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                className={cls.input}
                placeholder="https://github.com/…"
              />
            </Field>
            <Field label="Instagram URL" htmlFor="instagram">
              <input
                id="instagram"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                className={cls.input}
                placeholder="https://instagram.com/…"
              />
            </Field>
            <Field label="Facebook URL" htmlFor="facebook">
              <input
                id="facebook"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                className={cls.input}
                placeholder="https://facebook.com/…"
              />
            </Field>
            <Field label="X (Twitter) URL" htmlFor="x">
              <input
                id="x"
                value={socialLinks.x}
                onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                className={cls.input}
                placeholder="https://x.com/…"
              />
            </Field>
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
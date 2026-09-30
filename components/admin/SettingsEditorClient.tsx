"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, LocalizedTextField, cls } from "@/components/admin/ui";
import {
  BrandLogoField,
  type BrandLogoValue,
} from "@/components/admin/BrandLogoField";
import type { SiteSettingsRecord } from "@/src/lib/admin/settings";

export default function SettingsEditorClient({
  initial,
}: {
  initial: SiteSettingsRecord;
}) {
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [companyName, setCompanyName] = useState(initial.companyName ?? "");
  const [contactEmail, setContactEmail] = useState(initial.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial.contactPhone ?? "");
  const [address, setAddress] = useState({
    en: initial.address?.en ?? "",
    ar: initial.address?.ar ?? "",
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedin: initial.socialLinks?.linkedin ?? "",
    github: initial.socialLinks?.github ?? "",
    instagram: initial.socialLinks?.instagram ?? "",
    facebook: initial.socialLinks?.facebook ?? "",
    x: initial.socialLinks?.x ?? "",
  });
  const [brandName, setBrandName] = useState({
    en: initial.brandName?.en ?? "",
    ar: initial.brandName?.ar ?? "",
  });
  // null means "no logo" — either never set, or explicitly removed by the admin.
  const [brandLogo, setBrandLogo] = useState<BrandLogoValue | null>(
    initial.brandLogoPublicId
      ? {
          publicId: initial.brandLogoPublicId,
          resourceType: initial.brandLogoResourceType ?? "image",
        }
      : null,
  );

  const handleSave = async () => {
    if (!companyName.trim()) {
      return setError("Company name is required");
    }
    if (
      contactEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())
    ) {
      return setError("Contact email must be a valid email address");
    }

    setError(null);
    setSaved(false);
    setBusy(true);
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
      };

      const res = await fetch("/admin/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Save failed");
      }
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Site Settings
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Manage general organization info, contact details, and external social
          media links.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-500">
          Settings updated successfully.
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Company Identity */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Company Identity</h2>
            <p className={cls.cardDescription}>
              Primary brand metadata visible across the website.
            </p>
          </div>
          <Field label="Company / Brand Name" htmlFor="companyName">
            <input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={cls.input}
              placeholder="e.g. NODAL Solutions"
              required
            />
          </Field>
        </div>

        {/* Contact Information */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Contact Details</h2>
            <p className={cls.cardDescription}>
              Public communication channels for client inquiries.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Contact Email" htmlFor="contactEmail">
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={cls.input}
                placeholder="contact@company.com"
              />
            </Field>
            <Field
              label="Contact Phone"
              htmlFor="contactPhone"
              hint="Include country code (e.g. +20...)"
            >
              <input
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={cls.input}
                placeholder="+20 100 000 0000"
              />
            </Field>
          </div>
          <LocalizedTextField
            id="address"
            label="Physical Address"
            en={address.en}
            ar={address.ar}
            onChange={setAddress}
            area
          />
        </div>

        {/* Social Profiles */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Social Profiles</h2>
            <p className={cls.cardDescription}>
              External URLs to company social media pages.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="LinkedIn URL" htmlFor="linkedin">
              <input
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                className={cls.input}
                placeholder="https://linkedin.com/company/..."
              />
            </Field>
            <Field label="GitHub URL" htmlFor="github">
              <input
                id="github"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
                className={cls.input}
                placeholder="https://github.com/..."
              />
            </Field>
            <Field label="Instagram URL" htmlFor="instagram">
              <input
                id="instagram"
                value={socialLinks.instagram}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, instagram: e.target.value })
                }
                className={cls.input}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="Facebook URL" htmlFor="facebook">
              <input
                id="facebook"
                value={socialLinks.facebook}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, facebook: e.target.value })
                }
                className={cls.input}
                placeholder="https://facebook.com/..."
              />
            </Field>
            <Field label="X (Twitter) URL" htmlFor="x">
              <input
                id="x"
                value={socialLinks.x}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, x: e.target.value })
                }
                className={cls.input}
                placeholder="https://x.com/..."
              />
            </Field>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

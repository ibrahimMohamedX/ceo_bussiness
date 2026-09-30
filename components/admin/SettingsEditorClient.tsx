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

  const [brandLogo, setBrandLogo] = useState<BrandLogoValue | null>(
    initial.brandLogoPublicId
      ? {
          publicId: initial.brandLogoPublicId,
          resourceType: initial.brandLogoResourceType ?? "image",
        }
      : null,
  );

  const [projectCtaUrl, setProjectCtaUrl] = useState(
    initial.projectCtaUrl ?? "",
  );

  const [whatsappNumber, setWhatsappNumber] = useState(
    initial.whatsappNumber ?? "",
  );

  const [whatsappMessageAr, setWhatsappMessageAr] = useState(
    initial.whatsappMessageAr ?? "",
  );

  const [whatsappMessageEn, setWhatsappMessageEn] = useState(
    initial.whatsappMessageEn ?? "",
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

    if (
      projectCtaUrl.trim() &&
      !/^https?:\/\/\S+$/i.test(projectCtaUrl.trim())
    ) {
      return setError("Start Your Project URL must be a valid HTTP/HTTPS URL");
    }

    const normalizedWhatsapp = whatsappNumber.replace(/[^\d]/g, "");

    if (!/^\d{8,15}$/.test(normalizedWhatsapp)) {
      return setError("WhatsApp number must contain 8 to 15 digits");
    }

    if (!whatsappMessageAr.trim()) {
      return setError("Arabic WhatsApp message is required");
    }

    if (!whatsappMessageEn.trim()) {
      return setError("English WhatsApp message is required");
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

        brandName: {
          en: brandName.en.trim() || undefined,
          ar: brandName.ar.trim() || undefined,
        },

        brandLogoPublicId: brandLogo?.publicId ?? null,
        brandLogoResourceType: brandLogo?.resourceType ?? null,

        projectCtaUrl: projectCtaUrl.trim(),
        whatsappNumber: normalizedWhatsapp,
        whatsappMessageAr: whatsappMessageAr.trim(),
        whatsappMessageEn: whatsappMessageEn.trim(),
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
      <div className="border-b border-[var(--border)] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Site Settings
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Manage general organization info, contact details, CTA links, and
          external social media links.
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
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Company Identity</h2>
            <p className={cls.cardDescription}>
              Manage the company identity and the global brand shown across the website.
            </p>
          </div>

          <div className="space-y-6">
            <Field label="Company Name" htmlFor="companyName">
              <input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={cls.input}
                placeholder="e.g. NODAL Solutions"
                required
              />
            </Field>

            <LocalizedTextField
              id="brandName"
              label="Global Brand Name"
              en={brandName.en}
              ar={brandName.ar}
              onChange={setBrandName}
            />

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Global Brand Logo
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  This logo is used globally in the public Navbar and Footer.
                </p>
              </div>

              <BrandLogoField
                value={brandLogo}
                onChange={setBrandLogo}
              />
            </div>
          </div>
        </div>

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

        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Call To Action</h2>
            <p className={cls.cardDescription}>
              Control the destination and WhatsApp messages used by public
              website CTA buttons.
            </p>
          </div>

          <div className="space-y-6">
            <Field
              label="Start Your Project URL"
              htmlFor="projectCtaUrl"
              hint="Used by the main project CTA buttons across the website."
            >
              <input
                id="projectCtaUrl"
                type="url"
                value={projectCtaUrl}
                onChange={(e) => setProjectCtaUrl(e.target.value)}
                className={cls.input}
                placeholder="https://example.com/"
                required
              />
            </Field>

            <Field
              label="WhatsApp Number"
              htmlFor="whatsappNumber"
              hint="Country code included, without the + sign. Example: 201555686164"
            >
              <input
                id="whatsappNumber"
                inputMode="numeric"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className={cls.input}
                placeholder="201555686164"
                required
              />
            </Field>

            <Field
              label="WhatsApp Arabic Message"
              htmlFor="whatsappMessageAr"
            >
              <textarea
                id="whatsappMessageAr"
                value={whatsappMessageAr}
                onChange={(e) => setWhatsappMessageAr(e.target.value)}
                className={`${cls.input} min-h-28 resize-y`}
                dir="rtl"
                placeholder="مرحباً بكم..."
                required
              />
            </Field>

            <Field
              label="WhatsApp English Message"
              htmlFor="whatsappMessageEn"
            >
              <textarea
                id="whatsappMessageEn"
                value={whatsappMessageEn}
                onChange={(e) => setWhatsappMessageEn(e.target.value)}
                className={`${cls.input} min-h-28 resize-y`}
                placeholder="Hello, I'd like to get in touch..."
                required
              />
            </Field>
          </div>
        </div>

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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}


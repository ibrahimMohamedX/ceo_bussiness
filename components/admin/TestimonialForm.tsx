"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  LocalizedTextField,
  Select,
  Toggle,
  Field,
  cls,
} from "@/components/admin/ui";
import type {
  TestimonialRecord,
  TestimonialStatus,
} from "@/src/lib/admin/testimonials";

const STATUSES: { value: TestimonialStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface TestimonialFormProps {
  testimonialId?: string;
}

export default function TestimonialForm({
  testimonialId,
}: TestimonialFormProps) {
  const router = useRouter();
  const params = useParams();
  const id = testimonialId ?? (params.id as string);
  const isNew = id === "new";

  const [testimonial, setTestimonial] = useState<TestimonialRecord | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [quote, setQuote] = useState({ en: "", ar: "" });
  const [personName, setPersonName] = useState("");
  const [role, setRole] = useState<{ en: string; ar: string }>({
    en: "",
    ar: "",
  });
  const [company, setCompany] = useState("");
  const [avatarMediaId, setAvatarMediaId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<TestimonialStatus>("draft");
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    if (!isNew && id) {
      const loadTestimonial = async () => {
        setBusy(true);
        setError(null);
        try {
          const res = await fetch(`/admin/api/testimonials/${id}`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error("Failed to load testimonial");
          const data = (await res.json()) as { testimonial: TestimonialRecord };
          const t = data.testimonial;
          setTestimonial(t);
          setQuote(t.quote ?? { en: "", ar: "" });
          setPersonName(t.personName ?? "");
          setRole({ en: t.role?.en ?? "", ar: t.role?.ar ?? "" });
          setCompany(t.company ?? "");
          setAvatarMediaId(t.avatarMediaId ?? "");
          setFeatured(Boolean(t.featured));
          setStatus(t.status ?? "draft");
          setSortOrder(t.sortOrder ?? 0);
        } catch (e) {
          if ((e as Error).name !== "AbortError") {
            setError(e instanceof Error ? e.message : "Failed to load");
          }
        } finally {
          setBusy(false);
        }
      };
      loadTestimonial();
    }

    return () => controller.abort();
  }, [id, isNew]);

  const handleSave = async () => {
    if (!quote.en.trim() || !quote.ar.trim())
      return setError("Quote is required in both EN and AR");

    setError(null);
    setBusy(true);
    try {
      const input = {
        quote: { en: quote.en.trim(), ar: quote.ar.trim() },
        personName: personName.trim() || undefined,
        role: {
          en: role.en.trim() || undefined,
          ar: role.ar.trim() || undefined,
        },
        company: company.trim() || undefined,
        avatarMediaId: avatarMediaId.trim() || undefined,
        featured,
        status,
        sortOrder,
      };

      const url = isNew
        ? "/admin/api/testimonials"
        : `/admin/api/testimonials/${id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/admin/testimonials");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (busy && !testimonial && !isNew) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {isNew ? "New Testimonial" : "Edit Testimonial"}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Manage customer feedback, testimonials, and author attributions.
          </p>
        </div>
        <Link href="/admin/testimonials" className={cls.btnGhost}>
          â† Back to Testimonials
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Quote Content */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Testimonial Body</h2>
            <p className={cls.cardDescription}>
              The client's review text in both English and Arabic.
            </p>
          </div>
          <LocalizedTextField
            id="quote"
            label="Quote Text"
            en={quote.en}
            ar={quote.ar}
            onChange={setQuote}
            required
            area
          />
        </div>

        {/* Author Details */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Author Information</h2>
            <p className={cls.cardDescription}>
              Details about the client providing the testimonial.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name" htmlFor="personName">
              <input
                id="personName"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className={cls.input}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Company Name" htmlFor="company">
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={cls.input}
                placeholder="Acme Inc."
              />
            </Field>
          </div>
          <LocalizedTextField
            id="role"
            label="Job Title / Role"
            en={role.en}
            ar={role.ar}
            onChange={setRole}
          />
        </div>

        {/* Options & Media */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Display & Media Options</h2>
            <p className={cls.cardDescription}>
              Set testimonial status and avatar references.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Status" htmlFor="status">
              <Select
                id="status"
                value={status}
                options={STATUSES}
                onChange={setStatus}
              />
            </Field>
            <Field
              label="Sort Order"
              htmlFor="sortOrder"
              hint="Lower numbers display first"
            >
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(parseInt(e.target.value, 10) || 0)
                }
                className={cls.input}
              />
            </Field>
          </div>
          <Field
            label="Avatar Media ID"
            htmlFor="avatarMediaId"
            hint="Firebase Storage image media ID"
          >
            <input
              id="avatarMediaId"
              value={avatarMediaId}
              onChange={(e) => setAvatarMediaId(e.target.value)}
              className={cls.input}
              placeholder="media-id"
            />
          </Field>
          <div className="pt-2 border-t border-[var(--border)]">
            <Toggle
              id="featured"
              label="Highlight on Homepage Testimonials"
              checked={featured}
              onChange={setFeatured}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Link href="/admin/testimonials" className={cls.btnGhost}>
            Cancel
          </Link>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? "Saving..." : isNew ? "Create Testimonial" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}






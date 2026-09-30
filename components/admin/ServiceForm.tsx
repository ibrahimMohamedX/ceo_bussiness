"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  LocalizedTextField,
  TagEditor,
  Select,
  Toggle,
  Field,
  cls,
} from "@/components/admin/ui";
import type { ServiceRecord, ServiceStatus } from "@/src/lib/admin/services";

const STATUSES: { value: ServiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface ServiceFormProps {
  serviceId?: string;
}

export default function ServiceForm({ serviceId }: ServiceFormProps) {
  const router = useRouter();
  const params = useParams();
  const id = serviceId ?? (params.id as string);
  const isNew = id === "new";

  const [service, setService] = useState<ServiceRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState({ en: "", ar: "" });
  const [summary, setSummary] = useState({ en: "", ar: "" });
  const [description, setDescription] = useState<{ en: string; ar: string }>({
    en: "",
    ar: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [icon, setIcon] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<ServiceStatus>("draft");
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    if (!isNew && id) {
      const loadService = async () => {
        setBusy(true);
        setError(null);
        try {
          const res = await fetch(`/admin/api/services/${id}`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error("Failed to load service data");
          const data = (await res.json()) as { service: ServiceRecord };
          const s = data.service;
          setService(s);
          setSlug(s.slug ?? "");
          setTitle(s.title ?? { en: "", ar: "" });
          setSummary(s.summary ?? { en: "", ar: "" });
          setDescription({
            en: s.description?.en ?? "",
            ar: s.description?.ar ?? "",
          });
          setTags(s.tags ?? []);
          setIcon(s.icon ?? "");
          setFeatured(Boolean(s.featured));
          setStatus(s.status ?? "draft");
          setSortOrder(s.sortOrder ?? 0);
        } catch (e) {
          if ((e as Error).name !== "AbortError") {
            setError(e instanceof Error ? e.message : "Failed to load");
          }
        } finally {
          setBusy(false);
        }
      };
      loadService();
    }

    return () => controller.abort();
  }, [id, isNew]);

  const handleSave = async () => {
    if (!slug.trim()) return setError("Slug is required");
    if (!title.en.trim() || !title.ar.trim())
      return setError("Title is required in both EN and AR");
    if (!summary.en.trim() || !summary.ar.trim())
      return setError("Summary is required in both EN and AR");

    setError(null);
    setBusy(true);
    try {
      const input = {
        slug: slug.trim(),
        title: { en: title.en.trim(), ar: title.ar.trim() },
        summary: { en: summary.en.trim(), ar: summary.ar.trim() },
        description: {
          en: description.en.trim() || undefined,
          ar: description.ar.trim() || undefined,
        },
        tags: tags.map((t) => t.trim()).filter(Boolean),
        icon: icon.trim() || undefined,
        featured,
        status,
        sortOrder,
      };

      const url = isNew ? "/admin/api/services" : `/admin/api/services/${id}`;
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
      router.push("/admin/services");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (busy && !service && !isNew) {
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
            {isNew ? "Create New Service" : "Edit Service"}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Configure service details, localization, and public visibility.
          </p>
        </div>
        <Link href="/admin/services" className={cls.btnGhost}>
          ← Back to Services
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
        {/* Basic Configuration Card */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Basic Configuration</h2>
            <p className={cls.cardDescription}>
              Define service identifiers and display order.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="URL Slug"
              htmlFor="slug"
              hint="Unique URL parameter (e.g., mobile-development)"
            >
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={cls.input}
                placeholder="service-slug"
                required
              />
            </Field>
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
              hint="Lower values display first"
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
            <Field
              label="Icon Name"
              htmlFor="icon"
              hint="Lucide React icon name (e.g. Code2, Smartphone)"
            >
              <input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className={cls.input}
                placeholder="Code2"
              />
            </Field>
          </div>
        </div>

        {/* Localized Content Card */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Localized Content</h2>
            <p className={cls.cardDescription}>
              Provide titles, summaries, and full descriptions in supported
              languages.
            </p>
          </div>
          <div className="space-y-6">
            <LocalizedTextField
              id="title"
              label="Service Title"
              en={title.en}
              ar={title.ar}
              onChange={setTitle}
              required
            />
            <LocalizedTextField
              id="summary"
              label="Summary"
              en={summary.en}
              ar={summary.ar}
              onChange={setSummary}
              required
              area
            />
            <LocalizedTextField
              id="description"
              label="Full Description"
              en={description.en}
              ar={description.ar}
              onChange={setDescription}
              area
            />
          </div>
        </div>

        {/* Categorization & Visibility Card */}
        <div className={cls.card}>
          <div>
            <h2 className={cls.cardTitle}>Categorization & Options</h2>
            <p className={cls.cardDescription}>
              Manage keywords and homepage promotion.
            </p>
          </div>
          <div className="space-y-6">
            <TagEditor
              id="tags"
              label="Tags"
              values={tags}
              onChange={setTags}
            />
            <div className="pt-2 border-t border-[var(--border)]">
              <Toggle
                id="featured"
                label="Promote as Featured Service on Homepage"
                checked={featured}
                onChange={setFeatured}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Link href="/admin/services" className={cls.btnGhost}>
            Cancel
          </Link>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? "Saving..." : isNew ? "Create Service" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

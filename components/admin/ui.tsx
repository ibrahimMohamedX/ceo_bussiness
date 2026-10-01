"use client";

import React from "react";

// Standard Dashboard Input & Button Styles using Tailwind Typography Scale
const inputBase =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm text-[var(--foreground)] " +
  "placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--primary)] focus:outline-none " +
  "focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-150 shadow-sm";

export const cls = {
  input: inputBase,
  label: "mb-1.5 block text-sm font-medium text-[var(--foreground)]",
  card: "rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm space-y-5",
  cardTitle: "text-base font-semibold text-[var(--foreground)] tracking-tight",
  cardDescription: "text-xs text-[var(--muted-foreground)] mt-0.5",
  fieldset: "space-y-4 border border-[var(--border)] rounded-xl p-5",
  legend: "text-sm font-semibold text-[var(--foreground)] px-2",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white " +
    "hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-sm",
  btnGhost:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium " +
    "text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all cursor-pointer shadow-sm",
  btnDanger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium " +
    "text-red-500 hover:bg-red-500/20 transition-all cursor-pointer",
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={cls.label}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-red-500">{error}</p>
      ) : null}
    </div>
  );
}

export function LocalizedTextField({
  id,
  label,
  en,
  ar,
  dir = "ltr",
  onChange,
  required,
  area,
}: {
  id: string;
  label?: string;
  en: string;
  ar: string;
  dir?: "ltr" | "rtl";
  onChange: (next: { en: string; ar: string }) => void;
  required?: boolean;
  area?: boolean;
}) {
  const on = (lang: "en" | "ar", value: string) =>
    onChange({
      en: lang === "en" ? value : en,
      ar: lang === "ar" ? value : ar,
    });

  const baseEn = `${cls.input} ${area ? "min-h-[100px] resize-y" : ""}`;
  const baseAr = `${cls.input} ${area ? "min-h-[100px] resize-y" : ""} text-right`;

  const idEn = `${id}-en`;
  const idAr = `${id}-ar`;

  return (
    <div className="space-y-2">
      {label ? (
        <span className={cls.label}>
          {label} {required ? <span className="text-red-500">*</span> : ""}
        </span>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={idEn}
              className="text-xs font-semibold text-[var(--muted-foreground)]"
            >
              English
            </label>
            <Tag label="EN" />
          </div>
          {area ? (
            <textarea
              id={idEn}
              dir={dir}
              value={en}
              onChange={(e) => on("en", e.target.value)}
              className={baseEn}
            />
          ) : (
            <input
              id={idEn}
              dir={dir}
              value={en}
              onChange={(e) => on("en", e.target.value)}
              className={baseEn}
            />
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={idAr}
              className="text-xs font-semibold text-[var(--muted-foreground)]"
            >
              Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©
            </label>
            <Tag label="AR" />
          </div>
          {area ? (
            <textarea
              id={idAr}
              dir="rtl"
              value={ar}
              onChange={(e) => on("ar", e.target.value)}
              className={baseAr}
            />
          ) : (
            <input
              id={idAr}
              dir="rtl"
              value={ar}
              onChange={(e) => on("ar", e.target.value)}
              className={baseAr}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function TagEditor({
  id,
  label,
  values,
  onChange,
}: {
  id: string;
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={cls.label}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
        {values.map((v, idx) => (
          <span
            key={`${v}-${idx}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] shadow-sm"
          >
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={() => onChange(values.filter((_, i) => i !== idx))}
              className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors cursor-pointer"
            >
              Ã—
            </button>
          </span>
        ))}
        {values.length === 0 && (
          <span className="text-xs text-[var(--muted-foreground)] italic">
            No tags added yet.
          </span>
        )}
      </div>
      <input
        id={id}
        className={cls.input}
        placeholder="Type tag and press Enter"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const value = (e.target as HTMLInputElement).value.trim();
            if (value && !values.includes(value)) {
              onChange([...values, value]);
            }
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
    </div>
  );
}

export function Select<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className={cls.label}>
          {label}
        </label>
      ) : null}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cls.input}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      {label ? (
        <span className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer",
          checked ? "bg-[var(--primary)]" : "bg-[var(--border)]",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-sm",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border border-[var(--border)] bg-[var(--accent)]/50 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-[var(--muted-foreground)]">
      {label}
    </span>
  );
}


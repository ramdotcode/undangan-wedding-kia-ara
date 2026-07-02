"use client";

import { TEMPLATES, type TemplateId } from "../_lib/templates";

interface TemplateSelectProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

/**
 * Dropdown pilih gaya bahasa pesan.
 * Styling konsisten dengan form input di Wishes.tsx (border gray,
 * focus gold) supaya terlihat satu keluarga dengan section lain.
 */
export default function TemplateSelect({ value, onChange }: TemplateSelectProps) {
  return (
    <label className="block">
      <span className="text-navy-soft mb-1 block text-xs uppercase tracking-[0.15em]">
        Gaya Pesan
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as TemplateId)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-sm text-gray-800 outline-none transition focus:border-[var(--color-gold)]"
        >
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-navy-soft pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}

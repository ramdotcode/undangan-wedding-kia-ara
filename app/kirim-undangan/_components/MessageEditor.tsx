"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { getTemplate, type TemplateId } from "../_lib/templates";

interface MessageEditorProps {
  template: TemplateId;
  /** Override body yang sedang aktif (null = pakai default). */
  customBody: string | null;
  /** Dipanggil tiap user mengetik / reset. */
  onChange: (next: string | null) => void;
}

/**
 * Editor body pesan. Default adalah body template bawaan; user boleh
 * mengedit bebas — kalau diedit, nilai tersimpan di localStorage
 * (di-handle parent). Klik "Reset" untuk balik ke default.
 *
 * Placeholder {name} dan {link} tetap valid; user tidak boleh menghapusnya
 * sembarangan karena akan di-replace. Tapi editor tidak membatasi —
 * placeholder kosong akan diganti string "Bapak/Ibu/Saudara/i" (lihat
 * buildMessage fallback) dan {link} akan jadi string kosong.
 */
export default function MessageEditor({
  template,
  customBody,
  onChange,
}: MessageEditorProps) {
  // Default terbuka — biar user langsung lihat & bisa edit body pesan
  const [open, setOpen] = useState(true);
  const defaultBody = getTemplate(template).body;
  const isDirty = customBody !== null && customBody !== defaultBody;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-navy-soft hover:text-navy inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] underline-offset-2 hover:underline"
        aria-expanded={open}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {open ? "Sembunyikan editor pesan" : "Edit pesan default"}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-cream)]/40 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-navy-soft text-[10px] uppercase tracking-[0.15em]">
                  Body pesan — {getTemplate(template).label}
                </p>
                <button
                  type="button"
                  disabled={!isDirty}
                  onClick={() => onChange(null)}
                  className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-medium text-navy-soft transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-navy-soft"
                >
                  Reset ke default
                </button>
              </div>

              <textarea
                value={customBody ?? defaultBody}
                onChange={(e) => onChange(e.target.value)}
                rows={10}
                spellCheck={false}
                className="w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2 font-mono text-[11px] leading-relaxed text-navy-soft outline-none transition focus:border-[var(--color-gold)]"
                placeholder={defaultBody}
              />

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-navy-soft/80">
                <span>
                  Placeholder valid:{" "}
                  <code className="rounded bg-white px-1 py-0.5 text-navy">
                    {"{name}"}
                  </code>{" "}
                  <code className="rounded bg-white px-1 py-0.5 text-navy">
                    {"{link}"}
                  </code>
                </span>
                {isDirty && (
                  <span className="text-[var(--color-gold-dark)] font-medium">
                    ● Versi custom (tersimpan otomatis)
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

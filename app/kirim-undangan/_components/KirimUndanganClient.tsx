"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import GuestForm from "./GuestForm";
import GuestTable, { type GuestRow } from "./GuestTable";
import MessageEditor from "./MessageEditor";
import TemplateSelect from "./TemplateSelect";
import { type TemplateId } from "../_lib/templates";

interface KirimUndanganClientProps {
  id: string;
}

/**
 * Baca initial guests dari localStorage secara sinkron.
 * Dipakai sebagai lazy initializer `useState` — jalan di client, return []
 * di server. Pendekatan ini menghindari `setState` di dalam effect
 * (yang akan memicu lint error cascading-renders).
 */
function readInitialGuests(id: string): GuestRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as GuestRow[];
    return [];
  } catch {
    return [];
  }
}

/**
 * Baca custom body untuk 1 template. Return null kalau belum ada
 * override (jadi UI pakai default).
 */
function readCustomBody(id: string, template: TemplateId): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(customBodyKey(id, template));
  } catch {
    return null;
  }
}

/**
 * Orchestrator untuk halaman /kirim-undangan.
 *
 * State:
 *   - guests       : nama yang sudah di-commit (persist ke localStorage)
 *   - template     : gaya pesan aktif
 *   - customBody   : override body pesan untuk template aktif (null = default)
 *
 * localStorage keys:
 *   - elevra:guests:${id}              -> GuestRow[]
 *   - elevra:customBody:${id}:${tmpl}  -> string (override body)
 */
export default function KirimUndanganClient({ id }: KirimUndanganClientProps) {
  const [guests, setGuests] = useState<GuestRow[]>(() => readInitialGuests(id));
  const [template, setTemplate] = useState<TemplateId>("formal");
  const [customBody, setCustomBody] = useState<string | null>(null);

  // Track template aktif agar effect bisa load custom body per-template
  const lastLoadedTemplate = useRef<TemplateId | null>(null);

  // Saat template diganti, load custom body untuk template itu (kalau ada).
  // Saat pertama mount, load untuk template default.
  useEffect(() => {
    if (lastLoadedTemplate.current === template) return;
    setCustomBody(readCustomBody(id, template));
    lastLoadedTemplate.current = template;
  }, [template, id]);

  // Persist guests ke localStorage setiap ada perubahan
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey(id), JSON.stringify(guests));
    } catch {
      // quota exceeded atau disabled — abaikan
    }
  }, [guests, id]);

  // Persist custom body (kalau null, hapus key)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lastLoadedTemplate.current === null) return; // skip initial mount
    try {
      if (customBody === null) {
        window.localStorage.removeItem(customBodyKey(id, template));
      } else {
        window.localStorage.setItem(customBodyKey(id, template), customBody);
      }
    } catch {
      // abaikan
    }
  }, [customBody, id, template]);

  function commitNames(names: string[]) {
    if (names.length === 0) return;
    const additions: GuestRow[] = names.map((name) => ({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}-${name.length}`,
      name,
      createdAt: Date.now(),
    }));
    setGuests((prev) => [...prev, ...additions]);
  }

  function deleteGuest(guestId: string) {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  }

  function handleTemplateChange(next: TemplateId) {
    setTemplate(next);
  }

  function handleCustomBodyChange(next: string | null) {
    setCustomBody(next);
  }

  return (
    <div className="min-h-screen bg-gradient-cream">
      {/* Header */}
      <header className="border-b border-[var(--color-gold)]/20 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <div>
            <p
              className="text-[var(--color-gold)] text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              Elevra · Admin
            </p>
            <h1
              className="text-navy text-lg sm:text-xl"
              style={{ fontFamily: "var(--font-aston)", fontWeight: 400 }}
            >
              Kirim Undangan
            </h1>
          </div>
          <span
            className="rounded-full border border-[var(--color-gold)]/40 bg-white px-3 py-1 text-[11px] font-medium text-navy-soft"
            title="ID invitation aktif (dari query string ?id=...)"
          >
            Mode:&nbsp;
            <span className="text-[var(--color-gold-dark)]">{id}</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:py-12">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p
            className="text-[var(--color-gold)] mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-trajanpro)" }}
          >
            Kia &amp; Ara
          </p>
          <h2
            className="text-navy mb-3 text-2xl sm:text-3xl"
            style={{ fontFamily: "var(--font-aston)", fontWeight: 400 }}
          >
            Daftarkan Tamu Undangan
          </h2>
          <div className="mx-auto mb-3 flex max-w-xs items-center justify-center gap-2">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="text-[var(--color-gold)]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5 0 L7 5 L5 10 L3 5 Z" />
            </svg>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
          </div>
          <p className="text-navy-soft mx-auto max-w-md text-sm leading-relaxed">
            Pilih gaya bahasa & edit isi pesan di atas, lalu ketik daftar nama
            tamu di bawah (satu nama per baris). Klik tombol untuk menambah ke
            daftar, lalu kirim via WhatsApp atau salin link.
          </p>
        </motion.div>

        {/* Section 1 — Template + editor pesan (di ATAS) */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 rounded-2xl border border-[var(--color-gold)]/20 bg-white p-5 shadow-[var(--shadow-elevra-sm)] sm:p-6"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3
              className="text-navy text-base font-semibold"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              1. Atur Pesan
            </h3>
            <div className="w-48 sm:w-56">
              <TemplateSelect value={template} onChange={handleTemplateChange} />
            </div>
          </div>
          <p className="text-navy-soft/70 mb-3 text-[11px] leading-relaxed">
            Template menentukan format pesan & link yang dihasilkan untuk semua
            tamu. Klik editor di bawah untuk mengubah isi pesan.
          </p>
          <MessageEditor
            template={template}
            customBody={customBody}
            onChange={handleCustomBodyChange}
          />
        </motion.section>

        {/* Section 2 — Form nama tamu (di BAWAH) */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 rounded-2xl border border-[var(--color-gold)]/20 bg-white p-5 shadow-[var(--shadow-elevra-sm)] sm:p-6"
        >
          <h3
            className="text-navy mb-3 text-base font-semibold"
            style={{ fontFamily: "var(--font-trajanpro)" }}
          >
            2. Daftarkan Tamu
          </h3>
          <GuestForm onCommit={commitNames} />
        </motion.section>

        {/* Table section */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GuestTable
            guests={guests}
            template={template}
            customBody={customBody}
            id={id}
            onDelete={deleteGuest}
          />
        </motion.section>

        {/* Footer note */}
        <p className="text-navy-soft/70 mt-10 text-center text-[11px]">
          Daftar tersimpan otomatis di browser (localStorage). Kosongkan via
          tombol hapus di tiap baris.
        </p>
      </main>
    </div>
  );
}

function storageKey(id: string): string {
  return `elevra:guests:${id}`;
}

function customBodyKey(id: string, template: TemplateId): string {
  return `elevra:customBody:${id}:${template}`;
}

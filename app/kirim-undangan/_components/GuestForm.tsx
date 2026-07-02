"use client";

import { useState } from "react";

interface GuestFormProps {
  /**
   * Commit daftar nama sekaligus ke tabel utama.
   * Tiap baris non-kosong di textarea jadi 1 entri.
   * `name` di-trim dan baris kosong di-skip.
   */
  onCommit: (names: string[]) => void;
}

/**
 * Form input nama tamu — textarea besar multi-baris.
 *
 * Alur:
 *   - User ketik nama, Enter untuk baris baru
 *   - Klik "Tambah ke Daftar" → SEMUA baris non-kosong masuk tabel
 *   - Textarea dikosongkan setelah commit
 *
 * Tidak ada konsep "draft" lagi — semuanya satu langkah.
 */
export default function GuestForm({ onCommit }: GuestFormProps) {
  const [text, setText] = useState("");

  function parseNames(raw: string): string[] {
    // Pecah per baris, trim, drop yang kosong
    return raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function handleCommit() {
    const names = parseNames(text);
    if (names.length === 0) return;
    onCommit(names);
    setText("");
  }

  const previewNames = parseNames(text);
  const canCommit = previewNames.length > 0;

  return (
    <div>
      <label className="mb-1 block">
        <span className="text-navy-soft mb-1 block text-xs uppercase tracking-[0.15em]">
          Nama Tamu
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={`Bapak Budi\nIbu Sari\nMas Rafli\nMbak Ayu`}
          className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-gray-800 outline-none transition focus:border-[var(--color-gold)]"
        />
      </label>

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-navy-soft/70 text-[11px]">
          Satu nama per baris. Tekan{" "}
          <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>{" "}
          untuk baris baru.
        </p>
        {canCommit && (
          <p className="text-navy-soft text-[11px] font-medium">
            {previewNames.length} nama terdeteksi
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleCommit}
        disabled={!canCommit}
        className="w-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white shadow transition-opacity disabled:opacity-50"
      >
        {canCommit
          ? `Tambah ${previewNames.length} Nama ke Daftar`
          : "Tambah ke Daftar"}
      </button>
    </div>
  );
}

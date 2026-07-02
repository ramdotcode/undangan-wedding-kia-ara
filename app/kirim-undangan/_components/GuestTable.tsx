"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { buildShareLinks } from "../_lib/messages";
import { getTemplate, type TemplateId } from "../_lib/templates";

export interface GuestRow {
  id: string;
  name: string;
  createdAt: number;
}

interface GuestTableProps {
  guests: GuestRow[];
  template: TemplateId;
  id: string;
  customBody?: string | null;
  onDelete: (id: string) => void;
}

/**
 * Tabel daftar tamu + preview pesan + 5 kolom aksi per baris.
 *
 * Aksi:
 *   - WhatsApp   : buka wa.me/?text=... di tab baru
 *   - Facebook   : buka facebook sharer (hanya share link, FB tidak support prefill text)
 *   - Copy link  : salin link personal saja
 *   - Copy text  : salin full message
 *   - Delete     : hapus dari list (konfirmasi)
 *
 * Toast kecil di kanan bawah muncul 1.5 detik setelah copy berhasil.
 */
export default function GuestTable({
  guests,
  template,
  id,
  customBody,
  onDelete,
}: GuestTableProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast((cur) => (cur === message ? null : cur)), 1500);
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(label);
    } catch {
      // Fallback: pakai textarea + execCommand untuk browser lama / insecure context
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast(label);
      } catch {
        showToast("Gagal menyalin");
      }
      document.body.removeChild(ta);
    }
  }

  function handleDelete(guest: GuestRow) {
    const ok = window.confirm(`Hapus "${guest.name}" dari daftar?`);
    if (ok) onDelete(guest.id);
  }

  function handleSendAll() {
    if (guests.length === 0) return;
    const ok = window.confirm(
      `Akan membuka ${guests.length} tab WhatsApp satu per satu. Lanjutkan?`,
    );
    if (!ok) return;
    // Stagger sedikit agar browser tidak block popup
    guests.forEach((g, idx) => {
      const { waUrl } = buildShareLinks(template, g.name, id, customBody ?? undefined);
      setTimeout(() => window.open(waUrl, "_blank", "noopener,noreferrer"), idx * 250);
    });
  }

  if (guests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-gold)]/30 bg-white/50 px-6 py-12 text-center">
        <p className="text-navy-soft text-sm">
          Belum ada tamu ditambahkan. Ketik nama di atas lalu klik
          &ldquo;Tambah ke Daftar&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header bar: tombol kirim semua */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-navy-soft text-xs uppercase tracking-[0.15em]">
          Daftar Tamu ({guests.length})
        </p>
        <button
          type="button"
          onClick={handleSendAll}
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-white shadow transition hover:bg-green-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82c-1.91 0-3.78-.51-5.41-1.48l-.39-.23-3.67.96.98-3.58-.25-.37A9.86 9.86 0 012.18 12 9.82 9.82 0 0112 2.18 9.82 9.82 0 0121.82 12 9.82 9.82 0 0112 21.82zm5.39-7.36c-.3-.15-1.74-.86-2.01-.96-.27-.1-.46-.15-.66.15s-.76.96-.93 1.16c-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.19-.24-.58-.49-.5-.66-.51l-.56-.01c-.2 0-.52.07-.79.37s-1.04 1.01-1.04 2.47 1.07 2.87 1.22 3.07c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.74-.71 1.99-1.4.25-.69.25-1.27.17-1.4-.07-.13-.27-.2-.57-.35z" />
          </svg>
          Kirim ke WhatsApp (semua)
        </button>
      </div>

      {/* Tabel — di mobile jadi kartu stacked */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-gold)]/20 bg-white shadow-[var(--shadow-elevra-sm)]">
        {/* Desktop table */}
        <table className="hidden w-full text-left text-sm md:table">
          <thead>
            <tr className="border-b border-[var(--color-gold)]/20 bg-[var(--color-cream)] text-navy-soft text-[11px] uppercase tracking-[0.15em]">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Nama</th>
              <th className="px-4 py-3 font-semibold">Preview Pesan</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => {
              const { waUrl, fbUrl, inviteLink, message } = buildShareLinks(
                template,
                g.name,
                id,
                customBody ?? undefined,
              );
              return (
                <tr
                  key={g.id}
                  className="border-b border-gray-100 last:border-b-0 transition hover:bg-[var(--color-cream)]/40"
                >
                  <td className="text-navy-soft px-4 py-3 align-top text-xs">{i + 1}</td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-navy font-medium">{g.name}</span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewId((cur) => (cur === g.id ? null : g.id))
                      }
                      className="text-navy-soft hover:text-navy text-left text-[11px] underline-offset-2 hover:underline"
                    >
                      {previewId === g.id ? "Sembunyikan preview" : "Lihat preview"}
                    </button>
                    {previewId === g.id && (
                      <pre className="bg-cream/60 border-gold/20 mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-[var(--color-cream)] p-2 font-mono text-[10px] leading-relaxed text-navy-soft">
                        {message}
                      </pre>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <ActionButtons
                      waUrl={waUrl}
                      fbUrl={fbUrl}
                      inviteLink={inviteLink}
                      message={message}
                      onCopy={copyToClipboard}
                      onDelete={() => handleDelete(g)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile cards */}
        <ul className="divide-y divide-gray-100 md:hidden">
          {guests.map((g, i) => {
            const { waUrl, fbUrl, inviteLink, message } = buildShareLinks(
              template,
              g.name,
              id,
              customBody ?? undefined,
            );
            return (
              <li key={g.id} className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-navy-soft text-[10px] uppercase tracking-[0.15em]">
                      #{i + 1}
                    </p>
                    <p className="text-navy truncate font-medium">{g.name}</p>
                  </div>
                  <ActionButtons
                    waUrl={waUrl}
                    fbUrl={fbUrl}
                    inviteLink={inviteLink}
                    message={message}
                    onCopy={copyToClipboard}
                    onDelete={() => handleDelete(g)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewId((cur) => (cur === g.id ? null : g.id))
                  }
                  className="text-navy-soft text-[11px] underline-offset-2 hover:underline"
                >
                  {previewId === g.id ? "Sembunyikan preview" : "Lihat preview pesan"}
                </button>
                {previewId === g.id && (
                  <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-2 font-mono text-[10px] leading-relaxed text-navy-soft">
                    {message}
                  </pre>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-navy-soft px-4 py-2 text-xs font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </motion.div>
      )}

      <p className="text-navy-soft/70 mt-3 text-[11px]">
        Template aktif:{" "}
        <span className="text-navy font-medium">{getTemplate(template).label}</span>
      </p>
    </div>
  );
}

interface ActionButtonsProps {
  waUrl: string;
  fbUrl: string;
  inviteLink: string;
  message: string;
  onCopy: (text: string, label: string) => void;
  onDelete: () => void;
}

/**
 * 5 tombol aksi ikon-only: WhatsApp, Facebook, Copy link, Copy text, Delete.
 * Ukuran ringkas supaya muat di kolom tabel.
 */
function ActionButtons({
  waUrl,
  fbUrl,
  inviteLink,
  message,
  onCopy,
  onDelete,
}: ActionButtonsProps) {
  const baseClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95";

  return (
    <div className="flex items-center gap-1.5">
      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kirim via WhatsApp"
        title="Kirim via WhatsApp"
        className={`${baseClass} border-green-200 bg-green-50 text-green-700 hover:bg-green-100`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82c-1.91 0-3.78-.51-5.41-1.48l-.39-.23-3.67.96.98-3.58-.25-.37A9.86 9.86 0 012.18 12 9.82 9.82 0 0112 2.18 9.82 9.82 0 0121.82 12 9.82 9.82 0 0112 21.82z" />
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={fbUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share ke Facebook"
        title="Share ke Facebook"
        className={`${baseClass} border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 10-11.56 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0022 12z" />
        </svg>
      </a>

      {/* Copy link */}
      <button
        type="button"
        onClick={() => onCopy(inviteLink, "Link disalin")}
        aria-label="Salin link"
        title="Salin link undangan"
        className={`${baseClass} border-gray-200 bg-gray-50 text-navy-soft hover:bg-gray-100`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      </button>

      {/* Copy text */}
      <button
        type="button"
        onClick={() => onCopy(message, "Teks disalin")}
        aria-label="Salin teks pesan"
        title="Salin teks pesan lengkap"
        className={`${baseClass} border-gray-200 bg-gray-50 text-navy-soft hover:bg-gray-100`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        aria-label="Hapus dari daftar"
        title="Hapus dari daftar"
        className={`${baseClass} border-red-200 bg-red-50 text-red-600 hover:bg-red-100`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  );
}

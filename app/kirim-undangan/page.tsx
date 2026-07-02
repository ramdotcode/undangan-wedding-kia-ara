"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import KirimUndanganClient from "./_components/KirimUndanganClient";

/**
 * /kirim-undangan?id=<invitation-id>
 *
 * Baca `id` dari query string via `useSearchParams`. Wajib dibungkus
 * `<Suspense>` di Next 15+ agar build production tidak gagal
 * (lihat: useSearchParams docs).
 *
 * Default `id` = "kia-ara" supaya halaman tetap jalan walau dibuka
 * tanpa query string.
 */
function KirimUndanganInner() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = (rawId ?? "kia-ara").trim() || "kia-ara";

  return <KirimUndanganClient id={id} />;
}

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-cream">
      <p className="text-navy-soft text-sm">Memuat...</p>
    </div>
  );
}

export default function KirimUndanganPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <KirimUndanganInner />
    </Suspense>
  );
}

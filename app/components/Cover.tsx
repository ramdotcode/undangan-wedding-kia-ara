"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CoverProps {
  coupleName: string;
  date: string;
  photoSrc: string;
  guestName?: string;
  onOpen: () => void;
}

interface DragPosition {
  x: number;
  y: number;
}

/**
 * Halaman cover full-screen dengan background image "BG web.jpeg"
 * (komposisi sudah berisi pilar, cabang sakura, peony, hydrangea, awan).
 *
 * Tugas komponen ini HANYA:
 * - Menampilkan background image sebagai layer paling bawah
 * - Menampilkan frame oval berisi foto pre-wedding di tengah
 * - Menampilkan "The Wedding Of" + nama pengantin (script)
 * - Menampilkan pill badge tanggal
 * - Menampilkan "Kepada Yth. Bapak/Ibu/Saudara/i"
 * - Menampilkan tombol "BUKA UNDANGAN" navy dengan envelope icon
 *
 * Props onOpen dipakai parent untuk unlock scroll.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default function Cover({
  coupleName,
  date,
  photoSrc,
  guestName,
  onOpen,
}: CoverProps) {
  const [mounted, setMounted] = useState(false);
  const [leftFlowerPos, setLeftFlowerPos] = useState<DragPosition>({ x: 0, y: 0 });
  const [rightFlowerPos, setRightFlowerPos] = useState<DragPosition>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pecah nama jadi "[first] & [second]" agar '&' bisa diwarnai emas terpisah
  const nameParts = coupleName.split("&").map((s) => s.trim());
  const firstName = nameParts[0] ?? coupleName;
  const secondName = nameParts[1] ?? "";

  return (
    <AnimatePresence>
      <motion.section
        key="cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 z-50 overflow-hidden text-center h-full w-full"
      >
        {/* ============================================================
            LAYER 1 — Background image (punya user, sudah berisi komposisi
            pilar + bunga + awan). object-cover dengan posisi top agar
            frame oval di background tetap kelihatan di mobile.
            ============================================================ */}
        <div className="absolute inset-0">
          <Image
            src="/BG web.jpeg"
            alt="Cover background"
            fill
            priority
            unoptimized
            className="object-cover object-top"
          />
        </div>

        {/* ============================================================
            LAYER 2 — Konten utama
            ============================================================ */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 py-8">
          <div className="flex w-full max-w-md flex-col items-center gap-3 -mt-8 sm:-mt-10">
            {/* "The Wedding Of" */}
            <motion.p
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-navy text-xs font-semibold uppercase tracking-[0.45em] sm:text-sm"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              The Wedding Of
            </motion.p>

            {/* Divider gold kecil */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
              <svg
                width="24"
                height="12"
                viewBox="0 0 24 12"
                className="text-[var(--color-gold)]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-5-1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm10 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              </svg>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
            </motion.div>

            {/* Couple name — script cursive dengan '&' emas */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-navy mt-2 text-4xl leading-[1.1] sm:text-5xl"
              style={{ fontFamily: "var(--font-aston)", fontWeight: 400 }}
            >
              <span>{firstName}</span>
              {secondName ? (
                <>
                  <span
                    className="text-[var(--color-gold)] italic"
                    style={{ fontFamily: "var(--font-clarissa)" }}
                  >
                    &nbsp;&amp;&nbsp;
                  </span>
                  <span>{secondName}</span>
                </>
              ) : null}
            </motion.h1>

            {/* Photo — frame oval dengan overlay bunga di depannya */}
            <div className="relative mt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                className="relative h-[270px] w-[250px] overflow-hidden rounded-full shadow-[0_8px_30px_rgba(30,42,74,0.15)] sm:h-[305px] sm:w-[285px]"
                style={{ borderRadius: "9999px" }}
              >
                <Image
                  src={photoSrc}
                  alt={`${coupleName} pre-wedding photo`}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              </motion.div>

              {/* Bunga di depan gambar bagian kiri */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -10, y: 10, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: -12 }}
                transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
                className="absolute -bottom-14 -left-24 z-20 h-[190px] w-[230px] pointer-events-none sm:h-[230px] sm:w-[280px]"
                style={{ rotate: -40 }}
              >
                <Image
                  src="/Bunga depan gambar Medium kiri.png"
                  alt="Left flower decoration overlay"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                />
              </motion.div>

              {/* Bunga di depan gambar bagian kanan */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10, y: 10, rotate: 12 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 12 }}
                transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
                className="absolute -bottom-14 -right-24 z-20 h-[190px] w-[230px] pointer-events-none sm:h-[230px] sm:w-[280px]"
                style={{ rotate: 40 }}
              >
                <Image
                  src="/Bunga depan gambar kanan.png"
                  alt="Right flower decoration overlay"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                />
              </motion.div>
            </div>

            {/* Tanggal — pill badge dengan border gold */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--color-gold)] bg-white/70 px-6 py-2 shadow-[0_4px_20px_rgba(201,169,110,0.25)] backdrop-blur-sm"
            >
              <span
                className="text-navy text-sm uppercase tracking-[0.2em] sm:text-base font-semibold"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                {date}
              </span>
            </motion.div>

            {/* Optional guest name */}
            {guestName ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="text-navy-soft mt-4 text-base italic sm:text-lg"
                style={{ fontFamily: "var(--font-aston)" }}
              >
                Kepada Yth.
              </motion.p>
            ) : null}

            {guestName ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="font-serif-display text-navy text-base sm:text-lg"
              >
                {guestName}
              </motion.p>
            ) : null}

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="mt-2 flex items-center gap-2"
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                className="text-[var(--color-gold)]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
            </motion.div>

            {/* Open button — navy dengan envelope icon */}
            <motion.button
              type="button"
              onClick={onOpen}
              disabled={!mounted}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.45, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-navy-soft px-7 py-3 text-sm font-medium uppercase tracking-[0.15em] text-white shadow-[0_6px_24px_rgba(30,42,74,0.35)] transition-shadow hover:shadow-[0_10px_32px_rgba(30,42,74,0.5)] disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 512 512"
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M512 464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V200.724a48 48 0 0 1 18.387-37.776c24.913-19.529 45.501-35.365 164.2-121.511C199.412 29.17 232.797-.347 256 .003c23.198-.354 56.596 29.172 73.413 41.433 118.687 86.137 139.303 101.995 164.2 121.512A48 48 0 0 1 512 200.724V464zm-65.666-196.605c-2.563-3.728-7.7-4.595-11.339-1.907-22.845 16.873-55.462 40.705-105.582 77.079-16.825 12.266-50.21 41.781-73.413 41.43-23.211.344-56.559-29.143-73.413-41.43-50.114-36.37-82.734-60.204-105.582-77.079-3.639-2.688-8.776-1.821-11.339 1.907l-9.072 13.196a7.998 7.998 0 0 0 1.839 10.967c22.887 16.899 55.454 40.69 105.303 76.868 20.274 14.781 56.524 47.813 92.264 47.573 35.724.242 71.961-32.771 92.263-47.573 49.85-36.179 82.418-59.97 105.303-76.868a7.998 7.998 0 0 0 1.839-10.967l-9.071-13.196z" />
              </svg>
              <span>Buka Undangan</span>
            </motion.button>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

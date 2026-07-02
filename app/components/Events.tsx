"use client";

import { motion } from "framer-motion";

interface Session {
  /** Judul sesi, mis. "Akad Nikah" / "Resepsi". */
  title: string;
  /** Waktu sesi, mis. "Pukul 08.00 WIB - Selesai". */
  time: string;
}

interface EventCardProps {
  /** Tanggal acara (sama untuk semua sesi dalam card). */
  date: string;
  /** Daftar sesi dalam card. Jika 1 sesi, tampil tanpa connector. */
  sessions: Session[];
  /** Lokasi card (sama untuk semua sesi, mis. "Lokasi"). */
  location: string;
  /** Alamat lengkap lokasi. */
  address: string;
  /** URL Google Maps untuk tombol "Kunjungi Lokasi". */
  mapUrl?: string;
  /** Nomor urut card, mis. 01, 02. Untuk badge visual. */
  order: number;
}

/** Ornamen garis gold + diamond (sama dengan section lain di Couple). */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
      <svg
        width="8"
        height="8"
        viewBox="0 0 10 10"
        className="text-[var(--color-gold)]"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5 0 L7 5 L5 10 L3 5 Z" />
      </svg>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
    </div>
  );
}

/** Connector vertikal kecil antar sesi dalam satu card. */
function SessionConnector() {
  return (
    <div
      className="mx-auto flex w-px flex-col items-center py-1"
      aria-hidden="true"
    >
      <span className="h-4 w-px bg-gradient-to-b from-[var(--color-gold)]/60 to-transparent" />
      <svg
        width="8"
        height="8"
        viewBox="0 0 10 10"
        className="text-[var(--color-gold)]/60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5 0 L7 5 L5 10 L3 5 Z" />
      </svg>
      <span className="h-4 w-px bg-gradient-to-t from-[var(--color-gold)]/60 to-transparent" />
    </div>
  );
}

function EventCard({
  date,
  sessions,
  location,
  address,
  mapUrl,
  order,
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative rounded-2xl border border-[rgba(201,169,110,0.3)] bg-white/80 p-6 pt-8 text-center shadow-[var(--shadow-elevra-sm)] backdrop-blur sm:p-8 sm:pt-10"
    >
      {/* Badge nomor urut — pill gold kecil di atas card */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <div className="flex h-7 items-center justify-center rounded-full border border-[var(--color-gold)] bg-white px-3 shadow-[0_2px_8px_rgba(201,169,110,0.25)]">
          <span
            className="text-[var(--color-gold)] text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-trajanpro)" }}
          >
            {String(order).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Date dengan icon calendar */}
      <div className="text-navy-soft mt-1 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] sm:text-sm">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 text-[var(--color-gold)]"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
        <span>{date}</span>
      </div>

      {/* Divider gold kecil di bawah tanggal */}
      <div className="my-3">
        <GoldDivider />
      </div>

      {/* Daftar sesi (Akad / Resepsi) — vertikal dengan connector kecil */}
      <div className="flex flex-col">
        {sessions.map((s, i) => (
          <div key={s.title}>
            <motion.h3
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="text-navy mb-1 text-xl uppercase tracking-[0.18em] sm:text-2xl"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              {s.title}
            </motion.h3>
            <div className="text-navy-soft mt-1.5 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.15em] sm:text-sm">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="shrink-0 text-[var(--color-gold)]"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
              <span>{s.time}</span>
            </div>
            {i < sessions.length - 1 ? <SessionConnector /> : null}
          </div>
        ))}
      </div>

      {/* Location name (tanpa icon, dengan jarak atas lebih lega) */}
      <div className="mt-8 flex items-start justify-center sm:mt-10">
        <span className="text-navy-soft text-sm tracking-wider sm:text-base">
          {location}
        </span>
      </div>

      {/* Address — dengan icon pin menunjukkan jalan/alamat */}
      <div className="text-navy-soft/80 mt-2 flex items-start justify-center gap-2 px-2 text-xs leading-relaxed sm:text-sm">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mt-0.5 shrink-0 text-[var(--color-gold)]"
          aria-hidden="true"
        >
          <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <p className="flex-1 text-left">{address}</p>
      </div>

      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/50 bg-white px-5 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span>Kunjungi Lokasi</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      ) : null}
    </motion.div>
  );
}

interface EventsProps {
  events: Omit<EventCardProps, "order">[];
}

/**
 * Section daftar acara. Mendukung 1 card berisi beberapa sesi
 * (mis. akad + resepsi di tempat sama). Setiap card vertikal,
 * dengan connector gold tipis di antara card (visual timeline).
 */
export default function Events({ events }: EventsProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      {events.map((ev, i) => (
        <div key={ev.location + i} className="w-full">
          <EventCard {...ev} order={i + 1} />

          {/* Connector line antar card (skip setelah card terakhir) */}
          {i < events.length - 1 ? (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto my-2 flex w-px flex-col items-center"
              style={{ transformOrigin: "top" }}
              aria-hidden="true"
            >
              <span className="h-6 w-px bg-gradient-to-b from-[var(--color-gold)] to-transparent" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className="text-[var(--color-gold)]/60"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5 0 L7 5 L5 10 L3 5 Z" />
              </svg>
              <span className="h-6 w-px bg-gradient-to-t from-[var(--color-gold)] to-transparent" />
            </motion.div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  /** ISO date string, contoh: "2026-07-08T08:00:00+07:00" */
  targetDate: string;
  /** Label kecil di atas box (default: "Menuju Hari Bahagia") */
  title?: string;
  /** Sub-label tanggal di bawah title */
  dateLabel?: string;
}

interface DigitProps {
  value: number;
  label: string;
  delay: number;
}

function Digit({ value, label, delay }: DigitProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl border border-[var(--color-gold)]/40 bg-white/70 p-3 shadow-[0_4px_16px_rgba(201,169,110,0.15)] backdrop-blur-sm sm:p-4"
    >
      <motion.p
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="font-serif-display text-navy text-2xl tabular-nums sm:text-3xl"
      >
        {String(value).padStart(2, "0")}
      </motion.p>
      <p className="text-[var(--color-gold)] mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
        {label}
      </p>
    </motion.div>
  );
}

/**
 * Countdown timer dinamis ke tanggal target.
 *
 * Pakai:
 *   <Countdown targetDate="2026-07-08T08:00:00+07:00" />
 */
export default function Countdown({
  targetDate,
  title = "Menuju Hari Bahagia",
  dateLabel = "08 . 07 . 2026",
}: CountdownProps) {
  // Hindari mismatch SSR vs client dengan mount gate
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    // Hitung target timestamp SEKALI dari string ISO. Jangan simpan Date
    // object di dependency array — Date baru setiap render, akan loop.
    const targetMs = new Date(targetDate).getTime();

    function tick() {
      const diff = Math.max(0, targetMs - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [targetDate]); // dependensi string, bukan Date object

  const isPast = mounted && new Date(targetDate).getTime() <= Date.now();

  return (
    <div className="text-center">
      {/* Label kecil di atas title — konsisten dengan section 1 & 2 */}
      <p
        className="text-[var(--color-gold)] mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
        style={{ fontFamily: "var(--font-trajanpro)" }}
      >
        Save The Date
      </p>

      <h2
        className="text-navy mb-4 text-2xl uppercase tracking-[0.3em] sm:text-3xl font-semibold"
        style={{ fontFamily: "var(--font-trajanpro)" }}
      >
        {title}
      </h2>

      {/* Divider gold kecil dengan ornament berlian (sama dengan section 1 & 2) */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-2"
      >
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
      </motion.div>

      <p
        className="text-navy-soft mb-8 text-sm sm:text-base italic"
        style={{ fontFamily: "var(--font-clarissa)" }}
      >
        {dateLabel}
      </p>

      {isPast ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif-display text-navy text-2xl sm:text-3xl"
        >
          Hari ini adalah hari yang ditunggu ❤
        </motion.p>
      ) : (
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3">
          <Digit value={timeLeft.days} label="Hari" delay={0} />
          <Digit value={timeLeft.hours} label="Jam" delay={0.05} />
          <Digit value={timeLeft.minutes} label="Menit" delay={0.1} />
          <Digit value={timeLeft.seconds} label="Detik" delay={0.15} />
        </div>
      )}

      {mounted && !isPast ? (
        <p className="text-navy-soft/70 mt-5 text-[10px] uppercase tracking-[0.2em] sm:text-xs">
          {timeLeft.days} hari lagi
        </p>
      ) : null}
    </div>
  );
}

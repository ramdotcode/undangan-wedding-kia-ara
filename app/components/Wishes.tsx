"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

interface Wish {
  id: string;
  name: string;
  message: string;
  attendance: "hadir" | "tidak";
  created_at: string;
}

/**
 * Section ucapan / guestbook. Data persistent di Supabase (tabel `wishes_kia_ara`).
 * Env var yang dibutuhkan: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Skema tabel ada di /supabase/schema.sql.
 */
export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak">("hadir");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua ucapan saat mount, urut terbaru di atas
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error: fetchError } = await supabase
        .from("wishes_kia_ara")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setWishes(data as Wish[]);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("wishes_kia_ara")
      .insert({
        name: name.trim(),
        message: message.trim(),
        attendance,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    if (data) {
      // prepend agar muncul di paling atas
      setWishes((prev) => [data as Wish, ...prev]);
    }
    setName("");
    setMessage("");
    setAttendance("hadir");
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-xl text-left">
      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 rounded-2xl border border-[rgba(201,169,110,0.25)] bg-white p-5 shadow-[var(--shadow-elevra-sm)] sm:p-6"
      >
        <h3 className="font-serif-display text-navy mb-4 text-center text-xl sm:text-2xl">
          Kirim Ucapan
        </h3>

        <label className="mb-3 block">
          <span className="text-navy-soft mb-1 block text-xs uppercase tracking-[0.15em]">
            Nama
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
            placeholder="Nama Anda"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[var(--color-gold)]"
          />
        </label>

        <label className="mb-3 block">
          <span className="text-navy-soft mb-1 block text-xs uppercase tracking-[0.15em]">
            Ucapan &amp; Doa
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={300}
            rows={3}
            placeholder="Tulis ucapan..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[var(--color-gold)]"
          />
        </label>

        <div className="mb-4 flex gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="attendance"
              checked={attendance === "hadir"}
              onChange={() => setAttendance("hadir")}
              className="accent-[var(--color-gold)]"
            />
            <span className="text-navy-soft">Hadir</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="attendance"
              checked={attendance === "tidak"}
              onChange={() => setAttendance("tidak")}
              className="accent-[var(--color-gold)]"
            />
            <span className="text-navy-soft">Tidak Hadir</span>
          </label>
        </div>

        {error && (
          <p className="mb-3 text-center text-xs text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white shadow transition-opacity disabled:opacity-60"
        >
          {submitting ? "Mengirim..." : "Kirim Ucapan"}
        </button>
      </motion.form>

      {/* Wishes list */}
      <div
        style={{ height: "400px" }}
        className="overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {loading ? (
          <p className="text-navy-soft py-8 text-center text-sm">
            Memuat ucapan...
          </p>
        ) : wishes.length === 0 ? (
          <p className="text-navy-soft py-8 text-center text-sm">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          <ul className="space-y-4">
            {wishes.map((w) => (
              <motion.li
                key={w.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.random() * 0.3 }}
                className="rounded-xl border border-[rgba(201,169,110,0.2)] bg-white p-4 shadow-[var(--shadow-elevra-sm)]"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <img
                      src="/1767596045599-1-e1767597019816.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="text-gold truncate text-sm font-semibold sm:text-base">
                          {w.name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                            w.attendance === "hadir"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {w.attendance === "hadir" ? "Hadir" : "Tidak Hadir"}
                        </span>
                      </div>
                    </div>
                    <p className="text-navy-soft text-sm leading-relaxed">
                      {w.message}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

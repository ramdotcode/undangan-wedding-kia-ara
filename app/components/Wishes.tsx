"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Wish {
  id: string;
  name: string;
  message: string;
  attendance: "hadir" | "tidak" | "";
}

const seedWishes: Wish[] = [
  {
    id: "1",
    name: "Budi & Keluarga",
    message:
      "Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah. Aamiin.",
    attendance: "hadir",
  },
  {
    id: "2",
    name: "Sari",
    message:
      "Barakallahu lakuma wa baraka 'alaikuma wa jama'a baynakuma fii khair.",
    attendance: "hadir",
  },
  {
    id: "3",
    name: "Ahmad & Dewi",
    message:
      "Selamat dan sukses untuk pernikahannya, semoga langgeng sampai akhir hayat.",
    attendance: "hadir",
  },
  {
    id: "4",
    name: "Rina",
    message: "Semoga menjadi keluarga yang bahagia dunia akhirat. Aamiin.",
    attendance: "hadir",
  },
  {
    id: "5",
    name: "Pak RT",
    message:
      "Selamat menempuh hidup baru, semoga diberikan keturunan yang sholeh sholeha.",
    attendance: "hadir",
  },
  {
    id: "6",
    name: "Teman Kantor",
    message:
      "Barakallah untuk Kia & Ara, semoga menjadi keluarga sakinah.",
    attendance: "tidak",
  },
  {
    id: "7",
    name: "Keluarga Besar Ciamis",
    message:
      "Turut berbahagia atas pernikahan Kia & Ara. Semoga selalu dalam lindungan Allah SWT.",
    attendance: "hadir",
  },
];

/**
 * Section ucapan / guestbook. Untuk versi produksi, sambungkan ke
 * backend (Supabase / Firebase / API route Next.js). Saat ini pakai
 * local state + seed data.
 */
export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak">("hadir");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);

    // simulasi submit
    setTimeout(() => {
      setWishes((prev) => [
        {
          id: String(Date.now()),
          name: name.trim(),
          message: message.trim(),
          attendance,
        },
        ...prev,
      ]);
      setName("");
      setMessage("");
      setAttendance("hadir");
      setSubmitting(false);
    }, 400);
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white shadow transition-opacity disabled:opacity-60"
        >
          {submitting ? "Mengirim..." : "Kirim Ucapan"}
        </button>
      </motion.form>

      {/* Wishes list */}
      <div style={{ height: "400px" }} className="overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-track]:bg-transparent">
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
      </div>
    </div>
  );
}

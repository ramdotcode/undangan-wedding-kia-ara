"use client";

import { motion } from "framer-motion";

interface QuoteProps {
  text: string;
  source?: string;
}

/**
 * Section pembuka setelah cover.
 * Menampilkan quote Islami (Ar-Rum) dengan font Aston Script.
 */
export default function Quote({ text, source }: QuoteProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="text-aston text-navy text-xl leading-relaxed sm:text-2xl"
        style={{ fontWeight: 400 }}
      >
        {text}
      </motion.p>
      {source ? (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-[var(--color-gold)] text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-xs"
          style={{ fontFamily: "var(--font-trajanpro)" }}
        >
          — {source} —
        </motion.p>
      ) : null}
    </div>
  );
}

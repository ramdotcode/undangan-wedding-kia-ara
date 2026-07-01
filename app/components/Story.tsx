"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StoryItem {
  title: string;
  date?: string;
  text: string;
  imageSrc?: string;
}

interface StoryProps {
  items: StoryItem[];
}

/**
 * Love Story — vertical timeline dengan foto opsional di tiap item.
 */
export default function Story({ items }: StoryProps) {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Vertical line */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent"
      />

      <ul className="space-y-12">
        {items.map((item, idx) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
            className="relative pl-12"
          >
            {/* Dot on the line */}
            <span
              aria-hidden
              className="absolute left-2.5 top-2 h-3 w-3 rounded-full bg-[var(--color-gold)] ring-4 ring-[var(--color-cream)]"
            />

            <div className="w-full text-left">
              {item.date ? (
                <p className="text-[var(--color-gold)] mb-1 text-xs uppercase tracking-[0.2em]">
                  {item.date}
                </p>
              ) : null}
              <h3 className="font-serif-display text-navy mb-2 text-xl">
                {item.title}
              </h3>
              {item.imageSrc ? (
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 400px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <p className="text-navy-soft text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

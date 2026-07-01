"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ParentInfo {
  name: string;
  desc?: string;
}

interface PersonProps {
  role: string; // "The Groom" / "The Bride"
  name: string;
  fullName?: string;
  parents?: string;
  description?: string;
  father?: ParentInfo;
  mother?: ParentInfo;
  photoSrc: string;
  instagram?: string;
}

/**
 * Komponen untuk satu mempelai (groom atau bride).
 */
function PersonCard({
  role,
  name,
  parents,
  description,
  father,
  mother,
  photoSrc,
  instagram,
}: PersonProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-gold-dark mb-3 text-xs font-medium uppercase tracking-[0.25em]"
      >
        {role}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mb-4 h-40 w-40 overflow-hidden rounded-full ring-2 ring-[var(--color-gold)] ring-offset-4 ring-offset-[var(--color-cream)] sm:h-44 sm:w-44"
      >
        <Image
          src={photoSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 160px, 180px"
          className="object-cover"
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-navy mb-1 text-lg sm:text-xl font-semibold"
        style={{ fontFamily: "var(--font-trajanpro)" }}
      >
        {name}
      </motion.h3>

      {father || parents ? (
        <p className="text-navy-soft mt-4 text-xs sm:text-sm">{role === "The Groom" ? "Putra dari:" : "Putri dari:"}</p>
      ) : null}
      {father ? (
        <div className="text-navy-soft space-y-1 text-sm sm:text-base">
          <p className="font-semibold">{father.name}</p>
          {father.desc ? (
            <p className="text-xs italic sm:text-sm">{father.desc}</p>
          ) : null}
        </div>
      ) : parents ? (
        <p className="text-navy-soft text-sm sm:text-base">{parents}</p>
      ) : null}

      {father && mother ? (
        <p className="text-navy-soft/60 my-1.5 text-xs">&amp;</p>
      ) : null}

      {mother ? (
        <div className="text-navy-soft space-y-1 text-sm sm:text-base">
          <p className="font-semibold">{mother.name}</p>
          {mother.desc ? (
            <p className="text-xs italic sm:text-sm">{mother.desc}</p>
          ) : null}
        </div>
      ) : null}

      {description ? (
        <p className="text-navy-soft mt-2 text-xs italic sm:text-sm">
          {description}
        </p>
      ) : null}

      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/30 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          Instagram
        </a>
      ) : null}
    </div>
  );
}

interface CoupleProps {
  groom: Omit<PersonProps, "role">;
  bride: Omit<PersonProps, "role">;
}

/**
 * Section mempelai: groom & bride berdampingan dengan "&" di tengah.
 */
export { PersonCard };
export default function Couple({ groom, bride }: CoupleProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <PersonCard role="The Groom" {...groom} />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-serif-display text-gold text-5xl"
      >
        &amp;
      </motion.div>
      <PersonCard role="The Bride" {...bride} />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { SakuraBranch, SmallBlossom } from "./decor/Flowers";

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
 * Style "mirror cover" — nama pakai font Aston (script) yang sama dengan
 * cover, divider gold di atas nama, frame foto elegan dengan ring gold.
 * Tidak pakai flower overlay di foto (versi minimalis).
 */
function PersonCard({
  role,
  name,
  fullName,
  parents,
  description,
  father,
  mother,
  photoSrc,
  instagram,
}: PersonProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Role label — TrajanPro uppercase, gold */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[var(--color-gold)] mb-3 text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm"
        style={{ fontFamily: "var(--font-trajanpro)" }}
      >
        {role}
      </motion.p>

      {/* Frame foto — oval besar dengan ring gold + shadow elegan */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mb-5 h-52 w-44 overflow-hidden rounded-full ring-2 ring-[var(--color-gold)] ring-offset-4 ring-offset-[var(--color-cream)] shadow-[0_8px_30px_rgba(30,42,74,0.18)] sm:h-56 sm:w-48"
        style={{ borderRadius: "9999px" }}
      >
        <Image
          src={photoSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 192px, 224px"
          className="object-cover"
        />
      </motion.div>

      {/* Divider gold kecil di atas nama */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-3 flex items-center gap-2"
      >
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
      </motion.div>

      {/* Nama — Aston script, navy, ukuran besar (mirror cover) */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="text-navy mb-1 text-3xl leading-tight sm:text-4xl"
        style={{ fontFamily: "var(--font-aston)", fontWeight: 400 }}
      >
        {name}
      </motion.h3>

      {/* Nama panjang / gelar — TrajanPro kecil */}
      {fullName ? (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-navy-soft mt-1 text-[10px] uppercase tracking-[0.2em] sm:text-xs"
          style={{ fontFamily: "var(--font-trajanpro)" }}
        >
          {fullName}
        </motion.p>
      ) : null}

      {/* Label "Putra/Putri dari" */}
      {father || parents ? (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-navy-soft/80 mt-5 text-[10px] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-trajanpro)" }}
        >
          {role === "The Groom" ? "Putra dari" : "Putri dari"}
        </motion.p>
      ) : null}

      {/* Parent block */}
      {father ? (
        <div className="text-navy-soft space-y-0.5 text-sm sm:text-base">
          <p className="font-semibold">{father.name}</p>
          {father.desc ? (
            <p className="text-xs italic sm:text-sm">{father.desc}</p>
          ) : null}
        </div>
      ) : parents ? (
        <p className="text-navy-soft text-sm sm:text-base">{parents}</p>
      ) : null}

      {father && mother ? (
        <p className="text-navy-soft/50 my-1 text-xs">&amp;</p>
      ) : null}

      {mother ? (
        <div className="text-navy-soft space-y-0.5 text-sm sm:text-base">
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
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-gold)]/40 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
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
 * Section mempelai: groom & bride vertikal dengan "&" dekoratif di tengah.
 * Background section: cream dengan sakura branch SVG subtle di pojok.
 */
export { PersonCard };
export default function Couple({ groom, bride }: CoupleProps) {
  return (
    <div className="relative flex flex-col items-center gap-8 overflow-hidden">
      {/* Dekorasi sakura branch di pojok kiri-atas (subtle) */}
      <SakuraBranch
        variant="white"
        className="pointer-events-none absolute -top-12 -left-16 h-48 w-48 opacity-40 sm:h-56 sm:w-56"
      />
      {/* Dekorasi sakura branch di pojok kanan-bawah (mirror) */}
      <SakuraBranch
        variant="white"
        style={{ transform: "scaleX(-1)" }}
        className="pointer-events-none absolute -bottom-12 -right-16 h-48 w-48 opacity-40 sm:h-56 sm:w-56"
      />

      {/* Small blossoms taburan */}
      <SmallBlossom
        color="white"
        size={28}
        className="pointer-events-none absolute top-12 right-8 opacity-50 sm:right-16"
      />
      <SmallBlossom
        color="white"
        size={22}
        className="pointer-events-none absolute bottom-24 left-6 opacity-45 sm:left-12"
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <PersonCard role="The Groom" {...groom} />

        {/* Divider "&" di tengah — dengan ornament gold di atas & bawah */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
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
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
          </div>
          <span
            className="text-[var(--color-gold)] text-5xl italic sm:text-6xl"
            style={{ fontFamily: "var(--font-clarissa)", fontWeight: 400 }}
          >
            &amp;
          </span>
          <div className="flex items-center gap-2">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
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
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
          </div>
        </motion.div>

        <PersonCard role="The Bride" {...bride} />
      </div>
    </div>
  );
}

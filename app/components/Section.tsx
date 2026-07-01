"use client";

import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  bg?: "cream" | "dark" | "white" | "transparent";
}

const bgMap = {
  cream: "bg-gradient-cream",
  dark: "bg-gradient-hero",
  white: "bg-white",
  transparent: "bg-transparent",
};

/**
 * Wrapper untuk tiap section. Menambahkan animasi fade-in
 * saat masuk viewport.
 */
export default function Section({
  id,
  children,
  className = "",
  bg = "cream",
}: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`${bgMap[bg]} ${className}`}
    >
      <div className="section-container">{children}</div>
    </motion.section>
  );
}

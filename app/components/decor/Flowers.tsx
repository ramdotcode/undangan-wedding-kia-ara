/**
 * Komponen dekoratif bunga-bunga (sakura, peony, hydrangea) dalam bentuk SVG inline.
 *
 * - Tidak menambah network request (SVG dirender langsung di markup).
 * - Skala responsif karena setiap SVG punya viewBox sendiri.
 * - Tipis: path/ellipse sederhana, tidak ada filter berat.
 *
 * Catatan SSR: semua koordinat turunan Math.cos/Math.sin dibulatkan ke 2 desimal
 * via helper `n()` agar identical antara server-render (Node) dan client-hydrate (browser).
 * Tanpa pembulatan, presisi floating-point berbeda → React hydration mismatch.
 *
 * Cara pakai:
 *   <SakuraBranch className="absolute -top-10 -left-10 w-64 h-64" />
 *   <Peony className="absolute bottom-0 right-0 w-40 h-40" color="white" />
 */

import type { CSSProperties, SVGProps } from "react";

/** Bulatkan ke 2 desimal → output string deterministik untuk SSR. */
function n(value: number): string {
  return value.toFixed(2);
}

/* ============================================================
 * 1. SAKURA BRANCH
 *    Cabang melengkung dengan 6–8 bunga 5-petal pink + putik.
 * ============================================================ */

interface SakuraBranchProps extends SVGProps<SVGSVGElement> {
  className?: string;
  style?: CSSProperties;
  /** Variasi warna kelopak: pink (default) | white | deep */
  variant?: "pink" | "white" | "deep";
}

export function SakuraBranch({
  className,
  style,
  variant = "pink",
  ...rest
}: SakuraBranchProps) {
  const petal =
    variant === "white"
      ? "#fff5f8"
      : variant === "deep"
        ? "#e88aa8"
        : "#f4c2d7";
  const petalEdge =
    variant === "white"
      ? "#f4c2d7"
      : variant === "deep"
        ? "#c25a82"
        : "#e89bbb";

  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {/* Cabang utama */}
      <path
        d="M 20 300 Q 100 240 160 180 T 300 40"
        stroke="#7a5a3a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* Cabang kecil */}
      <path
        d="M 90 250 Q 110 230 130 220"
        stroke="#7a5a3a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 170 170 Q 200 160 220 150"
        stroke="#7a5a3a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Bunga-bunga sakura: 5 petal + putik */}
      {[
        { cx: 50, cy: 270, r: 14 },
        { cx: 110, cy: 230, r: 16 },
        { cx: 160, cy: 180, r: 18 },
        { cx: 210, cy: 140, r: 16 },
        { cx: 255, cy: 100, r: 15 },
        { cx: 290, cy: 55, r: 14 },
        { cx: 135, cy: 220, r: 12 },
        { cx: 200, cy: 150, r: 11 },
      ].map((b, i) => {
        const petals = Array.from({ length: 5 }, (_, k) => {
          const angle = (k * 72 * Math.PI) / 180;
          const px = n(b.cx + Math.cos(angle) * b.r * 0.7);
          const py = n(b.cy + Math.sin(angle) * b.r * 0.7);
          return (
            <ellipse
              key={k}
              cx={px}
              cy={py}
              rx={n(b.r * 0.6)}
              ry={n(b.r * 0.45)}
              transform={`rotate(${(k * 72) + 90} ${px} ${py})`}
              fill={petal}
              stroke={petalEdge}
              strokeWidth="0.6"
              opacity="0.95"
            />
          );
        });
        return (
          <g key={i}>
            {petals}
            <circle cx={b.cx} cy={b.cy} r={n(b.r * 0.25)} fill="#f7e07a" />
            <circle cx={b.cx} cy={b.cy} r={n(b.r * 0.12)} fill="#d4a82a" />
          </g>
        );
      })}

      {/* Daun kecil */}
      <ellipse
        cx="140"
        cy="195"
        rx="8"
        ry="3"
        transform="rotate(-30 140 195)"
        fill="#7da86a"
        opacity="0.6"
      />
      <ellipse
        cx="225"
        cy="130"
        rx="8"
        ry="3"
        transform="rotate(-45 225 130)"
        fill="#7da86a"
        opacity="0.6"
      />
    </svg>
  );
}

/* ============================================================
 * 2. PEONY
 *    Bunga peony berlapis: outer petals + inner cluster.
 * ============================================================ */

interface PeonyProps extends SVGProps<SVGSVGElement> {
  className?: string;
  style?: CSSProperties;
  /** Variasi warna: pink (default) | blush | white */
  color?: "pink" | "blush" | "white";
}

export function Peony({
  className,
  style,
  color = "pink",
  ...rest
}: PeonyProps) {
  const outer =
    color === "white"
      ? "#fff5f8"
      : color === "blush"
        ? "#f8d4d8"
        : "#e8a4b8";
  const mid =
    color === "white"
      ? "#fde2e8"
      : color === "blush"
        ? "#f0b8c0"
        : "#dc8aa3";
  const inner =
    color === "white"
      ? "#f9c8d2"
      : color === "blush"
        ? "#e89aab"
        : "#c46a87";
  const center = "#f7e07a";

  const outerPetals = Array.from({ length: 12 }, (_, k) => {
    const angle = (k * 30 * Math.PI) / 180;
    const cx = n(100 + Math.cos(angle) * 36);
    const cy = n(100 + Math.sin(angle) * 36);
    return (
      <ellipse
        key={`o${k}`}
        cx={cx}
        cy={cy}
        rx="22"
        ry="14"
        transform={`rotate(${(k * 30) + 90} ${cx} ${cy})`}
        fill={outer}
        opacity="0.95"
      />
    );
  });

  const midPetals = Array.from({ length: 9 }, (_, k) => {
    const angle = (k * 40 * Math.PI) / 180;
    const cx = n(100 + Math.cos(angle) * 22);
    const cy = n(100 + Math.sin(angle) * 22);
    return (
      <ellipse
        key={`m${k}`}
        cx={cx}
        cy={cy}
        rx="16"
        ry="10"
        transform={`rotate(${(k * 40) + 90} ${cx} ${cy})`}
        fill={mid}
        opacity="0.95"
      />
    );
  });

  const innerPetals = Array.from({ length: 6 }, (_, k) => {
    const angle = (k * 60 * Math.PI) / 180;
    const cx = n(100 + Math.cos(angle) * 10);
    const cy = n(100 + Math.sin(angle) * 10);
    return (
      <ellipse
        key={`i${k}`}
        cx={cx}
        cy={cy}
        rx="10"
        ry="6"
        transform={`rotate(${(k * 60) + 90} ${cx} ${cy})`}
        fill={inner}
        opacity="0.95"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {outerPetals}
      {midPetals}
      {innerPetals}
      <circle cx="100" cy="100" r="6" fill={center} />
    </svg>
  );
}

/* ============================================================
 * 3. HYDRANGEA
 *    Kumpulan 4-petals kecil membentuk bola bunga hydrangea.
 * ============================================================ */

interface HydrangeaProps extends SVGProps<SVGSVGElement> {
  className?: string;
  style?: CSSProperties;
  /** Variasi warna: blue (default) | white | purple | pink */
  color?: "blue" | "white" | "purple" | "pink";
}

export function Hydrangea({
  className,
  style,
  color = "blue",
  ...rest
}: HydrangeaProps) {
  const petal =
    color === "white"
      ? "#fdfdfd"
      : color === "purple"
        ? "#b8a8d4"
        : color === "pink"
          ? "#f0c4d4"
          : "#a8c5e0";
  const petalEdge =
    color === "white"
      ? "#d0d8e0"
      : color === "purple"
        ? "#8a7aaa"
        : color === "pink"
          ? "#d8a0b8"
          : "#7a9cc0";

  // Posisi blossom (konstanta integer — tidak ada risiko mismatch)
  const blossoms = [
    { cx: 100, cy: 50 },
    { cx: 150, cy: 70 },
    { cx: 175, cy: 115 },
    { cx: 160, cy: 160 },
    { cx: 120, cy: 180 },
    { cx: 80, cy: 175 },
    { cx: 50, cy: 145 },
    { cx: 35, cy: 100 },
    { cx: 55, cy: 60 },
    { cx: 100, cy: 90 },
    { cx: 130, cy: 110 },
    { cx: 100, cy: 130 },
    { cx: 80, cy: 110 },
    { cx: 130, cy: 70 },
    { cx: 70, cy: 70 },
  ];

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {blossoms.map((b, i) => {
        const petals = Array.from({ length: 4 }, (_, k) => {
          const angle = (k * 90 * Math.PI) / 180;
          const px = n(b.cx + Math.cos(angle) * 7);
          const py = n(b.cy + Math.sin(angle) * 7);
          return (
            <circle
              key={k}
              cx={px}
              cy={py}
              r="7"
              fill={petal}
              stroke={petalEdge}
              strokeWidth="0.5"
              opacity="0.95"
            />
          );
        });
        return (
          <g key={i}>
            {petals}
            <circle cx={b.cx} cy={b.cy} r="2" fill={petalEdge} opacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
 * 4. SMALL BLOSSOM
 *    Bunga tunggal 5-petal kecil, untuk taburan / dekorasi.
 * ============================================================ */

interface SmallBlossomProps extends SVGProps<SVGSVGElement> {
  className?: string;
  style?: CSSProperties;
  color?: "pink" | "white" | "blue";
  size?: number;
}

export function SmallBlossom({
  className,
  style,
  color = "pink",
  size = 40,
  ...rest
}: SmallBlossomProps) {
  const petal =
    color === "white"
      ? "#fff5f8"
      : color === "blue"
        ? "#c8dceb"
        : "#f4c2d7";
  const edge =
    color === "white"
      ? "#f4c2d7"
      : color === "blue"
        ? "#9ab8d0"
        : "#e89bbb";

  const petals = Array.from({ length: 5 }, (_, k) => {
    const angle = ((k * 72 - 90) * Math.PI) / 180;
    const px = n(50 + Math.cos(angle) * 16);
    const py = n(50 + Math.sin(angle) * 16);
    return (
      <ellipse
        key={k}
        cx={px}
        cy={py}
        rx="14"
        ry="9"
        transform={`rotate(${k * 72} ${px} ${py})`}
        fill={petal}
        stroke={edge}
        strokeWidth="0.6"
        opacity="0.95"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      {petals}
      <circle cx="50" cy="50" r="5" fill="#f7e07a" />
    </svg>
  );
}

/* ============================================================
 * 5. FALLING PETAL
 *    Kelopak tunggal yang digunakan untuk animasi melayang.
 *    (Diberi animate dari parent / framer-motion)
 *    Path-nya konstan, tidak ada math dinamis → tidak butuh pembulatan.
 * ============================================================ */

interface FallingPetalProps extends SVGProps<SVGSVGElement> {
  className?: string;
  style?: CSSProperties;
  color?: "pink" | "white" | "deep";
}

export function FallingPetal({
  className,
  style,
  color = "pink",
  ...rest
}: FallingPetalProps) {
  const fill =
    color === "white"
      ? "#fff5f8"
      : color === "deep"
        ? "#e88aa8"
        : "#f4c2d7";
  const edge =
    color === "white"
      ? "#f4c2d7"
      : color === "deep"
        ? "#c25a82"
        : "#e89bbb";

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M 20 4 Q 32 12 30 22 Q 28 32 20 36 Q 12 32 10 22 Q 8 12 20 4 Z"
        fill={fill}
        stroke={edge}
        strokeWidth="0.5"
        opacity="0.9"
      />
      <path
        d="M 20 6 L 20 34"
        stroke={edge}
        strokeWidth="0.4"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}

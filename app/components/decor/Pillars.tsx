/**
 * Pilar dekoratif gaya klasik (Romawi/Yunani) dalam SVG inline.
 * Dipasang di sisi kiri dan kanan cover sebagai tekstur subtle
 * (opacity rendah), supaya tidak mendominasi konten utama.
 *
 * Tidak menambah network request.
 */

import type { CSSProperties, SVGProps } from "react";

interface PillarProps extends SVGProps<SVGSVGElement> {
  className?: string;
  style?: CSSProperties;
  /** Arah hadap pilar: "left" (default) atau "right" */
  side?: "left" | "right";
}

/**
 * Pilar vertikal: base, shaft, capital.
 * viewBox proporsional 80 x 600, bisa di-stretch sesuai container.
 */
export default function Pillar({
  className,
  style,
  side = "left",
  ...rest
}: PillarProps) {
  // mirror untuk sisi kanan
  const transform = side === "right" ? "scale(-1, 1) translate(-80, 0)" : "";

  return (
    <svg
      viewBox="0 0 80 600"
      preserveAspectRatio="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...rest}
    >
      <g transform={transform} fill="#ffffff" opacity="0.55">
        {/* Base — lebar di bawah */}
        <rect x="6" y="560" width="68" height="14" rx="1" />
        <rect x="2" y="574" width="76" height="20" rx="1" />
        <rect x="0" y="594" width="80" height="6" />

        {/* Torus (cincin dekoratif di atas base) */}
        <rect x="12" y="552" width="56" height="8" />

        {/* Shaft — badan pilar dengan flute (cekungan vertikal) */}
        <rect x="16" y="80" width="48" height="472" />
        {/* Flute lines (garis vertikal tipis) */}
        {[20, 28, 36, 44, 52, 60].map((x) => (
          <rect
            key={x}
            x={x}
            y="90"
            width="2"
            height="460"
            fill="#e8eef5"
            opacity="0.6"
          />
        ))}

        {/* Capital (kepala pilar) */}
        <rect x="12" y="64" width="56" height="8" />
        <rect x="8" y="48" width="64" height="16" />
        <rect x="14" y="36" width="52" height="12" />
        <rect x="10" y="22" width="60" height="14" />
        <rect x="2" y="10" width="76" height="12" />
        <rect x="0" y="0" width="80" height="10" />

        {/* Detail bayangan subtle */}
        <rect x="16" y="80" width="4" height="472" fill="#e8eef5" opacity="0.7" />
        <rect x="60" y="80" width="4" height="472" fill="#e8eef5" opacity="0.4" />
      </g>
    </svg>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Custom font dari folder Einve (file ada di /public)
const helloParis = localFont({
  src: "../public/4337Hello-Paris.woff.woff2",
  variable: "--font-hello-paris",
  display: "swap",
  weight: "400",
});

const clarissa = localFont({
  src: "../public/6939Clarissa.woff2",
  variable: "--font-clarissa",
  display: "swap",
  weight: "400",
});

const trajanPro = localFont({
  src: "../public/2975TrajanPro.woff.woff2",
  variable: "--font-trajanpro",
  display: "swap",
  weight: "400",
});

const astonScript = localFont({
  src: "../public/1689Aston-Script.woff2",
  variable: "--font-aston-script",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Wedding Of Kia & Ara - Elevra",
  description:
    "Rabu, 08 Juli 2026. Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.",
  openGraph: {
    title: "The Wedding Of Kia & Ara - Elevra",
    description:
      "Rabu, 08 Juli 2026. Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.",
    type: "article",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${helloParis.variable} ${clarissa.variable} ${trajanPro.variable} ${astonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

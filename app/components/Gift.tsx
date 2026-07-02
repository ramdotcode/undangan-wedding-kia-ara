"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface GiftProps {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankLogoSrc?: string;
  bankName2?: string;
  accountNumber2?: string;
  accountHolder2?: string;
  bankLogoSrc2?: string;
}

function BankCard({
  bankName,
  accountNumber,
  accountHolder,
  bankLogoSrc,
}: {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankLogoSrc?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.createElement("textarea");
      el.value = accountNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className="rounded-xl border border-[rgba(201,169,110,0.25)] bg-white/80 p-5 text-center shadow-sm">
      {bankLogoSrc ? (
        <div className="mx-auto mb-2 h-8 w-24">
          <img
            src={bankLogoSrc}
            alt={bankName}
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <p className="font-serif-display text-gold-dark mb-2 text-xs uppercase tracking-[0.2em]">
          {bankName}
        </p>
      )}
      <p className="font-serif-display text-dark mb-1 text-lg sm:text-xl">
        {accountNumber}
      </p>
      <p className="text-dark-soft mb-4 text-xs">a.n. {accountHolder}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white shadow transition-opacity"
      >
        {copied ? "✓ Tersalin" : "Salin Nomor Rekening"}
      </button>
    </div>
  );
}

export default function Gift({
  bankName,
  accountNumber,
  accountHolder,
  bankLogoSrc,
  bankName2,
  accountNumber2,
  accountHolder2,
  bankLogoSrc2,
}: GiftProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md"
    >
      <p className="text-dark-soft mb-6 text-sm leading-relaxed">
        Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika
        memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara
        cashless.
      </p>

      <div className="space-y-4">
        <BankCard
          bankName={bankName}
          accountNumber={accountNumber}
          accountHolder={accountHolder}
          bankLogoSrc={bankLogoSrc}
        />
        {bankName2 && accountNumber2 ? (
          <BankCard
            bankName={bankName2}
            accountNumber={accountNumber2}
            accountHolder={accountHolder2 ?? accountHolder}
            bankLogoSrc={bankLogoSrc2}
          />
        ) : null}
      </div>
    </motion.div>
  );
}

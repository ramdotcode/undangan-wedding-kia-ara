"use client";

import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapUrl?: string;
}

function EventCard({
  title,
  date,
  time,
  location,
  address,
  mapUrl,
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-[rgba(201,169,110,0.25)] bg-white/60 p-6 text-center shadow-[var(--shadow-elevra-sm)] backdrop-blur sm:p-8"
    >
      <h3 className="font-serif-display text-gold mb-2 text-2xl tracking-[0.12em] sm:text-3xl">
        {title}
      </h3>
      <p className="text-navy-soft mb-1 text-sm uppercase tracking-[0.15em]">
        {date}
      </p>
      <p className="text-navy-soft mb-4 text-sm uppercase tracking-[0.15em]">
        {time}
      </p>
      <p className="font-serif-display text-gold text-lg sm:text-xl">
        {location}
      </p>
      <p className="text-navy-soft/80 mt-2 px-2 text-xs sm:text-sm">
        {address}
      </p>
      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full border-2 border-[var(--color-gold)] px-6 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
        >
          Kunjungi Lokasi
        </a>
      ) : null}
    </motion.div>
  );
}

interface EventsProps {
  events: EventCardProps[];
}

export default function Events({ events }: EventsProps) {
  return (
    <div className="mx-auto grid max-w-md gap-6">
      {events.map((ev) => (
        <EventCard key={ev.title} {...ev} />
      ))}
    </div>
  );
}

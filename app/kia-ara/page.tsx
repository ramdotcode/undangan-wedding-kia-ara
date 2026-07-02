"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import Image from "next/image";
import Cover from "../components/Cover";
import Section from "../components/Section";
import Quote from "../components/Quote";
import Couple, { PersonCard } from "../components/Couple";
import Events from "../components/Events";
import Story from "../components/Story";
import Gallery from "../components/Gallery";
import Wishes from "../components/Wishes";
import Gift from "../components/Gift";
import Countdown from "../components/Countdown";

/**
 * Halaman utama undangan. Saat pertama load, body di-lock dan
 * halaman Cover tampil fullscreen. Klik "Buka Undangan" -> unlock.
 */

const slideshowImages = [
  "/Kia-Ervin-080726-7.jpg",
  "/Kia-Ervin-080726-2.jpg",
  "/Kia-Ervin-080726-4.jpg",
  "/Kia-Ervin-080726-10.jpg",
];

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to")?.trim() || undefined;

  const [isLocked, setIsLocked] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play slideshow setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function handleOpen() {
    setIsLocked(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  }

  function toggleAudio() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#faf6f0]">
      {/* Audio backsound (opsional, file ada di /public) */}
      <audio
        ref={audioRef}
        src="/A-Whole-New-World-Shoba-Narayan.mp3"
        loop
        preload="none"
      />

      {/* Tombol pause/play audio */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-95"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-navy">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-navy">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* LEFT SIDE: Slideshow (Desktop Only) */}
      <div className="relative hidden h-full flex-1 overflow-hidden bg-navy md:flex">
        {/* Animated background slides */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slideshowImages[currentSlide]}
              alt="Kia & Ara pre-wedding"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Elegant typography overlay */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-16">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-[var(--color-gold)]/60" />
            <p
              className="text-[var(--color-gold)] text-xs font-semibold uppercase tracking-[0.45em]"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              Wedding Invitation
            </p>
          </div>

          <div className="max-w-lg">
            <p
              className="text-[var(--color-gold)] text-sm uppercase tracking-[0.2em] mb-3"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              The Wedding Of
            </p>
            <h1
              className="text-white text-5xl leading-tight mb-3 sm:text-7xl"
              style={{ fontFamily: "var(--font-aston)", fontWeight: 400 }}
            >
              Kia <span className="text-[var(--color-gold)] italic" style={{ fontFamily: "var(--font-clarissa)" }}>&amp;</span> Ara
            </h1>
            <p
              className="text-white/80 text-sm uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "var(--font-trajanpro)" }}
            >
              Rabu, 08 Juli 2026
            </p>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
            </p>
          </div>

          <p className="text-white/40 text-xs tracking-[0.25em] uppercase">
            Elevra Theme
          </p>
        </div>

        {/* Dynamic decorative border line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
      </div>

      {/* RIGHT SIDE: The Mobile Invitation Container */}
      <div
        className={`relative h-full w-full md:w-[450px] md:shadow-[0_0_40px_rgba(0,0,0,0.15)] flex flex-col bg-cream transition-all duration-300 ${isLocked ? "overflow-hidden" : "overflow-y-auto scroll-smooth"
          }`}
      >
        {/* Cover — hanya tampil saat isLocked */}
        <AnimatePresence>
          {isLocked && (
            <Cover
              coupleName="Kia & Ara"
              date="Rabu, 08 Juli 2026"
              photoSrc="/Kia-Ervin-080726-7.jpg"
              guestName={guestName}
              onOpen={handleOpen}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <main
          className={`${isLocked ? "invisible h-0 overflow-hidden" : "relative w-full"}`}
          aria-hidden={isLocked}
        >
          {/* 1. Quote pembuka (Ar-Rum) */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-quote.jpeg"
                alt="Quote Background"
                fill
                priority
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            {/* Overlay cream tipis agar teks tetap terbaca (sama dengan section 2) */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="quote" bg="transparent" className="relative z-10 text-center">
              <p
                className="text-[var(--color-gold)] mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                ﷽
              </p>

              {/* Divider gold kecil dengan ornament berlian (sama dengan section 2) */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-2"
              >
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className="text-[var(--color-gold)]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5 0 L7 5 L5 10 L3 5 Z" />
                </svg>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
              </motion.div>

              <Quote
                text="Maha suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan. Ya Allah, rahmatilah pernikahan kami."
              />
            </Section>
          </div>

          {/* 2. Salam pembuka — tema bunga konsisten dengan cover */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            {/* Background image dengan opacity rendah (sama dengan section Quote) */}
            <div className="absolute inset-0">
              <Image
                src="/BG-quote.jpeg"
                alt="Opening Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            {/* Overlay cream tipis agar teks tetap terbaca */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="opening" bg="transparent" className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-xl"
              >
                <p
                  className="text-[var(--color-gold)] mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ fontFamily: "var(--font-trajanpro)" }}
                >
                  You Are Invited!
                </p>

                <h2
                  className="text-navy mb-4 text-2xl sm:text-3xl uppercase tracking-[0.3em] font-semibold"
                  style={{ fontFamily: "var(--font-trajanpro)" }}
                >
                  The Wedding Of
                </h2>

                {/* Divider gold kecil dengan ornament berlian */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4 flex items-center justify-center gap-2"
                >
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    className="text-[var(--color-gold)]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5 0 L7 5 L5 10 L3 5 Z" />
                  </svg>
                  <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
                </motion.div>

                <p
                  className="text-navy mb-6 text-3xl sm:text-4xl"
                  style={{ fontFamily: "var(--font-aston)", fontWeight: 400 }}
                >
                  <span>Kia</span>
                  <span
                    className="text-[var(--color-gold)] italic"
                    style={{ fontFamily: "var(--font-clarissa)" }}
                  >
                    &nbsp;&amp;&nbsp;
                  </span>
                  <span>Ara</span>
                </p>

                <p className="text-navy-soft mb-2 text-sm sm:text-base leading-relaxed">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila
                  Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
                </p>

                {/* Divider heart kecil */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-5 flex items-center justify-center gap-2"
                >
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    className="text-[var(--color-gold)]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
                </motion.div>

                <p
                  className="text-[var(--color-gold)] mt-4 text-xs uppercase tracking-[0.25em] font-semibold"
                  style={{ fontFamily: "var(--font-trajanpro)" }}
                >
                  — Kia &amp; Ara —
                </p>
              </motion.div>
            </Section>
          </div>

          {/* 3. Mempelai - Groom */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-photo.jpeg"
                alt="Groom Background"
                fill
                unoptimized
                className="object-cover object-top opacity-50"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="groom" bg="transparent" className="relative z-10 text-center">
              <PersonCard
                role="The Groom"
                name="Kia"
                fullName="Mochamad Rizkia Genggam Perkasa, S. Pd."
                father={{
                  name: "Bapak Drs. Iskandar",
                  desc: "Purna Eks Dosen Universitas Muhamadiyah Kuningan, Guru SMPN 1 Sindangagung",
                }}
                mother={{
                  name: "Satila, S. Pd.",
                  desc: "Guru SMAN 24 Bandung",
                }}
                instagram="https://www.instagram.com/rzkiagp/"
                photoSrc="/Kia-Ervin-080726-12.jpg"
              />
            </Section>
          </div>

          {/* 4. Mempelai - Bride */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-photo.jpeg"
                alt="Bride Background"
                fill
                unoptimized
                className="object-cover object-top opacity-50"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="bride" bg="transparent" className="relative z-10 text-center">
              <PersonCard
                role="The Bride"
                name="Ara"
                fullName="Ervina Maharani, S. Pd."
                father={{
                  name: "H. Dede Sukmara, B.A.",
                  desc: "Purna Eks Kabag Dinas Perhubungan Kabupaten Ciamis",
                }}
                mother={{
                  name: "Hj. Nanih Nurhayati, S. Pd.",
                  desc: "Purna Guru SDN 1 Margaharja",
                }}
                instagram="https://www.instagram.com/ervina_zilla_maharani/"
                photoSrc="/Kia-Ervin-080726-10.jpg"
              />
            </Section>
          </div>

          {/* 5. Countdown dinamis ke hari H — tema bunga konsisten cover */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-quote.jpeg"
                alt="Countdown Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="countdown" bg="transparent" className="relative z-10 text-center">
              <Countdown
                // Akad nikah: Rabu, 08 Juli 2026 pukul 08:00 WIB
                targetDate="2026-07-08T08:00:00+07:00"
                title="Menuju Hari Bahagia"
                dateLabel="Rabu, 08 Juli 2026"
              />
            </Section>
          </div>

          {/* 6. Save the date / events */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-quote.jpeg"
                alt="Events Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="events" bg="transparent" className="relative z-10 text-center">
              <p
                className="text-[var(--color-gold)] mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Save The Date
              </p>
              <h2
                className="text-navy mb-4 text-2xl uppercase tracking-[0.3em] sm:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Rincian Acara
              </h2>

              {/* Divider gold kecil */}
              <div className="mx-auto mb-8 flex max-w-xs items-center justify-center gap-2">
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

              <Events
                events={[
                  {
                    date: "Rabu, 08 Juli 2026",
                    sessions: [
                      { title: "Akad Nikah", time: "Pukul 08.00 WIB - Selesai" },
                      { title: "Resepsi", time: "Pukul 10.00 WIB - Selesai" },
                    ],
                    location: "Lokasi",
                    address:
                      "Jalan Raya Ciilat - Gardu, Pasar Dongkal, No.19 (Rt.42/Rw.20) Sukadana (Depan Aneka Cellular), Kab. Ciamis, Sukadana, Jawa Barat, ID 46272",
                    mapUrl: "https://maps.app.goo.gl/CtVMBudKyCT7h98B8?g_st=aw",
                  },
                ]}
              />
            </Section>
          </div>

          {/* 7. Love story */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-soft.jpeg"
                alt="Love Story Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="story" bg="transparent" className="relative z-10 text-center">
              <p
                className="text-[var(--color-gold)] mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Our Journey
              </p>
              <h2
                className="text-navy mb-4 text-2xl uppercase tracking-[0.3em] sm:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Love Story
              </h2>
              <Story
                items={[
                  {
                    title: "Pertemuan",
                    date: "17 Juli 2024",
                    text: "Takdir mempertemukan kami dalam sebuah ketidaksengajaan, namun tidak ada satupun yang kebetulan yang terjadi didunia yang luas ini dan pasti pertemuan kami pun sudah disusun rapih oleh sang pencipta, kamu tidak pernah sengaja datang dan aku tidak pernah sengaja mencarimu, tapi takdir menyatukan kami disatu tempat yang sudah ditentukan-Nya. Kami rekan kerja yang sama, 17 Juli 2024 Hari Pertama dia bekerja dan kali pertama kami bertemu. Namun semakin hari saya menatapnya lain, dia merupakan pribadi yang baik, ramah dan sangat dewasa (keibuan). Dari sana saya mulai penasaran dan ingin mengenal nya lebih jauh. Namun saya sama sekali belum punya keberanian untuk berkenalan.",
                  },
                  {
                    title: "Pendekatan",
                    date: "18 Agustus 2024",
                    text: "Saya masih belum berani untuk menyapa langsung, namun pertama kalinya saya mencoba mencari akses dan menghubungi melalui akun sosmednya, kemudian tepat pada 21 Agustus 2024 Pertama kalinya saya memberanikan diri mengajak bertemu untuk makan sore sepulang kerja, tidak ada yang pernah menyangka bahwa pertemuan membawa kami pada ikatan yang suci sampai ditahap ini. Kami menjalani kebersamaan ini hanya dekat tanpa pacaran, hanya kami mempunyai komitmen kuat kalau memang cocok kami sangat ingin sama-sama ke jenjang yang lebih serius, ternyata semakin hari kecocokan semakin kuat diantara kami.",
                  },
                  {
                    title: "Lamaran",
                    date: "25 Desember 2025",
                    text: "Takdir-Nya menuntun kami pada sebuah proses penting dan sakral dengan keyakinan kuat dari kami berdua selama kurang lebih 1 tahun saling mengenal, sebuah pertemuan dua keluarga yang tak pernah disangka hingga akhirnya membawa kami pada sebuah janji suci di momen indah tersebut. Kami melangsungkan acara Lamaran pada 25 Desember 2025.",
                  },
                  {
                    title: "Pernikahan",
                    date: "08 Juli 2026",
                    text: 'Kami selalu yakin, Takdir khususnya tentang jodoh dan adanya pertemuan kami dari awal sampai dititik ini tidak bisa ditawar atau ditukar, saya tidak sengaja mencari dan dia tidak sengaja datang, kami dipertemukan tidak sengaja dalam tempat yang sudah Allah tentukan menjadi takdir kami berdua, bukan karena bertemu lalu berjodoh namun karena berjodoh lah maka kami dipertemukan. Berakhir sudah pencarian jalan cinta dan kami berlabuh di ikatan suci, kami memutuskan untuk mengikrarkan janji suci pernikahan kami pada 08 Juli 2026 insya Allah. "Apa yang menjadi takdirmu akan mencari jalannya menemukanmu". (Ali bin Abi Thalib).',
                  },
                ]}
              />
            </Section>
          </div>

          {/* 8. Galeri */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-photo.jpeg"
                alt="Gallery Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="gallery" bg="transparent" className="relative z-10 text-center">
              <p
                className="text-[var(--color-gold)] mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Our Moments
              </p>
              <h2
                className="text-navy mb-4 text-2xl uppercase tracking-[0.3em] sm:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Our Gallery
              </h2>
              <Gallery
                videoUrl="https://www.youtube.com/embed/y6q2-r_8xsg"
                images={[
                  { src: "/Kia-Ervin-080726-2.jpg", alt: "Kia & Ara" },
                  {
                    src: "/Kia-Ervin-080726-3-rp4cng7z17lqz9tjv44dv0k3afn8qepdzy7ly95n9w.jpg",
                  },
                  { src: "/Kia-Ervin-080726-4.jpg" },
                  {
                    src: "/Kia-Ervin-080726-5-rp4cnj1hlpply3pgenc9khuh2l9cdi0l0c62e31gr8.jpg",
                  },
                  {
                    src: "/Kia-Ervin-080726-6-rp4cnkx5zds6lbmq3o5iphde9d02sw81olh1cmyoes.jpg",
                  },
                  { src: "/Kia-Ervin-080726-7.jpg" },
                  {
                    src: "/Kia-Ervin-080726-8-rp4cnooiqpxbvrh9hps0zgf8mwhjnomz142z9qt3pw.jpg",
                  },
                  {
                    src: "/Kia-Ervin-080726-9-rp4cnpmcxjym7dfwc86njy6p8acwvdqpd8qgr0rpjo.jpg",
                  },
                  { src: "/Kia-Ervin-080726-10.jpg" },
                  {
                    src: "/Kia-Ervin-080726-11-rp4cnri1b816uld618zwoxpmf23nary61i1fpkox78.jpg",
                  },
                  { src: "/Kia-Ervin-080726-12.jpg" },
                  {
                    src: "/Kia-Ervin-080726-14-rp4cnubhg0k6lexlqyhg69ba4jahmctxaatjulmamc.jpg",
                  },
                ]}
              />
            </Section>
          </div>

          {/* 9. Wedding Gift */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-quote.jpeg"
                alt="Wedding Gift Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="gift" bg="transparent" className="relative z-10 text-center">
              <p
                className="text-[var(--color-gold)] mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Wedding Gift
              </p>
              <h2
                className="text-navy mb-4 text-2xl uppercase tracking-[0.3em] sm:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Kirim Hadiah
              </h2>
              <Gift
                bankName="BCA"
                accountNumber="2832322467"
                accountHolder="Satila"
                bankLogoSrc="/bca-1100x346.png"
                bankName2="BJB"
                accountNumber2="0018878781100"
                accountHolder2="Iskandar Drs"
                bankLogoSrc2="/kisspng-logo-bank-bjb-syariah-portable-network-graphics-de-5c650ba4ad6456.4317897615501259887102-300x169.png"
              />
            </Section>
          </div>

          {/* 10. Wishes / Ucapan */}
          <div className="relative overflow-hidden bg-cream border-b border-[var(--color-gold)]/20">
            <div className="absolute inset-0">
              <Image
                src="/BG-soft.jpeg"
                alt="Wishes Background"
                fill
                unoptimized
                className="object-cover object-top opacity-30"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />

            <Section id="wishes" bg="transparent" className="relative z-10 text-center">
              <p
                className="text-[var(--color-gold)] mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Berikan Ucapan
              </p>
              <h2
                className="text-navy mb-4 text-2xl uppercase tracking-[0.3em] sm:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-trajanpro)" }}
              >
                Wishes &amp; Doa
              </h2>
              <p className="text-navy-soft mx-auto mb-8 max-w-md text-sm">
                Berikan ucapan harapan dan doa kepada kedua mempelai
              </p>
              <Wishes />
            </Section>
          </div>

          {/* 11. Footer */}
          <Section id="footer" bg="dark" className="text-center">
            <div className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full ring-2 ring-[var(--color-gold)] ring-offset-4 ring-offset-[#2c2420] sm:h-32 sm:w-32">
              <Image
                src="/Kia-Ervin-080726-4-1024x1536.jpg"
                alt="Kia & Ara"
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]/40" />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="1.5"
                className="opacity-60"
              >
                <path d="M12 2C12 2 8 8 8 12C8 16 12 22 12 22C12 22 16 16 16 12C16 8 12 2 12 2Z" />
                <path d="M12 6C12 6 10 10 10 12C10 14 12 18 12 18C12 18 14 14 14 12C14 10 12 6 12 6Z" fill="var(--color-gold)" opacity="0.3" />
              </svg>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]/40" />
            </div>

            <p className="text-gold-light/80 mx-auto mb-6 max-w-md text-sm leading-relaxed sm:text-base">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas
              kehadiran dan doa restunya, kami mengucapkan terima kasih.
            </p>

            <p className="text-gold-light/60 mb-2 text-xs uppercase tracking-[0.2em]">
              Kami yang berbahagia,
            </p>
            <p className="font-serif-display text-gold mb-3 text-3xl sm:text-4xl">
              Kia &amp; Ara
            </p>
          </Section>
        </main>
      </div>
    </div>
  );
}

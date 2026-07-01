"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GalleryProps {
  images: { src: string; alt?: string }[];
  videoUrl?: string;
}

/**
 * Galeri foto dengan masonry-like grid. Untuk versi polish
 * nanti, bisa diganti library masonry/justified grid.
 */
export default function Gallery({ images, videoUrl }: GalleryProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {videoUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-6 overflow-hidden rounded-xl aspect-video"
        >
          <iframe
            src={videoUrl}
            title="Wedding Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </motion.div>
      ) : null}
      <div className="columns-2 gap-3">
      {images.map((img, idx) => (
        <motion.div
          key={`${img.src}-${idx}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: (idx % 6) * 0.05 }}
          className="mb-3 break-inside-avoid overflow-hidden rounded-xl"
        >
          <div className="relative w-full">
            <Image
              src={img.src}
              alt={img.alt ?? `Gallery ${idx + 1}`}
              width={600}
              height={800}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </motion.div>
      ))}
    </div>
    </div>
  );
}

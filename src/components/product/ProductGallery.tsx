"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Expand, X, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/lib/types";
import { Media } from "../ui/Media";

/** Galeria com zoom por lupa (desktop) e visualização em tela cheia com ampliação (todos os dispositivos). */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {images.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto md:flex-col" aria-label="Miniaturas">
          {images.map((img, i) => (
            <li key={img.url + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-current={i === active}
                className={`relative block h-20 w-16 overflow-hidden border transition-all md:h-24 md:w-20 ${i === active ? "border-gold" : "border-gold/15 opacity-60 hover:opacity-100"}`}
              >
                <Media src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setLens({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setLens(null)}
          className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden border border-gold/10 bg-noir-2"
          aria-label="Ampliar imagem"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={lens ? { transform: "scale(2)", transformOrigin: `${lens.x}% ${lens.y}%` } : undefined}
              >
                <Media src={current?.url} alt={current?.alt || name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </motion.div>
          </AnimatePresence>
          <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 bg-noir/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">
            <Expand className="h-3.5 w-3.5" strokeWidth={1.4} /> Ampliar
          </span>
        </button>
      </div>

      <AnimatePresence>
        {lightbox && current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Imagem ampliada de ${name}`}
            className="fixed inset-0 z-[80] bg-noir/95 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={(e) => e.key === "Escape" && setLightbox(false)}
          >
            <button
              type="button"
              autoFocus
              onClick={() => {
                setLightbox(false);
                setZoomed(false);
              }}
              className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center border border-gold/30 text-ivory"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" strokeWidth={1.3} />
            </button>
            <div className="absolute inset-0 overflow-auto">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className={`relative mx-auto block h-full ${zoomed ? "w-[200%] max-w-none cursor-zoom-out md:w-[160%]" : "w-full max-w-4xl cursor-zoom-in"}`}
                aria-label={zoomed ? "Reduzir" : "Ampliar"}
              >
                <Media src={current.url} alt={current.alt || name} fill sizes="200vw" className="object-contain" />
              </button>
            </div>
            <p className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-ivory/50">
              <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.3} /> Toque para {zoomed ? "reduzir" : "ampliar"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

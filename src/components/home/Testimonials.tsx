"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

/** Depoimentos reais cadastrados no painel. A seção não é renderizada quando não há depoimentos. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
      setIndex(Math.round(el.scrollLeft / (w + 24)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (!items.length) return null;

  return (
    <section aria-labelledby="depoimentos-titulo" className="relative bg-champagne py-24 text-noir md:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow !text-[#8c6a2c]">Depoimentos</p>
            <h2 id="depoimentos-titulo" className="mt-5 font-serif text-[clamp(2.2rem,4.6vw,3.8rem)] font-light leading-[1.1]">
              Histórias de quem escolheu a França Jóias
            </h2>
          </div>
          {items.length > 1 && (
            <div className="flex gap-2">
              <button type="button" onClick={() => scrollTo(Math.max(0, index - 1))} aria-label="Depoimento anterior" className="grid h-12 w-12 place-items-center border border-noir/30 transition-colors hover:bg-noir hover:text-ivory">
                <ChevronLeft className="h-5 w-5" strokeWidth={1.3} />
              </button>
              <button type="button" onClick={() => scrollTo(Math.min(items.length - 1, index + 1))} aria-label="Próximo depoimento" className="grid h-12 w-12 place-items-center border border-noir/30 transition-colors hover:bg-noir hover:text-ivory">
                <ChevronRight className="h-5 w-5" strokeWidth={1.3} />
              </button>
            </div>
          )}
        </div>

        <ul
          ref={track}
          className="-mx-5 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] md:mx-0 md:px-0"
          aria-label="Depoimentos de clientes"
        >
          {items.map((t) => (
            <li key={t.id} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc((100%-48px)/3)]">
              <figure className="flex h-full flex-col border border-noir/10 bg-ivory p-8 shadow-[0_30px_60px_-40px_rgba(8,8,8,0.4)] md:p-10">
                <span aria-hidden="true" className="font-serif text-6xl leading-none text-gold">“</span>
                {t.rating ? (
                  <p className="mt-2 flex gap-1" aria-label={`Avaliação: ${t.rating} de 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating! ? "fill-gold text-gold" : "text-noir/20"}`} strokeWidth={1.2} />
                    ))}
                  </p>
                ) : null}
                <blockquote className="mt-4 flex-1 font-serif text-xl leading-relaxed text-noir/85">{t.text}</blockquote>
                <figcaption className="mt-8 border-t border-noir/10 pt-5">
                  <p className="text-[0.7rem] uppercase tracking-[0.24em]">{t.author_name}</p>
                  {t.location && <p className="mt-1 text-xs text-noir/50">{t.location}</p>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

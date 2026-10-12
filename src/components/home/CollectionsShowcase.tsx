"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import type { CollectionWithCategory } from "@/lib/types";
import { Media } from "../ui/Media";
import { btn } from "../ui/styles";

/**
 * Coleções cinematográficas: cada coleção ocupa uma área ampla; o fundo alterna entre preto e champagne
 * de forma suave conforme o scroll.
 */
export function CollectionsShowcase({ collections }: { collections: CollectionWithCategory[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-collection]");
      const reduce = prefersReducedMotion();

      panels.forEach((panel, idx) => {
        const theme = panel.dataset.theme;
        const prev = idx === 0 ? "dark" : panels[idx - 1].dataset.theme;
        // Smooth transition de fundo entre preto e champagne
        if (theme !== prev) {
          const colors = (t?: string) =>
            t === "light" ? { backgroundColor: "#f2e4cd", color: "#080808" } : { backgroundColor: "#080808", color: "#faf6ef" };
          gsap.fromTo(root.current, colors(prev), {
            ...colors(theme),
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: panel, start: "top 60%", end: "top 20%", scrub: true },
          });
        }
        if (reduce) return;
        const img = panel.querySelector("[data-collection-img]");
        const inner = panel.querySelector("[data-collection-inner]");
        gsap.fromTo(img, { clipPath: "inset(12% 12% 12% 12%)", opacity: 0.4 }, {
          clipPath: "inset(0% 0% 0% 0%)", opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: panel, start: "top 85%", end: "top 25%", scrub: true },
        });
        gsap.fromTo(inner, { yPercent: -10, scale: 1.15 }, {
          yPercent: 10, scale: 1.05, ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.from(panel.querySelectorAll("[data-collection-text] > *"), {
          y: 40, opacity: 0, stagger: 0.12, duration: 1.1,
          scrollTrigger: { trigger: panel, start: "top 65%", once: true },
        });
        gsap.fromTo(panel.querySelector("[data-collection-rule]"), { scaleX: 0 }, {
          scaleX: 1, ease: "none", scrollTrigger: { trigger: panel, start: "top 70%", end: "top 30%", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [collections.length] },
  );

  if (!collections.length) return null;

  return (
    <section ref={root} id="colecoes" aria-labelledby="colecoes-titulo" className="relative bg-noir text-ivory">
      <div className="container-luxe pb-6 pt-24 text-center md:pt-32">
        <p className="eyebrow">Coleções</p>
        <h2 id="colecoes-titulo" className="mt-5 font-serif text-[clamp(2.2rem,5vw,4rem)] font-light">
          Símbolos feitos para durar
        </h2>
      </div>

      {collections.map((c, i) => {
        const href = c.category ? `/produtos?categoria=${c.category.slug}` : "/produtos";
        const reverse = i % 2 === 1;
        return (
          <article key={c.id} data-collection data-theme={c.theme} className="relative py-16 md:py-28">
            <div className={`container-luxe grid items-center gap-10 md:grid-cols-12 md:gap-16`}>
              <div data-collection-img className={`relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[16/11] ${reverse ? "md:order-2" : ""}`}>
                <div data-collection-inner className="absolute inset-0 will-change-transform">
                  <Media src={c.image_url} alt={c.title} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
                </div>
                <span aria-hidden="true" className="absolute left-5 top-5 font-display text-xs tracking-[0.4em] text-gold-light/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div data-collection-text className={`md:col-span-5 ${reverse ? "md:order-1 md:text-right" : ""}`}>
                <p className="eyebrow">Coleção</p>
                <h3 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.05] tracking-[0.06em]">
                  {c.title.toUpperCase()}
                </h3>
                <span data-collection-rule aria-hidden="true" className={`mt-6 block h-px w-28 bg-gold ${reverse ? "origin-right md:ml-auto" : "origin-left"}`} />
                {c.tagline && <p className="mt-6 font-serif text-2xl italic opacity-80 md:text-3xl">“{c.tagline}”</p>}
                {c.description && <p className="mt-5 text-sm leading-relaxed opacity-60">{c.description}</p>}
                <div className={`mt-9 flex ${reverse ? "md:justify-end" : ""}`}>
                  <Link
                    href={href}
                    onClick={() => track("collection_click", { collection: c.slug, source: "home_showcase" })}
                    className={c.theme === "light" ? btn.outlineDark : btn.outline}
                  >
                    Explorar Coleção <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" strokeWidth={1.4} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

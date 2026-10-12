"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, hasWebGL, isLowPowerDevice, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { WhatsAppLink } from "../ContactLinks";
import { WhatsAppIcon } from "../icons";
import { btn } from "../ui/styles";
import { MESSAGES } from "@/lib/whatsapp";
import { useSite } from "../SiteProvider";

const RingsScene = dynamic(() => import("../three/RingsScene"), { ssr: false });

type Mode = "pending" | "3d-high" | "3d-low" | "static";

export function Hero() {
  const site = useSite();
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const intro = useRef(0);
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    if (!hasWebGL() || prefersReducedMotion() || isLowPowerDevice()) {
      intro.current = 1;
      setMode("static");
      return;
    }
    setMode(window.innerWidth < 768 ? "3d-low" : "3d-high");
  }, []);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (reduce) {
        intro.current = 1;
        return;
      }

      // 1–7: tela escura → reflexo dourado → alianças surgem → nome → slogan
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-hero-veil]", { opacity: 0, duration: 1.4, ease: "power2.inOut" })
        .fromTo("[data-hero-sweep]", { xPercent: -120, opacity: 0 }, { xPercent: 420, opacity: 1, duration: 2.4, ease: "power2.inOut" }, 0.1)
        .set("[data-hero-sweep]", { opacity: 0 })
        .to(intro, { current: 1, duration: 2.4, ease: "power2.out" }, 0.6)
        .from("[data-hero-stage]", { opacity: 0, scale: 0.94, duration: 2.2 }, 0.6)
        .from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 1 }, 1.3)
        .from("[data-hero-char]", { yPercent: 150, opacity: 0, duration: 1.3, stagger: 0.05, ease: "power4.out" }, 1.4)
        .from("[data-hero-rule]", { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 2)
        .from("[data-hero-tagline]", { opacity: 0, y: 18, filter: "blur(6px)", duration: 1.2 }, 2.1)
        .from("[data-hero-cta]", { opacity: 0, y: 18, duration: 1 }, 2.4)
        .from("[data-hero-scroll]", { opacity: 0, duration: 1 }, 2.9);

      // Scroll: câmera se aproxima, texto desaparece, alianças se deslocam
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: desktop ? "+=80%" : "bottom top",
          pin: desktop,
          scrub: true,
          onUpdate: (self) => (progress.current = self.progress),
        });
        const textTl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: desktop ? "+=55%" : "60% top", scrub: true },
        });
        textTl.to("[data-hero-copy]", { opacity: 0, y: -60, filter: "blur(4px)", ease: "none" });
        return () => {
          st.kill();
          textTl.kill();
        };
      });
    },
    { scope: root },
  );

  const title = site.hero_title.toUpperCase();

  return (
    <section ref={root} aria-label="Apresentação" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-noir">
      {/* iluminação de fundo */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(197,154,69,0.16),transparent_70%)]" />
      <div aria-hidden="true" className="grain absolute inset-0" />

      {/* palco 3D */}
      <div data-hero-stage className="absolute inset-0">
        {(mode === "3d-high" || mode === "3d-low") && (
          <RingsScene progress={progress} intro={intro} quality={mode === "3d-high" ? "high" : "low"} />
        )}
        {mode === "static" && (
          <div className="absolute inset-x-0 top-[14%] mx-auto w-[min(78vw,560px)] md:top-[12%]">
            <Image src="/brand/rings-emblem.svg" alt="" width={640} height={460} priority unoptimized className="h-auto w-full opacity-90 drop-shadow-[0_30px_60px_rgba(197,154,69,0.25)]" />
          </div>
        )}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-noir via-noir/60 to-transparent md:h-1/2" />

      {/* reflexo dourado inicial */}
      <div aria-hidden="true" data-hero-sweep className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold-light/25 to-transparent opacity-0" />

      {/* conteúdo */}
      <div data-hero-copy className="container-luxe relative z-10 flex h-full flex-col items-center justify-end pb-[14vh] text-center md:pb-[12vh]">
        <p data-hero-eyebrow className="eyebrow mb-5">
          Alianças de Moedas · Ouro · Prata
        </p>
        <h1 className="font-display text-[clamp(2.1rem,9vw,7.5rem)] font-normal leading-[0.95] tracking-[0.08em] md:tracking-[0.12em]" aria-label={site.hero_title}>
          {title.split(" ").map((word, w) => (
            <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
              {word.split("").map((ch, i) => (
                <span key={i} className="-my-[0.25em] inline-block overflow-hidden py-[0.25em] align-bottom">
                  <span data-hero-char className="text-gold-metal inline-block">
                    {ch}
                  </span>
                </span>
              ))}
              {w < title.split(" ").length - 1 && <span className="inline-block w-[0.4em]" />}
            </span>
          ))}
        </h1>
        <span data-hero-rule className="gold-rule mt-6 w-40" />
        <p data-hero-tagline className="mt-6 max-w-xl font-serif text-xl italic text-champagne/90 md:text-2xl">
          “{site.hero_tagline}”
        </p>
        <div data-hero-cta className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a href="#catalogo" className={`${btn.gold} w-full sm:w-auto`}>
            Explorar Coleção
          </a>
          <WhatsAppLink source="hero" message={MESSAGES.general} className={`${btn.outline} w-full sm:w-auto`}>
            <WhatsAppIcon className="h-4 w-4" /> Falar com Especialista
          </WhatsAppLink>
        </div>
      </div>

      <a data-hero-scroll href="#marca" aria-label="Rolar para a próxima seção" className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.55rem] uppercase tracking-[0.4em] text-ivory/50 md:flex">
        Role
        <ChevronDown className="h-4 w-4 animate-bounce text-gold" strokeWidth={1.2} />
      </a>

      {/* véu inicial: a tela começa escura */}
      <noscript>
        <style>{"[data-hero-veil]{display:none}"}</style>
      </noscript>
      <div aria-hidden="true" data-hero-veil className="pointer-events-none absolute inset-0 z-20 bg-noir motion-reduce:hidden" />
    </section>
  );
}

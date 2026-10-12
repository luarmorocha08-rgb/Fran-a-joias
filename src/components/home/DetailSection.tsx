"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Hand, Move3d } from "lucide-react";
import { gsap, hasWebGL, isLowPowerDevice, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Media } from "../ui/Media";

const ModelViewer = dynamic(() => import("../three/ModelViewer"), { ssr: false });

const DETAILS = [
  { title: "Material", text: "Moedas, ouro ou prata — cada material com seu brilho e personalidade." },
  { title: "Acabamento", text: "Consulte as opções de acabamento disponíveis para cada modelo." },
  { title: "Personalização", text: "Tamanhos, larguras e gravações conforme a disponibilidade do modelo." },
];

/**
 * "A beleza está nos detalhes."
 * - Com modelo GLB/GLTF real cadastrado: viewer 3D interativo.
 * - Sem modelo: fotografia real com profundidade (tilt + parallax). Nunca exibe um 3D genérico como se fosse o produto.
 */
export function DetailSection({ modelUrl, imageUrl, imageAlt }: { modelUrl: string | null; imageUrl: string | null; imageAlt: string }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [quality, setQuality] = useState<"high" | "low" | null>(null);

  useEffect(() => {
    if (!modelUrl || !hasWebGL()) return;
    setQuality(window.innerWidth < 768 || isLowPowerDevice() ? "low" : "high");
  }, [modelUrl]);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop && !reduce;
        // Pinned section: permanece fixa enquanto os detalhes são revelados
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: desktop ? "top top" : "top bottom",
          end: desktop ? "+=120%" : "bottom top",
          pin: desktop ? true : false,
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress;
            if (!modelUrl && stage.current && !reduce) {
              stage.current.style.setProperty("--p", String(self.progress));
            }
          },
        });
        if (!reduce) {
          gsap.from("[data-detail-item]", {
            opacity: 0,
            x: 30,
            stagger: 0.25,
            scrollTrigger: desktop
              ? { trigger: root.current, start: "top top", end: "+=90%", scrub: true }
              : { trigger: root.current, start: "top 70%", once: true },
          });
        }
        return () => st.kill();
      });
    },
    { scope: root, dependencies: [modelUrl] },
  );

  // inclinação com o ponteiro para a versão fotográfica
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (modelUrl || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <section ref={root} aria-labelledby="detalhes-titulo" className="relative flex min-h-[100svh] items-center overflow-hidden bg-noir py-20">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_35%_50%,rgba(197,154,69,0.13),transparent_70%)]" />
      <div className="container-luxe relative grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div
          ref={stage}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto aspect-square w-full max-w-[min(100%,72svh)] [perspective:1200px]"
          style={{ ["--p" as string]: 0, ["--rx" as string]: "0deg", ["--ry" as string]: "0deg" }}
        >
          {modelUrl && quality ? (
            <div className="absolute inset-0 touch-none">
              <ModelViewer url={modelUrl} progress={progress} quality={quality} />
              <p className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-ivory/50">
                <Hand className="h-3.5 w-3.5 text-gold" strokeWidth={1.3} /> Arraste para girar · pinça para zoom
              </p>
            </div>
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d]"
              style={{ transform: "rotateX(var(--rx)) rotateY(var(--ry))" }}
            >
              {/* camada de fundo — move mais devagar */}
              <div aria-hidden="true" className="absolute inset-[6%] border border-gold/20" style={{ transform: "translateZ(-60px) translateY(calc(var(--p) * 30px))" }} />
              {/* fotografia — zoom suave conforme o scroll revela detalhes */}
              <div className="absolute inset-[10%] overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" style={{ transform: "translateZ(30px)" }}>
                <div className="absolute inset-0" style={{ transform: "scale(calc(1.05 + var(--p) * 0.35)) translateY(calc(var(--p) * -6%))" }}>
                  <Media src={imageUrl} alt={imageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                </div>
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,236,190,0.18)_50%,transparent_65%)]" style={{ transform: "translateX(calc(-60% + var(--p) * 120%))" }} />
              </div>
              {/* moldura dourada à frente */}
              <div aria-hidden="true" className="absolute inset-[14%] border border-gold-light/30" style={{ transform: "translateZ(70px)" }} />
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow flex items-center gap-2">
            <Move3d className="h-4 w-4" strokeWidth={1.3} /> Detalhes
          </p>
          <h2 id="detalhes-titulo" className="mt-6 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05]">
            A beleza está <em className="text-gold-metal not-italic">nos detalhes.</em>
          </h2>
          <ul className="mt-10 space-y-7">
            {DETAILS.map((d, i) => (
              <li key={d.title} data-detail-item className="flex gap-5 border-t border-gold/15 pt-6">
                <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.24em] text-ivory">{d.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{d.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

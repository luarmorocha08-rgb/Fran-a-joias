"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Linha dourada que se desenha acompanhando o scroll. */
export function GoldLine({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current,
        vertical ? { scaleY: 0 } : { scaleX: 0 },
        {
          ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 40%", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block ${vertical ? "w-px origin-top bg-gradient-to-b" : "h-px origin-left bg-gradient-to-r"} from-gold via-gold-light to-transparent ${className ?? ""}`}
    />
  );
}

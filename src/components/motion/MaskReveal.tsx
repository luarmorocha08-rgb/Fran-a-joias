"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Image Mask Reveal + Parallax discreto.
 * A moldura é revelada por clip-path e a imagem interna se move em velocidade diferente.
 */
export function MaskReveal({
  children,
  className,
  direction = "up",
  parallax = 8,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const inner = ref.current.querySelector("[data-parallax]");
      const from =
        direction === "left" ? "inset(0 100% 0 0)" : direction === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
      gsap.fromTo(
        ref.current,
        { clipPath: from },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        },
      );
      if (inner) {
        gsap.fromTo(inner, { scale: 1.25 }, { scale: 1.05, duration: 2, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 82%", once: true } });
        if (parallax) {
          gsap.fromTo(
            inner,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      }
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <div data-parallax className="absolute inset-[-10%_0] will-change-transform">
        {children}
      </div>
    </div>
  );
}

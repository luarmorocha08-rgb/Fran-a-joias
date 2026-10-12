"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
  /** anima os filhos diretos em sequência */
  stagger?: number;
  y?: number;
  delay?: number;
};

/** Scroll Reveal: elementos surgem suavemente ao entrar na área visível. */
export function Reveal({ children, className, as: Tag = "div", stagger, y = 36, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const targets = stagger ? Array.from(ref.current.children) : ref.current;
      // Transições CSS (ex.: transition-all dos cards) disputam as mesmas propriedades com o GSAP;
      // ficam desativadas durante a entrada e são restauradas ao final.
      gsap.set(targets, { transition: "none" });
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        stagger: stagger ?? 0,
        clearProps: "transition,opacity,transform,translate,rotate,scale",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}

"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** "scroll" dispara ao entrar na tela; "mount" dispara imediatamente */
  trigger?: "scroll" | "mount";
};

/** Text Reveal palavra por palavra, com máscara. Mantém o texto acessível para leitores de tela. */
export function TextReveal({ text, className, as: Tag = "h2", delay = 0, trigger = "scroll" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const words = ref.current.querySelectorAll<HTMLElement>("[data-word]");
      gsap.from(words, {
        yPercent: 115,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.07,
        delay,
        scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
      });
    },
    { scope: ref },
  );

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span data-word className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

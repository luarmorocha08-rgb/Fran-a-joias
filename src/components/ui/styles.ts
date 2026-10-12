/** Classes compartilhadas dos botões da marca. */
const base =
  "group/btn relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-7 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.24em] transition-all duration-500 ease-[var(--ease-luxe)] disabled:pointer-events-none disabled:opacity-50";

export const btn = {
  gold: `${base} sweep bg-gold-metal text-noir shadow-[0_10px_40px_-12px_rgba(197,154,69,0.55)] hover:shadow-[0_14px_50px_-10px_rgba(229,199,127,0.7)] hover:-translate-y-0.5`,
  outline: `${base} border border-gold/60 text-gold-light hover:border-gold-light hover:bg-gold/10`,
  dark: `${base} bg-noir text-ivory hover:bg-noir-3`,
  outlineDark: `${base} border border-noir/70 text-noir hover:bg-noir hover:text-ivory`,
  ghost: `${base} px-0 text-gold-light hover:text-ivory`,
};

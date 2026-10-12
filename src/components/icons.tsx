import type { SVGProps } from "react";

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.35-.2-3.56.93.95-3.47-.23-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.43 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.72C5.8.72.7 5.82.7 12.08c0 2 .52 3.95 1.52 5.67L.6 23.62l6.01-1.58a11.32 11.32 0 0 0 5.43 1.38h.01c6.25 0 11.35-5.1 11.35-11.36 0-3.03-1.18-5.88-3.33-8.02" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Monograma FJ com coroa de louros — inspirado no logotipo da marca. */
export function Monogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="mono-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4e2a8" />
          <stop offset=".45" stopColor="#c59a45" />
          <stop offset="1" stopColor="#8c6a2c" />
        </linearGradient>
      </defs>
      <g stroke="url(#mono-gold)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M14 46C8 38 8 24 16 16" />
        <path d="M50 46c6-8 6-22-2-30" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <path d={`M${13.5 - i * 0.6} ${42 - i * 6}c-3-1-4.5-3-4.6-5.4 2.6.2 4.4 1.9 4.6 5.4Z`} fill="url(#mono-gold)" stroke="none" />
            <path d={`M${50.5 + i * 0.6} ${42 - i * 6}c3-1 4.5-3 4.6-5.4-2.6.2-4.4 1.9-4.6 5.4Z`} fill="url(#mono-gold)" stroke="none" />
          </g>
        ))}
      </g>
      <text x="32" y="40" textAnchor="middle" fontFamily="Cinzel, Georgia, serif" fontSize="17" fill="url(#mono-gold)">
        FJ
      </text>
    </svg>
  );
}

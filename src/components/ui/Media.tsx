import Image, { type ImageProps } from "next/image";

/**
 * Wrapper do next/image: otimiza fotos do Supabase e serve as ilustrações SVG demonstrativas sem processamento.
 */
export function Media({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src: string | null | undefined }) {
  if (!src) return <ImagePlaceholder label={alt} />;
  const isSvg = src.endsWith(".svg");
  return <Image src={src} alt={alt} unoptimized={isSvg} {...rest} />;
}

export function ImagePlaceholder({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#2a2218_0%,#0d0b09_60%,#050505_100%)]">
      <div className="text-center">
        <svg viewBox="0 0 64 40" className="mx-auto h-10 w-16 text-gold/50" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <ellipse cx="24" cy="20" rx="16" ry="9" />
          <ellipse cx="40" cy="22" rx="14" ry="8" />
        </svg>
        <p className="eyebrow mt-3 !text-[0.55rem] !text-gold/50">{label ? "Imagem em breve" : "França Jóias"}</p>
      </div>
    </div>
  );
}

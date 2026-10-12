import { TextReveal } from "../motion/TextReveal";
import { Reveal } from "../motion/Reveal";

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string | null }) {
  return (
    <header className="relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(197,154,69,0.14),transparent_70%)]" />
      <div className="container-luxe relative text-center">
        <p className="eyebrow">{eyebrow}</p>
        <TextReveal as="h1" trigger="mount" text={title} className="mt-6 font-serif text-[clamp(2.6rem,6vw,5rem)] font-light leading-[1.02]" />
        <span aria-hidden="true" className="gold-rule mx-auto mt-8 w-32" />
        {description && (
          <Reveal>
            <p className="mx-auto mt-8 max-w-2xl text-ivory/60">{description}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}

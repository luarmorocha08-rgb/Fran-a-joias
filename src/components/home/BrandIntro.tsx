import { MaskReveal } from "../motion/MaskReveal";
import { TextReveal } from "../motion/TextReveal";
import { Reveal } from "../motion/Reveal";
import { GoldLine } from "../motion/GoldLine";
import { Media } from "../ui/Media";
import type { SiteSettings } from "@/lib/types";

export function BrandIntro({ settings, fallbackImage }: { settings: SiteSettings; fallbackImage?: string | null }) {
  const image = settings.about_image_url || fallbackImage;
  return (
    <section id="marca" className="relative overflow-hidden bg-noir py-24 md:py-36">
      <div aria-hidden="true" className="absolute left-1/2 top-0 hidden h-24 -translate-x-1/2 md:block">
        <GoldLine vertical className="h-24" />
      </div>
      <div className="container-luxe grid items-center gap-14 md:grid-cols-2 md:gap-20">
        <MaskReveal className="aspect-[4/5] w-full border border-gold/10" direction="up">
          <Media src={image} alt="Alianças França Jóias" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </MaskReveal>

        <div className="relative">
          <Reveal>
            <p className="eyebrow">A França Jóias</p>
          </Reveal>
          <TextReveal
            text={settings.about_title}
            className="mt-6 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.05] text-ivory"
          />
          <GoldLine className="my-9 w-32" />
          <Reveal stagger={0.15}>
            <p className="max-w-lg text-base leading-[1.9] text-ivory/70 md:text-lg">{settings.about_text}</p>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-gold/15 pt-8">
              <div>
                <p className="font-display text-2xl text-gold-metal">Moedas</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory/50">Única especializada em Marília</p>
              </div>
              <div>
                <p className="font-display text-2xl text-gold-metal">Ouro & Prata</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory/50">Fabricação própria</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

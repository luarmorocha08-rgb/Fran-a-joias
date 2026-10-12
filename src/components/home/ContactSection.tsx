"use client";

import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { InstagramLink, WhatsAppLink } from "../ContactLinks";
import { InstagramIcon, WhatsAppIcon } from "../icons";
import { useSite } from "../SiteProvider";
import { formatPhone } from "@/lib/format";
import { MESSAGES } from "@/lib/whatsapp";
import { btn } from "../ui/styles";
import { Reveal } from "../motion/Reveal";

export function ContactSection() {
  const site = useSite();
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="grain relative overflow-hidden bg-noir py-24 md:py-36">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(121,13,27,0.25),transparent_70%)]" />
      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Contato</p>
          <h2 id="contato-titulo" className="mt-6 font-serif text-[clamp(2.4rem,5.4vw,4.6rem)] font-light leading-[1.05]">
            Vamos escrever <span className="text-gold-metal">a sua história?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-ivory/60">
            Fale com a França Jóias e receba um atendimento dedicado para encontrar a aliança perfeita.
          </p>
        </Reveal>

        <Reveal stagger={0.12} className="mx-auto mt-14 grid max-w-4xl gap-px bg-gold/15 sm:grid-cols-2">
          <div className="bg-noir p-8">
            <p className="eyebrow">WhatsApp</p>
            <p className="mt-3 font-display text-xl tracking-[0.06em]">{formatPhone(site.whatsapp_number)}</p>
          </div>
          <div className="bg-noir p-8">
            <p className="eyebrow">Instagram</p>
            <p className="mt-3 font-display text-xl tracking-[0.06em]">{site.instagram_handle}</p>
          </div>
          <div className="bg-noir p-8">
            <p className="eyebrow flex items-center gap-2"><MapPin className="h-3.5 w-3.5" strokeWidth={1.4} /> Cidade</p>
            <p className="mt-3 font-serif text-xl">{site.city}</p>
            {site.address && <p className="mt-1 text-sm text-ivory/60">{site.address}</p>}
          </div>
          <div className="bg-noir p-8">
            <p className="eyebrow flex items-center gap-2"><Clock className="h-3.5 w-3.5" strokeWidth={1.4} /> Atendimento</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ivory/70">
              {site.opening_hours || "Consulte os horários pelo WhatsApp."}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <WhatsAppLink source="contact" message={MESSAGES.general} className={btn.gold}>
            <WhatsAppIcon className="h-4 w-4" /> Conversar pelo WhatsApp
          </WhatsAppLink>
          <InstagramLink source="contact" className={btn.outline}>
            <InstagramIcon className="h-4 w-4" /> Visitar Instagram
          </InstagramLink>
          <Link href="/colecoes" className={btn.ghost + " justify-center"}>
            Ver Coleções <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

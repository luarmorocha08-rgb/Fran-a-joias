"use client";

import Link from "next/link";
import { Monogram, InstagramIcon, WhatsAppIcon } from "../icons";
import { InstagramLink, WhatsAppLink } from "../ContactLinks";
import { useSite } from "../SiteProvider";
import { formatPhone } from "@/lib/format";
import { MESSAGES } from "@/lib/whatsapp";
import { Gem, Hammer, ShieldCheck, Truck } from "lucide-react";

const PILLARS = [
  { icon: Gem, title: "Especialistas em moedas", text: "Única loja de Marília especializada em alianças de moedas" },
  { icon: Hammer, title: "Fabricação própria", text: "Alianças de ouro e prata" },
  { icon: ShieldCheck, title: "Atendimento dedicado", text: "Do primeiro contato à entrega" },
  { icon: Truck, title: "Envios", text: "Consulte as condições pelo WhatsApp" },
];

export function Footer({ demo = false }: { demo?: boolean }) {
  const site = useSite();
  return (
    <footer className="relative border-t border-gold/15 bg-noir">
      <div className="container-luxe grid grid-cols-2 gap-8 border-b border-gold/10 py-12 lg:grid-cols-4">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4">
            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-gold" strokeWidth={1.1} />
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ivory">{title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ivory/50">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-luxe grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Monogram className="h-12 w-12" />
            <span className="font-display text-2xl tracking-[0.22em]">FRANÇA JÓIAS</span>
          </div>
          <p className="mt-6 max-w-sm font-serif text-xl italic leading-relaxed text-champagne/80">
            “{site.hero_tagline}”
          </p>
        </div>

        <nav aria-label="Rodapé">
          <p className="eyebrow mb-5">Navegação</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li><Link className="hover:text-gold-light" href="/colecoes">Coleções</Link></li>
            <li><Link className="hover:text-gold-light" href="/produtos">Catálogo</Link></li>
            <li><Link className="hover:text-gold-light" href="/#atendimento">Atendimento</Link></li>
            <li><Link className="hover:text-gold-light" href="/#contato">Contato</Link></li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-5">Contato</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li>{site.city}</li>
            {site.address && <li>{site.address}</li>}
            {site.opening_hours && <li className="whitespace-pre-line">{site.opening_hours}</li>}
            <li>
              <WhatsAppLink source="footer" message={MESSAGES.general} className="inline-flex items-center gap-2 hover:text-gold-light">
                <WhatsAppIcon className="h-4 w-4" /> {formatPhone(site.whatsapp_number)}
              </WhatsAppLink>
            </li>
            <li>
              <InstagramLink source="footer" className="inline-flex items-center gap-2 hover:text-gold-light">
                <InstagramIcon className="h-4 w-4" /> {site.instagram_handle}
              </InstagramLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 pb-24 text-[0.62rem] uppercase tracking-[0.22em] text-ivory/40 sm:flex-row md:pb-6">
          <p>© {new Date().getFullYear()} França Jóias · Marília — SP</p>
          <p>{demo ? "Modo demonstração · produtos e imagens ilustrativos" : "Todos os direitos reservados"}</p>
        </div>
      </div>
    </footer>
  );
}

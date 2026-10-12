"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Monogram, InstagramIcon, WhatsAppIcon } from "../icons";
import { InstagramLink, WhatsAppLink } from "../ContactLinks";
import { MESSAGES } from "@/lib/whatsapp";
import { formatPhone } from "@/lib/format";
import { useSite } from "../SiteProvider";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/produtos", label: "Catálogo" },
  { href: "/#atendimento", label: "Atendimento" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const site = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-luxe)] ${
        scrolled ? "border-b border-gold/15 bg-noir/80 backdrop-blur-xl" : "bg-gradient-to-b from-noir/70 to-transparent"
      }`}
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-gold focus:px-4 focus:py-2 focus:text-noir">
        Pular para o conteúdo
      </a>
      <div className={`container-luxe flex items-center justify-between transition-all duration-700 ${scrolled ? "h-16" : "h-20 md:h-24"}`}>
        <Link href="/" className="flex items-center gap-3" aria-label="França Jóias — página inicial">
          <Monogram className="h-10 w-10 md:h-11 md:w-11" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-[0.22em] text-ivory md:text-xl">FRANÇA</span>
            <span className="mt-1 text-[0.55rem] tracking-[0.5em] text-gold">JÓIAS · MARÍLIA</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => {
              const active = item.href === pathname || (item.href !== "/" && !item.href.includes("#") && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative py-2 text-[0.68rem] uppercase tracking-[0.26em] transition-colors ${active ? "text-gold-light" : "text-ivory/80 hover:text-ivory"}`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <InstagramLink source="header" aria-label="Instagram da França Jóias" className="hidden h-11 w-11 place-items-center text-ivory/80 transition-colors hover:text-gold-light sm:grid">
            <InstagramIcon className="h-5 w-5" />
          </InstagramLink>
          <WhatsAppLink
            source="header"
            message={MESSAGES.general}
            className="hidden items-center gap-2 border border-gold/50 px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.24em] text-gold-light transition-colors hover:bg-gold hover:text-noir md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" /> Falar conosco
          </WhatsAppLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center text-ivory lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            <Menu className="h-6 w-6" strokeWidth={1.3} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-noir lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-luxe flex h-20 items-center justify-between">
              <Monogram className="h-10 w-10" />
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center text-ivory" aria-label="Fechar menu">
                <X className="h-6 w-6" strokeWidth={1.3} />
              </button>
            </div>
            <nav aria-label="Menu móvel" className="container-luxe flex flex-1 flex-col justify-center">
              <ul className="space-y-2">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 font-serif text-4xl text-ivory">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <span className="gold-rule my-10 w-24" />
              <div className="flex flex-col gap-3">
                <WhatsAppLink source="mobile_menu" message={MESSAGES.general} className="flex min-h-12 items-center gap-3 text-gold-light">
                  <WhatsAppIcon className="h-5 w-5" /> {formatPhone(site.whatsapp_number)}
                </WhatsAppLink>
                <InstagramLink source="mobile_menu" className="flex min-h-12 items-center gap-3 text-gold-light">
                  <InstagramIcon className="h-5 w-5" /> {site.instagram_handle}
                </InstagramLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

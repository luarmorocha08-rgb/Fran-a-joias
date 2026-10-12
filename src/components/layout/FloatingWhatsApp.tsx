"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WhatsAppLink } from "../ContactLinks";
import { WhatsAppIcon } from "../icons";
import { MESSAGES } from "@/lib/whatsapp";

/** Botão flutuante discreto. Aparece após o hero e se oculta perto do rodapé para não cobrir conteúdo. */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 160;
      setVisible(window.scrollY > window.innerHeight * 0.6 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Na página de produto já existe uma barra de contato fixa no mobile.
  const onProductPage = pathname.startsWith("/produtos/");

  return (
    <WhatsAppLink
      source="floating"
      message={MESSAGES.general}
      aria-label="Conversar pelo WhatsApp"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-4 z-40 grid h-13 w-13 place-items-center rounded-full border border-gold/40 bg-noir/85 text-gold-light shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-gold hover:text-noir md:bottom-8 md:right-8 md:h-14 md:w-14 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      } ${onProductPage ? "max-md:hidden" : ""}`}
    >
      <WhatsAppIcon className="h-6 w-6" />
    </WhatsAppLink>
  );
}

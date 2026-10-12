"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { productMessage } from "@/lib/whatsapp";
import { InstagramLink, WhatsAppLink } from "../ContactLinks";
import { InstagramIcon, WhatsAppIcon } from "../icons";
import { btn } from "../ui/styles";

type P = { name: string; code: string; slug: string; category?: string | null };

export function ProductActions({ product }: { product: P }) {
  useEffect(() => {
    track("product_view", { product_code: product.code, product_name: product.name, category: product.category ?? undefined });
  }, [product.code, product.name, product.category]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <WhatsAppLink source="product_page" product={product} message={productMessage(product)} className={`${btn.gold} w-full`}>
          <WhatsAppIcon className="h-4 w-4" /> Tenho interesse nesta aliança
        </WhatsAppLink>
        <InstagramLink source="product_page" className={`${btn.outline} w-full`}>
          <InstagramIcon className="h-4 w-4" /> Conversar pelo Instagram
        </InstagramLink>
      </div>

      {/* Barra fixa no mobile: contato a um toque */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-noir/90 p-3 backdrop-blur-xl md:hidden">
        <WhatsAppLink source="product_sticky" product={product} message={productMessage(product)} className={`${btn.gold} w-full`}>
          <WhatsAppIcon className="h-4 w-4" /> Tenho interesse
        </WhatsAppLink>
      </div>
    </>
  );
}

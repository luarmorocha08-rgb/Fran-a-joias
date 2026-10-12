"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductWithCategory } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { productMessage } from "@/lib/whatsapp";
import { Media } from "../ui/Media";
import { WhatsAppLink } from "../ContactLinks";
import { WhatsAppIcon } from "../icons";

export function ProductCard({ product, priority = false }: { product: ProductWithCategory; priority?: boolean }) {
  const image = product.images[0];
  const href = `/produtos/${product.slug}`;
  return (
    <article className="group relative flex h-full flex-col border border-gold/10 bg-noir-2 transition-all duration-700 ease-[var(--ease-luxe)] hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_30px_60px_-30px_rgba(197,154,69,0.35)] focus-within:border-gold/35">
      <Link href={href} className="sweep relative block aspect-[4/5] overflow-hidden" aria-label={`Ver detalhes de ${product.name}`}>
        <Media
          src={image?.url}
          alt={image?.alt || product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.07]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {!product.available && (
            <span className="bg-noir/85 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">Indisponível</span>
          )}
          {product.featured && (
            <span className="bg-gold/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-noir">Destaque</span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="text-[0.58rem] uppercase tracking-[0.24em] text-gold">
          {product.category?.name ?? "França Jóias"}
          {product.material ? <span className="text-ivory/40"> · {product.material}</span> : null}
        </p>
        <h3 className="mt-2 font-serif text-lg leading-snug text-ivory md:text-xl">
          <Link href={href} className="hover:text-gold-light">
            {product.name}
          </Link>
        </h3>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ivory/50">{product.short_description}</p>
        )}
        <p className="mt-3 font-display text-sm tracking-[0.08em] text-gold-light">
          {formatPrice(product.price, product.price_on_request)}
        </p>

        {/* Botões: sempre visíveis no mobile; surgem no hover/foco no desktop */}
        <div className="mt-auto grid grid-cols-1 gap-2 pt-4 transition-all duration-500 ease-[var(--ease-luxe)] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 border border-gold/40 px-3 text-[0.6rem] uppercase tracking-[0.12em] text-gold-light transition-colors hover:bg-gold/10"
          >
            Ver Detalhes <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.4} />
          </Link>
          <WhatsAppLink
            source="product_card"
            product={product}
            message={productMessage(product)}
            aria-label={`Consultar ${product.name} no WhatsApp`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 bg-gold-metal px-3 text-[0.6rem] uppercase tracking-[0.12em] text-noir"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Consultar no WhatsApp</span>
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-gold/10 bg-noir-2" aria-hidden="true">
      <div className="skeleton aspect-[4/5]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-2.5 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/4" />
      </div>
    </div>
  );
}

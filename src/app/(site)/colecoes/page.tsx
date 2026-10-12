import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { getCollections } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Coleções",
  description: "Coleções da França Jóias: alianças de moedas, alianças de ouro e alianças de prata em Marília — SP.",
  alternates: { canonical: "/colecoes" },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <>
      <PageHeader eyebrow="Coleções" title="Símbolos feitos para durar" description="Cada coleção nasce de um material e de uma forma de celebrar o amor." />
      <div className="container-luxe pb-28">
        {collections.length === 0 ? (
          <p className="py-20 text-center text-ivory/60">Nenhuma coleção publicada no momento.</p>
        ) : (
          <Reveal as="div" stagger={0.12} className="grid gap-6 md:grid-cols-2">
            {collections.map((c) => (
              <Link key={c.id} href={`/colecoes/${c.slug}`} className="sweep group relative block aspect-[4/5] overflow-hidden border border-gold/10 md:aspect-[5/4]">
                <Media src={c.image_url} alt={c.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                  <h2 className="font-display text-3xl tracking-[0.06em] md:text-4xl">{c.title.toUpperCase()}</h2>
                  {c.tagline && <p className="mt-3 font-serif text-xl italic text-champagne/80">“{c.tagline}”</p>}
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-gold-light">
                    Explorar Coleção <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
                  </span>
                </div>
              </Link>
            ))}
          </Reveal>
        )}
      </div>
    </>
  );
}

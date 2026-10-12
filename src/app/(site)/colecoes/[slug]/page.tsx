import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { ProductCard } from "@/components/catalog/ProductCard";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { btn } from "@/components/ui/styles";
import { getCollections, getProducts } from "@/lib/data";
import { CollectionClickLink } from "@/components/catalog/CollectionClickLink";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = (await getCollections()).find((x) => x.slug === slug);
  if (!c) return { title: "Coleção não encontrada" };
  return {
    title: c.title,
    description: c.tagline ?? c.description ?? `Coleção ${c.title} da França Jóias.`,
    alternates: { canonical: `/colecoes/${c.slug}` },
    openGraph: { title: `${c.title} · França Jóias`, images: c.image_url && !c.image_url.endsWith(".svg") ? [c.image_url] : undefined },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);
  const c = collections.find((x) => x.slug === slug);
  if (!c) notFound();
  const items = products.filter((p) => p.category_id && p.category_id === c.category_id);
  const catalogHref = c.category ? `/produtos?categoria=${c.category.slug}` : "/produtos";

  return (
    <>
      <section className="relative flex min-h-[80svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Media src={c.image_url} alt={c.title} fill priority sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-noir/20" />
        </div>
        <div className="container-luxe relative pb-16 pt-40">
          <p className="eyebrow">Coleção</p>
          <TextReveal as="h1" trigger="mount" text={c.title.toUpperCase()} className="mt-5 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1] tracking-[0.06em]" />
          {c.tagline && <p className="mt-6 max-w-2xl font-serif text-2xl italic text-champagne/85 md:text-3xl">“{c.tagline}”</p>}
          {c.description && <p className="mt-5 max-w-xl text-ivory/65">{c.description}</p>}
          <div className="mt-9">
            <CollectionClickLink href={catalogHref} collection={c.slug} className={btn.gold}>
              Explorar Coleção <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </CollectionClickLink>
          </div>
        </div>
      </section>

      <section className="container-luxe py-20">
        {items.length ? (
          <Reveal as="div" stagger={0.08} className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        ) : (
          <div className="border border-dashed border-gold/25 py-16 text-center">
            <p className="font-serif text-2xl">Novos modelos em breve.</p>
            <Link href="/produtos" className={`${btn.outline} mt-8`}>Ver todo o catálogo</Link>
          </div>
        )}
      </section>
    </>
  );
}

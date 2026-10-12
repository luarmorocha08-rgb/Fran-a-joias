import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { getProductBySlug, getProducts, isDemoMode } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { productUrl } from "@/lib/whatsapp";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  const description = product.short_description || product.description?.slice(0, 160) || `${product.name} — França Jóias, Marília — SP.`;
  const image = product.images[0]?.url;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} · França Jóias`,
      description,
      url: `/produtos/${product.slug}`,
      images: image && !image.endsWith(".svg") ? [{ url: image, alt: product.name }] : undefined,
    },
    robots: isDemoMode ? { index: false } : undefined,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 3);
  const price = formatPrice(product.price, product.price_on_request);

  const specs = [
    ["Código", product.code],
    ["Categoria", product.category?.name],
    ["Material", product.material],
    ["Acabamento", product.finish],
    ["Largura", product.width],
    ["Disponibilidade", product.available ? "Disponível" : "Indisponível no momento"],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    description: product.description || product.short_description || undefined,
    image: product.images.map((i) => i.url).filter((u) => u.startsWith("http")),
    category: product.category?.name,
    material: product.material ?? undefined,
    brand: { "@type": "Brand", name: "França Jóias" },
    url: productUrl(product.slug),
    ...(product.price != null && !product.price_on_request
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: product.price,
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: productUrl(product.slug),
          },
        }
      : {}),
  };

  return (
    <>
      {!isDemoMode && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="container-luxe pb-28 pt-28 md:pt-36">
        <nav aria-label="Trilha de navegação" className="mb-8 flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/45">
          <Link href="/" className="hover:text-gold-light">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/produtos" className="hover:text-gold-light">Catálogo</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/produtos?categoria=${product.category.slug}`} className="hover:text-gold-light">{product.category.name}</Link>
            </>
          )}
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{product.category?.name ?? "França Jóias"}</p>
            <h1 className="mt-4 font-serif text-[clamp(2.2rem,4.4vw,3.6rem)] font-light leading-[1.05]">{product.name}</h1>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory/40">Código {product.code}</p>
            <span aria-hidden="true" className="gold-rule my-7 w-24" />
            <p className="font-display text-2xl tracking-[0.06em] text-gold-light">{price}</p>
            {product.short_description && <p className="mt-6 text-ivory/70">{product.short_description}</p>}

            <div className="mt-8">
              <ProductActions product={{ name: product.name, code: product.code, slug: product.slug, category: product.category?.name }} />
            </div>

            <dl className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3.5 text-sm">
                  <dt className="text-[0.65rem] uppercase tracking-[0.22em] text-ivory/45">{k}</dt>
                  <dd className="text-right text-ivory/85">{v}</dd>
                </div>
              ))}
            </dl>

            {product.description && (
              <section className="mt-10">
                <h2 className="eyebrow">Descrição</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-ivory/70">{product.description}</p>
              </section>
            )}
            {product.customization && (
              <section className="mt-8">
                <h2 className="eyebrow">Opções de personalização</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-ivory/70">{product.customization}</p>
              </section>
            )}
            {product.additional_info && (
              <section className="mt-8">
                <h2 className="eyebrow">Informações adicionais</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ivory/55">{product.additional_info}</p>
              </section>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-28" aria-labelledby="relacionados">
            <h2 id="relacionados" className="font-serif text-3xl font-light md:text-4xl">Você também pode gostar</h2>
            <Reveal as="div" stagger={0.1} className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </>
  );
}

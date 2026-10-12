import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/catalog/Catalog";
import { ProductCardSkeleton } from "@/components/catalog/ProductCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategories, getProducts } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo de Alianças",
  description: "Alianças de moedas, ouro e prata da França Jóias, em Marília — SP. Filtre por categoria, material e preço e consulte pelo WhatsApp.",
  alternates: { canonical: "/produtos" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <>
      <PageHeader eyebrow="Catálogo" title="Nossas alianças" description="Explore os modelos e fale com a nossa equipe para valores, tamanhos e personalização." />
      <section className="container-luxe pb-28">
        {/* Os filtros são lidos da URL no cliente, mantendo a página estática e rápida */}
        <Suspense fallback={<CatalogFallback />}>
          <Catalog products={products} categories={categories} syncUrl />
        </Suspense>
      </section>
    </>
  );
}

function CatalogFallback() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

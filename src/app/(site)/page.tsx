import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { BrandIntro } from "@/components/home/BrandIntro";
import { CollectionsShowcase } from "@/components/home/CollectionsShowcase";
import { DetailSection } from "@/components/home/DetailSection";
import { ServiceSteps } from "@/components/home/ServiceSteps";
import { Testimonials } from "@/components/home/Testimonials";
import { ContactSection } from "@/components/home/ContactSection";
import { Catalog } from "@/components/catalog/Catalog";
import { TextReveal } from "@/components/motion/TextReveal";
import { btn } from "@/components/ui/styles";
import { getCategories, getCollections, getProducts, getSettings, getTestimonials } from "@/lib/data";
import { SITE_URL } from "@/lib/config";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, products, categories, collections, testimonials] = await Promise.all([
    getSettings(),
    getProducts(),
    getCategories(),
    getCollections(),
    getTestimonials(),
  ]);

  const featured = products.filter((p) => p.featured);
  const showcase = featured.length ? [...featured, ...products.filter((p) => !p.featured)] : products;
  const heroProduct = featured[0] ?? products[0];
  const detailModel = settings.detail_model_url || products.find((p) => p.model_url)?.model_url || null;
  const detailImage = settings.detail_image_url || heroProduct?.images[0]?.url || null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "França Jóias",
    url: SITE_URL,
    telephone: `+${settings.whatsapp_number}`,
    sameAs: [settings.instagram_url],
    address: { "@type": "PostalAddress", addressLocality: "Marília", addressRegion: "SP", addressCountry: "BR", streetAddress: settings.address ?? undefined },
    description: "Única loja de Marília especializada em alianças de moedas. Fabricamos também alianças de ouro e prata.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <BrandIntro settings={settings} fallbackImage={heroProduct?.images[1]?.url ?? heroProduct?.images[0]?.url} />

      <section id="catalogo" aria-labelledby="catalogo-titulo" className="scroll-mt-16 bg-noir py-24 md:py-32">
        <div className="container-luxe">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Catálogo</p>
              <TextReveal text="Encontre a sua aliança" className="mt-5 font-serif text-[clamp(2.2rem,4.8vw,4rem)] font-light leading-[1.05]" />
            </div>
            <Link href="/produtos" className={btn.outline}>
              Ver catálogo completo <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </Link>
          </div>
          <Catalog products={showcase} categories={categories} limit={9} />
        </div>
      </section>

      <CollectionsShowcase collections={collections} />
      <DetailSection modelUrl={detailModel} imageUrl={detailImage} imageAlt={heroProduct ? heroProduct.name : "Detalhe de aliança"} />
      <ServiceSteps />
      <Testimonials items={testimonials} />
      <ContactSection />
    </>
  );
}

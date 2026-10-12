import Link from "next/link";
import { Gem, MessageSquareQuote, Plus, Sparkles, Star } from "lucide-react";
import { adminCollections, adminProducts, adminTestimonials } from "@/lib/admin-data";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Visão geral" };

export default async function AdminHome() {
  const [products, collections, testimonials] = await Promise.all([adminProducts(), adminCollections(), adminTestimonials()]);
  const stats = [
    { label: "Produtos publicados", value: products.filter((p) => p.published).length, icon: Gem },
    { label: "Em destaque", value: products.filter((p) => p.featured).length, icon: Star },
    { label: "Coleções", value: collections.length, icon: Sparkles },
    { label: "Depoimentos", value: testimonials.length, icon: MessageSquareQuote },
  ];
  const noImage = products.filter((p) => p.images.length === 0);

  return (
    <>
      <PageTitle
        title="Visão geral"
        description="Gerencie o catálogo e o conteúdo do site."
        action={
          <Link href="/admin/produtos/novo" className="inline-flex min-h-11 items-center gap-2 bg-gold px-5 text-xs uppercase tracking-[0.2em] text-noir">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <Icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
            <p className="mt-4 font-display text-3xl">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ivory/50">{label}</p>
          </Card>
        ))}
      </div>
      {noImage.length > 0 && (
        <Card className="mt-6 border-gold/30">
          <p className="text-sm text-gold-light">{noImage.length} produto(s) sem fotografia:</p>
          <ul className="mt-2 space-y-1 text-sm text-ivory/70">
            {noImage.slice(0, 8).map((p) => (
              <li key={p.id}>
                <Link href={`/admin/produtos/${p.id}`} className="underline-offset-4 hover:underline">{p.name}</Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

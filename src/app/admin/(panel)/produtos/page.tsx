import Link from "next/link";
import { Plus } from "lucide-react";
import { adminCategories, adminProducts } from "@/lib/admin-data";
import { PageTitle } from "@/components/admin/ui";
import { ProductTable } from "./ProductTable";

export const metadata = { title: "Produtos" };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([adminProducts(), adminCategories()]);
  return (
    <>
      <PageTitle
        title="Produtos"
        description={`${products.length} produto(s) cadastrado(s). Use as setas para organizar a ordem de exibição.`}
        action={
          <Link href="/admin/produtos/novo" className="inline-flex min-h-11 items-center gap-2 bg-gold px-5 text-xs uppercase tracking-[0.2em] text-noir">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        }
      />
      <ProductTable products={products} categories={categories} />
    </>
  );
}

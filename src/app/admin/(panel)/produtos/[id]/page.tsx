import { notFound } from "next/navigation";
import { adminCategories, adminProduct } from "@/lib/admin-data";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Editar produto" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([adminProduct(id), adminCategories()]);
  if (!product) notFound();
  return <ProductForm product={product} categories={categories} />;
}

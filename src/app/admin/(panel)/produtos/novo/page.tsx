import { adminCategories } from "@/lib/admin-data";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Novo produto" };

export default async function NewProductPage() {
  const categories = await adminCategories();
  return <ProductForm categories={categories} />;
}

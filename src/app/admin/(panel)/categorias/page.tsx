import { adminCategories } from "@/lib/admin-data";
import { PageTitle } from "@/components/admin/ui";
import { CategoryEditor } from "./CategoryEditor";

export const metadata = { title: "Categorias" };

export default async function CategoriesPage() {
  const categories = await adminCategories();
  return (
    <>
      <PageTitle title="Categorias" description="Organizam o catálogo e os filtros do site." />
      <CategoryEditor categories={categories} />
    </>
  );
}

import { adminCategories, adminCollections } from "@/lib/admin-data";
import { PageTitle } from "@/components/admin/ui";
import { CollectionEditor } from "./CollectionEditor";

export const metadata = { title: "Coleções" };

export default async function CollectionsAdminPage() {
  const [collections, categories] = await Promise.all([adminCollections(), adminCategories()]);
  return (
    <>
      <PageTitle title="Coleções" description="Seções cinematográficas da página inicial. Cada coleção abre o catálogo filtrado pela categoria escolhida." />
      <CollectionEditor collections={collections} categories={categories} />
    </>
  );
}

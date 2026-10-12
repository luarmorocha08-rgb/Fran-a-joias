import { adminTestimonials } from "@/lib/admin-data";
import { PageTitle } from "@/components/admin/ui";
import { TestimonialEditor } from "./TestimonialEditor";

export const metadata = { title: "Depoimentos" };

export default async function TestimonialsAdminPage() {
  const items = await adminTestimonials();
  return (
    <>
      <PageTitle title="Depoimentos" description="Cadastre apenas avaliações reais, com autorização dos clientes. Sem depoimentos publicados, a seção fica oculta no site." />
      <TestimonialEditor items={items} />
    </>
  );
}

import { adminSettings } from "@/lib/admin-data";
import { PageTitle } from "@/components/admin/ui";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Conteúdo e contato" };

export default async function SettingsPage() {
  const settings = await adminSettings();
  return (
    <>
      <PageTitle title="Conteúdo e contato" description="Textos institucionais, fotografias de destaque e canais de atendimento." />
      <SettingsForm settings={settings} />
    </>
  );
}

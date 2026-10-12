import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";
import { SiteProvider } from "@/components/SiteProvider";
import { getSettings, isDemoMode } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SiteProvider settings={settings}>
      {isDemoMode && <DemoBanner />}
      <Header />
      <main id="conteudo">{children}</main>
      <Footer demo={isDemoMode} />
      <FloatingWhatsApp />
      <AnalyticsScripts />
    </SiteProvider>
  );
}

import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Montserrat } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cinzel", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "França Jóias · Alianças de Moedas, Ouro e Prata em Marília — SP",
    template: "%s · França Jóias",
  },
  description:
    "Única loja de Marília especializada em alianças de moedas. Fabricamos também alianças de ouro e prata. Conheça a coleção e fale com um especialista pelo WhatsApp.",
  keywords: ["alianças de moedas", "alianças de ouro", "alianças de prata", "joalheria Marília", "França Jóias", "alianças de casamento"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "França Jóias",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${cinzel.variable} ${montserrat.variable}`}>
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}

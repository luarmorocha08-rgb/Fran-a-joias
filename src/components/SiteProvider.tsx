"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/types";

const SiteContext = createContext<SiteSettings | null>(null);

export function SiteProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return <SiteContext.Provider value={settings}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite deve ser usado dentro de <SiteProvider>");
  return ctx;
}

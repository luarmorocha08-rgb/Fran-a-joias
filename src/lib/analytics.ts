"use client";

/**
 * Camada única de eventos. Envia para dataLayer (GTM), gtag (GA4) e fbq (Meta Pixel)
 * somente quando estiverem carregados. Nunca enviar dados pessoais.
 */
export type AnalyticsEvent =
  | "product_view"
  | "whatsapp_click"
  | "instagram_click"
  | "collection_click"
  | "catalog_search";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_MAP: Partial<Record<AnalyticsEvent, string>> = {
  product_view: "ViewContent",
  whatsapp_click: "Contact",
  catalog_search: "Search",
};

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    window.gtag?.("event", event, params);
    const metaEvent = META_MAP[event];
    if (metaEvent) window.fbq?.("track", metaEvent, params);
    else window.fbq?.("trackCustom", event, params);
    if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, params);
  } catch {
    /* analytics nunca deve quebrar a navegação */
  }
}

import type { ProductWithCategory } from "./types";
import { normalize } from "./format";

export type CatalogFilters = {
  q: string;
  categoria: string;
  material: string;
  min: string;
  max: string;
  disponivel: boolean;
};

export const EMPTY_FILTERS: CatalogFilters = { q: "", categoria: "", material: "", min: "", max: "", disponivel: false };

export function parseFilters(sp: Record<string, string | string[] | undefined>): CatalogFilters {
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return {
    q: get("q"),
    categoria: get("categoria"),
    material: get("material"),
    min: get("min"),
    max: get("max"),
    disponivel: get("disponivel") === "1",
  };
}

export function toQuery(f: CatalogFilters) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.categoria) p.set("categoria", f.categoria);
  if (f.material) p.set("material", f.material);
  if (f.min) p.set("min", f.min);
  if (f.max) p.set("max", f.max);
  if (f.disponivel) p.set("disponivel", "1");
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function filterProducts(products: ProductWithCategory[], f: CatalogFilters) {
  const q = normalize(f.q.trim());
  const min = f.min ? Number(f.min) : null;
  const max = f.max ? Number(f.max) : null;
  return products.filter((p) => {
    if (q && !normalize(`${p.name} ${p.code} ${p.material ?? ""} ${p.category?.name ?? ""}`).includes(q)) return false;
    if (f.categoria && p.category?.slug !== f.categoria) return false;
    if (f.material && normalize(p.material ?? "") !== normalize(f.material)) return false;
    if (f.disponivel && !p.available) return false;
    if (min != null || max != null) {
      // Faixa de preço considera apenas produtos com preço publicado
      if (p.price_on_request || p.price == null) return false;
      if (min != null && p.price < min) return false;
      if (max != null && p.price > max) return false;
    }
    return true;
  });
}


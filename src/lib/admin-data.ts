import "server-only";
import { requireAdmin } from "./auth";
import type { Category, Collection, Product, SiteSettings, Testimonial } from "./types";

/** Leituras do painel: usam a sessão do administrador (enxergam também itens não publicados). */
export async function adminDb() {
  const { supabase } = await requireAdmin();
  return supabase;
}

export async function adminProducts() {
  const db = await adminDb();
  const { data, error } = await db.from("products").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Product[]).map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
}

export async function adminProduct(id: string) {
  const db = await adminDb();
  const { data } = await db.from("products").select("*").eq("id", id).maybeSingle();
  return data as Product | null;
}

export async function adminCategories() {
  const db = await adminDb();
  const { data, error } = await db.from("categories").select("*").order("sort_order").order("name");
  if (error) throw error;
  return data as Category[];
}

export async function adminCollections() {
  const db = await adminDb();
  const { data, error } = await db.from("collections").select("*").order("sort_order");
  if (error) throw error;
  return data as Collection[];
}

export async function adminTestimonials() {
  const db = await adminDb();
  const { data, error } = await db.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Testimonial[];
}

export async function adminSettings() {
  const db = await adminDb();
  const { data, error } = await db.from("site_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data as SiteSettings;
}

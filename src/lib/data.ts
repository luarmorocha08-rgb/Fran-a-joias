import "server-only";
import { cache } from "react";
import { isSupabaseConfigured } from "./config";
import { getPublicClient } from "./supabase/public";
import {
  DEMO_CATEGORIES,
  DEMO_COLLECTIONS,
  DEMO_PRODUCTS,
  DEMO_SETTINGS,
  DEMO_TESTIMONIALS,
} from "./demo-data";
import type {
  Category,
  CollectionWithCategory,
  Product,
  ProductWithCategory,
  SiteSettings,
  Testimonial,
} from "./types";

export const isDemoMode = !isSupabaseConfigured;

function withCategory<T extends { category_id: string | null }>(items: T[], categories: Category[]) {
  return items.map((item) => ({
    ...item,
    category: categories.find((c) => c.id === item.category_id) ?? null,
  }));
}

function sanitizeProduct(p: Product): Product {
  return { ...p, price: p.price == null ? null : Number(p.price), images: Array.isArray(p.images) ? p.images : [] };
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = getPublicClient();
  if (!db) return DEMO_SETTINGS;
  const { data, error } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) console.error("[data] settings", error.message);
  return { ...DEMO_SETTINGS, ...(data ?? {}) } as SiteSettings;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = getPublicClient();
  if (!db) return DEMO_CATEGORIES;
  const { data, error } = await db.from("categories").select("*").order("sort_order").order("name");
  if (error) {
    console.error("[data] categories", error.message);
    return [];
  }
  return data as Category[];
});

export const getProducts = cache(async (): Promise<ProductWithCategory[]> => {
  const categories = await getCategories();
  const db = getPublicClient();
  if (!db) return withCategory(DEMO_PRODUCTS, categories);
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[data] products", error.message);
    return [];
  }
  return withCategory((data as Product[]).map(sanitizeProduct), categories);
});

export const getProductBySlug = cache(async (slug: string): Promise<ProductWithCategory | null> => {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
});

export const getCollections = cache(async (): Promise<CollectionWithCategory[]> => {
  const categories = await getCategories();
  const db = getPublicClient();
  if (!db) return withCategory(DEMO_COLLECTIONS, categories);
  const { data, error } = await db.from("collections").select("*").eq("published", true).order("sort_order");
  if (error) {
    console.error("[data] collections", error.message);
    return [];
  }
  return withCategory(data as CollectionWithCategory[], categories);
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = getPublicClient();
  if (!db) return DEMO_TESTIMONIALS;
  const { data, error } = await db.from("testimonials").select("*").eq("published", true).order("sort_order");
  if (error) {
    console.error("[data] testimonials", error.message);
    return [];
  }
  return data as Testimonial[];
});

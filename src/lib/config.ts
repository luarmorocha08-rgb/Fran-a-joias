export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** true quando as credenciais do Supabase estão configuradas. Caso contrário o site usa dados demonstrativos. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const MEDIA_BUCKET = "media";

export const BRAND = {
  name: "França Jóias",
  city: "Marília — SP",
  whatsapp: "5514991477961",
  instagramUrl: "https://www.instagram.com/franca.joiasmarilia/",
  instagramHandle: "@franca.joiasmarilia",
} as const;

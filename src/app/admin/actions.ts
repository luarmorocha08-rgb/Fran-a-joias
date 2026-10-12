"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { MEDIA_BUCKET, isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import type { ProductImage } from "@/lib/types";

export type ActionState = { ok: boolean; message?: string; error?: string; id?: string } | null;

type Supa = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

// ---------------------------------------------------------------- helpers
const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const strOrNull = (fd: FormData, k: string) => str(fd, k) || null;
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const int = (fd: FormData, k: string, fallback = 0) => {
  const n = Number.parseInt(str(fd, k), 10);
  return Number.isFinite(n) ? n : fallback;
};

function fail(e: unknown): ActionState {
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : "Erro inesperado.";
  if (/duplicate key.*slug/i.test(msg)) return { ok: false, error: "Já existe um registro com este endereço (slug)." };
  if (/duplicate key.*code/i.test(msg)) return { ok: false, error: "Já existe um produto com este código." };
  return { ok: false, error: msg };
}

function refresh() {
  revalidatePath("/", "layout");
}

async function uploadImage(supabase: Supa, file: File, folder: string) {
  if (!ALLOWED_IMAGES.includes(file.type)) throw new Error(`Formato não suportado: ${file.name}. Use JPG, PNG, WEBP ou AVIF.`);
  if (file.size > MAX_IMAGE_BYTES) throw new Error(`Imagem muito grande: ${file.name} (máx. 8 MB).`);
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/** Modelos 3D reais das peças (GLB/GLTF). */
async function uploadModel(supabase: Supa, file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "glb" && ext !== "gltf") throw new Error("O modelo 3D deve ser um arquivo .glb ou .gltf.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Modelo 3D muito grande (máx. 10 MB).");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const contentType = ext === "glb" ? "model/gltf-binary" : "model/gltf+json";
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType, cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function removeFiles(supabase: Supa, paths: (string | null | undefined)[]) {
  const valid = paths.filter((p): p is string => Boolean(p));
  if (valid.length) await supabase.storage.from(MEDIA_BUCKET).remove(valid);
}

function files(fd: FormData, key: string) {
  return fd.getAll(key).filter((f): f is File => f instanceof File && f.size > 0);
}

async function nextProductCode(supabase: Supa) {
  const { data } = await supabase.from("products").select("code").ilike("code", "FJ-%");
  const max = (data ?? []).reduce((m, r) => Math.max(m, Number.parseInt(String(r.code).replace(/\D/g, ""), 10) || 0), 0);
  return `FJ-${String(max + 1).padStart(3, "0")}`;
}

// ---------------------------------------------------------------- auth
export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

// ---------------------------------------------------------------- produtos
export async function saveProduct(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = str(fd, "id") || null;
    const name = str(fd, "name");
    if (!name) return { ok: false, error: "Informe o nome do produto." };

    const priceRaw = str(fd, "price").replace(/\./g, "").replace(",", ".");
    const price = priceRaw ? Number(priceRaw) : null;
    if (price != null && (!Number.isFinite(price) || price < 0)) return { ok: false, error: "Preço inválido." };
    const priceOnRequest = bool(fd, "price_on_request") || price == null;

    // imagens existentes (ordem/alt editados no cliente) + novas
    let kept: ProductImage[] = [];
    try {
      kept = JSON.parse(str(fd, "images") || "[]");
    } catch {
      return { ok: false, error: "Lista de imagens inválida." };
    }
    const removed: string[] = JSON.parse(str(fd, "removed_paths") || "[]");

    const record = {
      name,
      slug: slugify(str(fd, "slug") || name),
      code: str(fd, "code") || (await nextProductCode(supabase)),
      category_id: strOrNull(fd, "category_id"),
      material: strOrNull(fd, "material"),
      finish: strOrNull(fd, "finish"),
      width: strOrNull(fd, "width"),
      short_description: strOrNull(fd, "short_description"),
      description: strOrNull(fd, "description"),
      customization: strOrNull(fd, "customization"),
      additional_info: strOrNull(fd, "additional_info"),
      price,
      price_on_request: priceOnRequest,
      available: bool(fd, "available"),
      featured: bool(fd, "featured"),
      published: bool(fd, "published"),
      sort_order: int(fd, "sort_order"),
      model_url: strOrNull(fd, "model_url"),
    };

    let productId = id;
    if (productId) {
      const { error } = await supabase.from("products").update(record).eq("id", productId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("products").insert({ ...record, images: [] }).select("id").single();
      if (error) throw error;
      productId = data.id as string;
    }

    const [modelFile] = files(fd, "model_file");
    if (modelFile) {
      const url = await uploadModel(supabase, modelFile, `models/${productId}`);
      const { error } = await supabase.from("products").update({ model_url: url }).eq("id", productId);
      if (error) throw error;
    }

    const uploaded: ProductImage[] = [];
    for (const file of files(fd, "new_images")) {
      const up = await uploadImage(supabase, file, `products/${productId}`);
      uploaded.push({ ...up, alt: name });
    }
    const images = [...kept.map((i) => ({ url: i.url, path: i.path ?? null, alt: i.alt || name })), ...uploaded];
    const { error: imgErr } = await supabase.from("products").update({ images }).eq("id", productId);
    if (imgErr) throw imgErr;
    await removeFiles(supabase, removed);

    refresh();
    return { ok: true, message: id ? "Produto atualizado." : "Produto cadastrado.", id: productId! };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProduct(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { data } = await supabase.from("products").select("images").eq("id", id).single();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    await removeFiles(supabase, ((data?.images as ProductImage[]) ?? []).map((i) => i.path));
    refresh();
    return { ok: true, message: "Produto excluído." };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleProductFlag(id: string, field: "available" | "featured" | "published", value: boolean): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Reordena uma tabela a partir da lista de ids na nova ordem. */
export async function reorder(table: "products" | "categories" | "collections" | "testimonials", ids: string[]): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    if (!["products", "categories", "collections", "testimonials"].includes(table)) throw new Error("Tabela inválida.");
    for (const [i, id] of ids.entries()) {
      const { error } = await supabase.from(table).update({ sort_order: i + 1 }).eq("id", id);
      if (error) throw error;
    }
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------- categorias
export async function saveCategory(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = str(fd, "id") || null;
    const name = str(fd, "name");
    if (!name) return { ok: false, error: "Informe o nome da categoria." };
    const record = { name, slug: slugify(str(fd, "slug") || name), description: strOrNull(fd, "description"), sort_order: int(fd, "sort_order") };
    const { error } = id ? await supabase.from("categories").update(record).eq("id", id) : await supabase.from("categories").insert(record);
    if (error) throw error;
    refresh();
    return { ok: true, message: id ? "Categoria atualizada." : "Categoria criada." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategory(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true, message: "Categoria excluída. Os produtos dela ficaram sem categoria." };
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------- coleções
export async function saveCollection(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = str(fd, "id") || null;
    const title = str(fd, "title");
    if (!title) return { ok: false, error: "Informe o título da coleção." };
    const record: Record<string, unknown> = {
      title,
      slug: slugify(str(fd, "slug") || title),
      tagline: strOrNull(fd, "tagline"),
      description: strOrNull(fd, "description"),
      category_id: strOrNull(fd, "category_id"),
      theme: str(fd, "theme") === "light" ? "light" : "dark",
      published: bool(fd, "published"),
      sort_order: int(fd, "sort_order"),
    };
    const [image] = files(fd, "image");
    const oldPath = str(fd, "image_path") || null;
    if (image) {
      const up = await uploadImage(supabase, image, "collections");
      record.image_url = up.url;
      record.image_path = up.path;
    } else if (bool(fd, "remove_image")) {
      record.image_url = null;
      record.image_path = null;
    }
    const { error } = id ? await supabase.from("collections").update(record).eq("id", id) : await supabase.from("collections").insert(record);
    if (error) throw error;
    if ((image || bool(fd, "remove_image")) && oldPath) await removeFiles(supabase, [oldPath]);
    refresh();
    return { ok: true, message: id ? "Coleção atualizada." : "Coleção criada." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCollection(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { data } = await supabase.from("collections").select("image_path").eq("id", id).single();
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) throw error;
    await removeFiles(supabase, [data?.image_path]);
    refresh();
    return { ok: true, message: "Coleção excluída." };
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------- depoimentos
export async function saveTestimonial(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const id = str(fd, "id") || null;
    const author_name = str(fd, "author_name");
    const text = str(fd, "text");
    if (!author_name || !text) return { ok: false, error: "Informe o nome do cliente e o depoimento." };
    const rating = int(fd, "rating", 0);
    const record = {
      author_name,
      text,
      location: strOrNull(fd, "location"),
      rating: rating >= 1 && rating <= 5 ? rating : null,
      published: bool(fd, "published"),
      sort_order: int(fd, "sort_order"),
    };
    const { error } = id ? await supabase.from("testimonials").update(record).eq("id", id) : await supabase.from("testimonials").insert(record);
    if (error) throw error;
    refresh();
    return { ok: true, message: id ? "Depoimento atualizado." : "Depoimento cadastrado." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteTestimonial(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true, message: "Depoimento excluído." };
  } catch (e) {
    return fail(e);
  }
}

// ---------------------------------------------------------------- configurações
export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const whatsapp = str(fd, "whatsapp_number").replace(/\D/g, "");
    if (whatsapp.length < 12) return { ok: false, error: "WhatsApp inválido. Use o formato com DDI e DDD, ex.: 5514991477961." };
    const instagram = str(fd, "instagram_url");
    if (instagram && !/^https:\/\/(www\.)?instagram\.com\//.test(instagram)) return { ok: false, error: "Link do Instagram deve começar com https://www.instagram.com/" };

    const { data: current } = await supabase.from("site_settings").select("about_image_path, detail_image_path").eq("id", 1).single();
    const record: Record<string, unknown> = {
      whatsapp_number: whatsapp,
      instagram_url: instagram,
      instagram_handle: str(fd, "instagram_handle"),
      city: str(fd, "city"),
      address: strOrNull(fd, "address"),
      opening_hours: strOrNull(fd, "opening_hours"),
      email: strOrNull(fd, "email"),
      hero_title: str(fd, "hero_title") || "França Jóias",
      hero_tagline: str(fd, "hero_tagline"),
      about_title: str(fd, "about_title"),
      about_text: str(fd, "about_text"),
      detail_model_url: strOrNull(fd, "detail_model_url"),
    };
    const [modelFile] = files(fd, "detail_model_file");
    if (modelFile) record.detail_model_url = await uploadModel(supabase, modelFile, "models/site");
    const toRemove: (string | null | undefined)[] = [];
    for (const key of ["about", "detail"] as const) {
      const [file] = files(fd, `${key}_image`);
      if (file) {
        const up = await uploadImage(supabase, file, "site");
        record[`${key}_image_url`] = up.url;
        record[`${key}_image_path`] = up.path;
        toRemove.push(current?.[`${key}_image_path`]);
      } else if (bool(fd, `remove_${key}_image`)) {
        record[`${key}_image_url`] = null;
        record[`${key}_image_path`] = null;
        toRemove.push(current?.[`${key}_image_path`]);
      }
    }
    const { error } = await supabase.from("site_settings").update(record).eq("id", 1);
    if (error) throw error;
    await removeFiles(supabase, toRemove);
    refresh();
    return { ok: true, message: "Configurações salvas." };
  } catch (e) {
    return fail(e);
  }
}

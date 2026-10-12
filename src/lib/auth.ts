import "server-only";
import { isSupabaseConfigured } from "./config";
import { createSupabaseServerClient } from "./supabase/server";

export type AdminSession = Awaited<ReturnType<typeof getAdminSession>>;

/**
 * Valida no servidor: usuário autenticado (getUser consulta o Supabase Auth, não confia apenas no cookie)
 * E presente na tabela admin_users.
 */
export async function getAdminSession() {
  if (!isSupabaseConfigured) return { status: "demo" as const };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" as const };
  const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) return { status: "forbidden" as const, user };
  return { status: "admin" as const, user, supabase };
}

/** Para server actions: lança erro se não for administrador. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.status === "demo") throw new Error("Modo demonstração: conecte o Supabase para salvar alterações.");
  if (session.status === "anonymous") throw new Error("Sessão expirada. Entre novamente em /admin/login.");
  if (session.status !== "admin") throw new Error("Acesso não autorizado.");
  return session;
}

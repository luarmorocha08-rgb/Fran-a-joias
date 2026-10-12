"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Monogram } from "@/components/icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { inputCls } from "@/components/admin/ui";
import { signOut } from "../actions";

export function LoginForm({ forbidden }: { forbidden: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Monogram className="mx-auto h-16 w-16" />
        <h1 className="mt-6 text-center font-serif text-3xl">Painel França Jóias</h1>
        <p className="mt-2 text-center text-sm text-ivory/50">Acesso restrito à equipe</p>

        {forbidden ? (
          <div className="mt-10 space-y-4 text-center">
            <p className="border border-ruby bg-ruby/30 px-4 py-3 text-sm">Este usuário não tem permissão de administrador.</p>
            <form action={signOut}>
              <button className="text-xs uppercase tracking-[0.2em] text-gold underline underline-offset-8">Entrar com outra conta</button>
            </form>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.18em] text-ivory/60">E-mail</span>
              <input name="email" type="email" required autoComplete="email" className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.18em] text-ivory/60">Senha</span>
              <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
            </label>
            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            <button type="submit" disabled={loading} className="flex min-h-11 w-full items-center justify-center gap-2 bg-gold text-xs font-medium uppercase tracking-[0.2em] text-noir hover:bg-gold-light disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

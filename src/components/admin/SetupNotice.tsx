import Link from "next/link";
import { Monogram } from "../icons";

/** Exibido quando o Supabase ainda não foi configurado. */
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Monogram className="h-14 w-14" />
      <h1 className="mt-6 font-serif text-4xl">Painel em modo demonstração</h1>
      <p className="mt-4 text-ivory/65">
        O Supabase ainda não está conectado. O site público exibe dados demonstrativos e nenhuma alteração pode ser salva.
        Para ativar o painel:
      </p>
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ivory/75">
        <li>Crie um projeto em <span className="text-gold-light">supabase.com</span>.</li>
        <li>No SQL Editor, execute <code className="text-gold-light">supabase/migrations/0001_init.sql</code> e depois <code className="text-gold-light">supabase/seed.sql</code>.</li>
        <li>Copie <code>.env.example</code> para <code>.env.local</code> e preencha <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
        <li>Em Authentication → Users, crie o usuário administrador (e-mail e senha).</li>
        <li>
          Autorize-o no SQL Editor:{" "}
          <code className="block whitespace-pre-wrap break-all bg-white/5 p-3 text-xs text-gold-light">
            insert into public.admin_users (user_id) select id from auth.users where email = &apos;seu@email.com&apos;;
          </code>
        </li>
        <li>Reinicie o servidor e acesse <code>/admin</code>.</li>
      </ol>
      <p className="mt-6 text-sm text-ivory/50">Instruções completas no README do projeto.</p>
      <Link href="/" className="mt-10 inline-block text-xs uppercase tracking-[0.2em] text-gold underline underline-offset-8">
        Voltar ao site
      </Link>
    </div>
  );
}

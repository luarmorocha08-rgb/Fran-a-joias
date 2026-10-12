import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-noir px-6 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <p className="mt-4 font-serif text-3xl">Página não encontrada</p>
      <Link href="/" className="mt-8 text-xs uppercase tracking-[0.24em] text-gold-light underline underline-offset-8">
        Voltar ao início
      </Link>
    </main>
  );
}

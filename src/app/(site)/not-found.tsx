import Link from "next/link";
import { btn } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[80svh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-display text-7xl text-gold-metal">404</p>
      <h1 className="mt-6 font-serif text-4xl font-light">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-ivory/60">O conteúdo que você procura pode ter sido removido ou o endereço está incorreto.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/produtos" className={btn.gold}>Ver catálogo</Link>
        <Link href="/" className={btn.outline}>Página inicial</Link>
      </div>
    </section>
  );
}

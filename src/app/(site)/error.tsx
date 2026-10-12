"use client";

import { useEffect } from "react";
import { btn } from "@/components/ui/styles";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="container-luxe flex min-h-[70svh] flex-col items-center justify-center pt-24 text-center">
      <h1 className="font-serif text-4xl font-light">Algo não saiu como esperado</h1>
      <p className="mt-4 max-w-md text-ivory/60">Não foi possível carregar este conteúdo. Tente novamente em instantes.</p>
      <button type="button" onClick={reset} className={`${btn.gold} mt-10`}>Tentar novamente</button>
    </section>
  );
}

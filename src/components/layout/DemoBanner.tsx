/** Selo visível quando o site roda com dados demonstrativos (Supabase não configurado). */
export function DemoBanner() {
  return (
    <div
      role="status"
      title="Produtos e imagens ilustrativos. Conecte o Supabase para exibir o catálogo real."
      className="fixed bottom-5 left-4 z-40 hidden md:block max-w-[60vw] border border-ruby/60 bg-ruby/90 px-3 py-2 text-[0.58rem] uppercase leading-tight tracking-[0.16em] text-ivory backdrop-blur md:bottom-8 md:left-8"
    >
      Modo demonstração · dados ilustrativos
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, ProductWithCategory } from "@/lib/types";
import { EMPTY_FILTERS, filterProducts, parseFilters, toQuery, type CatalogFilters } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { ProductCard } from "./ProductCard";
import { WhatsAppLink } from "../ContactLinks";
import { MESSAGES } from "@/lib/whatsapp";

type Props = {
  products: ProductWithCategory[];
  categories: Category[];
  initial?: CatalogFilters;
  /** sincroniza filtros com a URL (página /produtos) */
  syncUrl?: boolean;
  limit?: number;
};

export function Catalog(props: Props) {
  return props.syncUrl ? <UrlCatalog {...props} /> : <CatalogView {...props} />;
}

/** Variante que lê o estado inicial dos filtros da URL (?categoria=...&q=...). Requer <Suspense>. */
function UrlCatalog(props: Props) {
  const sp = useSearchParams();
  const initial = useMemo(() => parseFilters(Object.fromEntries(sp.entries())), [sp]);
  return <CatalogView {...props} initial={initial} key={initial.categoria} />;
}

function CatalogView({ products, categories, initial = EMPTY_FILTERS, syncUrl = false, limit }: Props) {
  const [filters, setFilters] = useState<CatalogFilters>(initial);
  const [panelOpen, setPanelOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const materials = useMemo(
    () => Array.from(new Set(products.map((p) => p.material?.trim()).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [products],
  );
  const hasPrices = useMemo(() => products.some((p) => !p.price_on_request && p.price != null), [products]);
  const usedCategories = useMemo(() => categories.filter((c) => products.some((p) => p.category_id === c.id)), [categories, products]);

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const visible = limit ? results.slice(0, limit) : results;
  const activeCount = [filters.material, filters.min, filters.max, filters.disponivel ? "1" : ""].filter(Boolean).length;

  useEffect(() => {
    if (!syncUrl) return;
    const next = `${pathname}${toQuery(filters)}`;
    startTransition(() => router.replace(next, { scroll: false }));
  }, [filters, syncUrl, pathname, router]);

  const update = (patch: Partial<CatalogFilters>) => setFilters((f) => ({ ...f, ...patch }));

  const onSearch = (q: string) => {
    update({ q });
    clearTimeout(searchTimer.current);
    if (q.trim().length >= 2) {
      searchTimer.current = setTimeout(() => track("catalog_search", { search_term: q.trim().slice(0, 60) }), 900);
    }
  };

  const filterControls = (
    <div className="space-y-8">
      <fieldset>
        <legend className="eyebrow mb-4">Material</legend>
        <select
          value={filters.material}
          onChange={(e) => update({ material: e.target.value })}
          className="h-12 w-full border border-gold/25 bg-noir px-4 text-sm text-ivory focus:border-gold"
          aria-label="Filtrar por material"
        >
          <option value="">Todos os materiais</option>
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </fieldset>

      {hasPrices && (
        <fieldset>
          <legend className="eyebrow mb-4">Faixa de preço (R$)</legend>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Mín."
              value={filters.min}
              onChange={(e) => update({ min: e.target.value })}
              className="h-12 w-full border border-gold/25 bg-noir px-4 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold"
              aria-label="Preço mínimo"
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Máx."
              value={filters.max}
              onChange={(e) => update({ max: e.target.value })}
              className="h-12 w-full border border-gold/25 bg-noir px-4 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold"
              aria-label="Preço máximo"
            />
          </div>
          <p className="mt-2 text-[0.65rem] text-ivory/40">Produtos “sob consulta” não entram no filtro de preço.</p>
        </fieldset>
      )}

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ivory/80">
        <input
          type="checkbox"
          checked={filters.disponivel}
          onChange={(e) => update({ disponivel: e.target.checked })}
          className="h-5 w-5 accent-[#c59a45]"
        />
        Somente disponíveis
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={() => setFilters({ ...EMPTY_FILTERS, q: filters.q })} className="text-xs uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline">
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Pesquisa + categorias */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" strokeWidth={1.4} />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Pesquisar por nome ou código"
            aria-label="Pesquisar produtos"
            className="h-12 w-full border border-gold/25 bg-transparent pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold"
          />
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="inline-flex h-12 items-center justify-center gap-2 border border-gold/25 px-5 text-[0.65rem] uppercase tracking-[0.22em] text-ivory lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 text-gold" strokeWidth={1.4} /> Filtros {activeCount > 0 && <span className="text-gold">({activeCount})</span>}
        </button>
      </div>

      <div role="tablist" aria-label="Categorias" className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        {[{ slug: "", name: "Todas" }, ...usedCategories].map((c) => {
          const active = filters.categoria === c.slug;
          return (
            <button
              key={c.slug || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                update({ categoria: c.slug });
                if (c.slug) track("collection_click", { collection: c.slug, source: "catalog_tabs" });
              }}
              className={`min-h-11 shrink-0 whitespace-nowrap border px-5 text-[0.62rem] uppercase tracking-[0.2em] transition-all duration-500 ${
                active ? "border-gold bg-gold text-noir" : "border-gold/20 text-ivory/70 hover:border-gold/60 hover:text-ivory"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-28">{filterControls}</div>
        </aside>

        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.2em] text-ivory/45" aria-live="polite">
            {results.length} {results.length === 1 ? "modelo encontrado" : "modelos encontrados"}
          </p>
          {visible.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
              {visible.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} priority={i < 2} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              hasProducts={products.length > 0}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
          )}
        </div>
      </div>

      {/* Painel de filtros no mobile */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Fechar filtros" className="absolute inset-0 bg-noir/70 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto border-t border-gold/30 bg-noir-2 p-6 pb-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="font-serif text-2xl">Filtros</p>
                <button type="button" onClick={() => setPanelOpen(false)} className="grid h-11 w-11 place-items-center" aria-label="Fechar">
                  <X className="h-5 w-5" strokeWidth={1.3} />
                </button>
              </div>
              {filterControls}
              <button type="button" onClick={() => setPanelOpen(false)} className="mt-10 h-12 w-full bg-gold-metal text-[0.68rem] uppercase tracking-[0.24em] text-noir">
                Ver {results.length} {results.length === 1 ? "modelo" : "modelos"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ hasProducts, onReset }: { hasProducts: boolean; onReset: () => void }) {
  return (
    <div className="border border-dashed border-gold/25 px-6 py-16 text-center">
      <p className="font-serif text-3xl text-ivory">{hasProducts ? "Nenhum modelo encontrado" : "Catálogo em atualização"}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-ivory/55">
        {hasProducts
          ? "Ajuste os filtros ou fale com a nossa equipe: produzimos modelos sob encomenda."
          : "Em breve novos modelos por aqui. Enquanto isso, fale com a nossa equipe pelo WhatsApp."}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {hasProducts && (
          <button type="button" onClick={onReset} className="min-h-11 border border-gold/40 px-6 text-[0.65rem] uppercase tracking-[0.22em] text-gold-light">
            Limpar filtros
          </button>
        )}
        <WhatsAppLink source="catalog_empty" message={MESSAGES.general} className="inline-flex min-h-11 items-center bg-gold-metal px-6 text-[0.65rem] uppercase tracking-[0.22em] text-noir">
          Falar no WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}

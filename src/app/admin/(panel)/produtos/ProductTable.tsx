"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Search } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { formatPrice, normalize } from "@/lib/format";
import { deleteProduct, toggleProductFlag } from "../../actions";
import { DeleteButton, OrderButtons, inputCls } from "@/components/admin/ui";
import { Media } from "@/components/ui/Media";

function Flag({ id, field, value, label }: { id: string; field: "available" | "featured" | "published"; value: boolean; label: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => { await toggleProductFlag(id, field, !value); router.refresh(); })}
      className={`min-h-8 border px-2 text-[0.6rem] uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${value ? "border-gold/60 bg-gold/15 text-gold-light" : "border-white/10 text-ivory/35"}`}
      aria-pressed={value}
      title={`Alternar: ${label}`}
    >
      {label}
    </button>
  );
}

export function ProductTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const ids = products.map((p) => p.id);
  const filtered = useMemo(
    () => products.filter((p) => (!cat || p.category_id === cat) && (!q || normalize(`${p.name} ${p.code}`).includes(normalize(q)))),
    [products, q, cat],
  );
  const canReorder = !q && !cat;

  if (!products.length) {
    return (
      <div className="border border-dashed border-white/15 py-16 text-center">
        <p className="text-ivory/60">Nenhum produto cadastrado ainda.</p>
        <Link href="/admin/produtos/novo" className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold underline underline-offset-8">Cadastrar o primeiro</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou código" className={`${inputCls} pl-9`} />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${inputCls} sm:w-56`}>
          <option value="">Todas as categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <ul className="divide-y divide-white/5 border border-white/10">
        {filtered.map((p) => (
          <li key={p.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              {canReorder && <OrderButtons table="products" ids={ids} index={ids.indexOf(p.id)} />}
              <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-white/5">
                <Media src={p.images[0]?.url} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/admin/produtos/${p.id}`} className="block truncate text-sm text-ivory hover:text-gold-light">{p.name}</Link>
                <p className="text-xs text-ivory/40">
                  {p.code} · {categories.find((c) => c.id === p.category_id)?.name ?? "Sem categoria"} · {formatPrice(p.price, p.price_on_request)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Flag id={p.id} field="published" value={p.published} label="Publicado" />
              <Flag id={p.id} field="available" value={p.available} label="Disponível" />
              <Flag id={p.id} field="featured" value={p.featured} label="Destaque" />
              <Link href={`/admin/produtos/${p.id}`} className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs text-ivory/70 hover:text-gold-light">
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Link>
              <DeleteButton action={() => deleteProduct(p.id)} confirmText={`Excluir "${p.name}"? As fotos também serão removidas.`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

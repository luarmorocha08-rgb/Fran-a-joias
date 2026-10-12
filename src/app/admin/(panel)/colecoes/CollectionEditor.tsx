"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Category, Collection } from "@/lib/types";
import { deleteCollection, saveCollection, type ActionState } from "../../actions";
import { Card, Check, DeleteButton, Field, FormMessage, OrderButtons, SubmitButton, inputCls } from "@/components/admin/ui";

function CollectionForm({ collection, categories }: { collection?: Collection; categories: Category[] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveCollection, null);
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) {
      if (!collection) form.current?.reset();
      router.refresh();
    }
  }, [state, collection, router]);
  return (
    <form ref={form} action={action} className="space-y-3">
      <input type="hidden" name="id" value={collection?.id ?? ""} />
      <input type="hidden" name="image_path" value={collection?.image_path ?? ""} />
      <input type="hidden" name="sort_order" value={collection?.sort_order ?? 99} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Título *"><input name="title" required defaultValue={collection?.title} className={inputCls} placeholder="Alianças de Ouro" /></Field>
        <Field label="Endereço (slug)" hint="Ex.: aliancas-de-ouro → /colecoes/aliancas-de-ouro"><input name="slug" defaultValue={collection?.slug} className={inputCls} /></Field>
      </div>
      <Field label="Frase de destaque"><input name="tagline" defaultValue={collection?.tagline ?? ""} className={inputCls} placeholder="Um símbolo eterno para um amor único." /></Field>
      <Field label="Descrição"><textarea name="description" rows={2} defaultValue={collection?.description ?? ""} className={inputCls} /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Categoria vinculada">
          <select name="category_id" defaultValue={collection?.category_id ?? ""} className={inputCls}>
            <option value="">Nenhuma (abre o catálogo completo)</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Fundo da seção">
          <select name="theme" defaultValue={collection?.theme ?? "dark"} className={inputCls}>
            <option value="dark">Preto</option>
            <option value="light">Champagne</option>
          </select>
        </Field>
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-[auto_1fr]">
        {collection?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={collection.image_url} alt="" className="h-24 w-20 object-cover" />
        )}
        <Field label="Fotografia (JPG, PNG, WEBP)">
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-xs text-ivory/60 file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-ivory" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-x-6">
        <Check name="published" label="Publicada" defaultChecked={collection?.published ?? true} />
        {collection?.image_url && <Check name="remove_image" label="Remover fotografia" />}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{collection ? "Salvar" : "Criar coleção"}</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function CollectionEditor({ collections, categories }: { collections: Collection[]; categories: Category[] }) {
  const ids = collections.map((c) => c.id);
  return (
    <div className="space-y-6">
      <Card>
        <p className="mb-4 text-[0.65rem] uppercase tracking-[0.18em] text-gold">Nova coleção</p>
        <CollectionForm categories={categories} />
      </Card>
      <ul className="space-y-3">
        {collections.map((c, i) => (
          <li key={c.id}>
            <details className="group border border-white/10 bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span className="flex items-center gap-2">
                  <OrderButtons table="collections" ids={ids} index={i} />
                  <span>{c.title}</span>
                  {!c.published && <span className="text-xs text-ivory/40">(oculta)</span>}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gold group-open:hidden">Editar</span>
                  <DeleteButton action={() => deleteCollection(c.id)} confirmText={`Excluir a coleção "${c.title}"?`} />
                </span>
              </summary>
              <div className="border-t border-white/10 p-4">
                <CollectionForm collection={c} categories={categories} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

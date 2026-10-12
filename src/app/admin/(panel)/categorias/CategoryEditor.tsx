"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { deleteCategory, saveCategory, type ActionState } from "../../actions";
import { Card, DeleteButton, Field, FormMessage, OrderButtons, SubmitButton, inputCls } from "@/components/admin/ui";

function CategoryForm({ category }: { category?: Category }) {
  const [state, action] = useActionState<ActionState, FormData>(saveCategory, null);
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) {
      if (!category) form.current?.reset();
      router.refresh();
    }
  }, [state, category, router]);
  return (
    <form ref={form} action={action} className="space-y-3">
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <input type="hidden" name="sort_order" value={category?.sort_order ?? 99} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nome *"><input name="name" required defaultValue={category?.name} className={inputCls} /></Field>
        <Field label="Endereço (slug)" hint="Vazio = gerado pelo nome"><input name="slug" defaultValue={category?.slug} className={inputCls} /></Field>
      </div>
      <Field label="Descrição"><input name="description" defaultValue={category?.description ?? ""} className={inputCls} /></Field>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{category ? "Salvar" : "Criar categoria"}</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function CategoryEditor({ categories }: { categories: Category[] }) {
  const ids = categories.map((c) => c.id);
  return (
    <div className="space-y-6">
      <Card>
        <p className="mb-4 text-[0.65rem] uppercase tracking-[0.18em] text-gold">Nova categoria</p>
        <CategoryForm />
      </Card>
      {categories.length === 0 ? (
        <p className="text-sm text-ivory/50">Nenhuma categoria cadastrada.</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((c, i) => (
            <li key={c.id}>
              <details className="group border border-white/10 bg-white/[0.02]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                  <span className="flex items-center gap-2">
                    <OrderButtons table="categories" ids={ids} index={i} />
                    <span>{c.name}</span>
                    <span className="text-xs text-ivory/40">/{c.slug}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-gold group-open:hidden">Editar</span>
                    <DeleteButton action={() => deleteCategory(c.id)} confirmText={`Excluir a categoria "${c.name}"? Os produtos ficarão sem categoria.`} />
                  </span>
                </summary>
                <div className="border-t border-white/10 p-4">
                  <CategoryForm category={c} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

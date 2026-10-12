"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/lib/types";
import { deleteTestimonial, saveTestimonial, type ActionState } from "../../actions";
import { Card, Check, DeleteButton, Field, FormMessage, OrderButtons, SubmitButton, inputCls } from "@/components/admin/ui";

function TestimonialForm({ item }: { item?: Testimonial }) {
  const [state, action] = useActionState<ActionState, FormData>(saveTestimonial, null);
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) {
      if (!item) form.current?.reset();
      router.refresh();
    }
  }, [state, item, router]);
  return (
    <form ref={form} action={action} className="space-y-3">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="sort_order" value={item?.sort_order ?? 99} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Nome do cliente *"><input name="author_name" required defaultValue={item?.author_name} className={inputCls} /></Field>
        <Field label="Cidade (opcional)"><input name="location" defaultValue={item?.location ?? ""} className={inputCls} /></Field>
        <Field label="Avaliação (opcional)">
          <select name="rating" defaultValue={item?.rating ?? ""} className={inputCls}>
            <option value="">Sem nota</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} estrela(s)</option>)}
          </select>
        </Field>
      </div>
      <Field label="Depoimento *"><textarea name="text" required rows={3} defaultValue={item?.text} className={inputCls} /></Field>
      <Check name="published" label="Publicado" defaultChecked={item?.published ?? true} />
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{item ? "Salvar" : "Cadastrar depoimento"}</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function TestimonialEditor({ items }: { items: Testimonial[] }) {
  const ids = items.map((t) => t.id);
  return (
    <div className="space-y-6">
      <Card>
        <p className="mb-4 text-[0.65rem] uppercase tracking-[0.18em] text-gold">Novo depoimento</p>
        <TestimonialForm />
      </Card>
      <ul className="space-y-3">
        {items.map((t, i) => (
          <li key={t.id}>
            <details className="group border border-white/10 bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <span className="flex min-w-0 items-center gap-2">
                  <OrderButtons table="testimonials" ids={ids} index={i} />
                  <span className="truncate">{t.author_name} — <span className="text-ivory/50">{t.text.slice(0, 60)}…</span></span>
                  {!t.published && <span className="text-xs text-ivory/40">(oculto)</span>}
                </span>
                <DeleteButton action={() => deleteTestimonial(t.id)} confirmText={`Excluir o depoimento de ${t.author_name}?`} />
              </summary>
              <div className="border-t border-white/10 p-4">
                <TestimonialForm item={t} />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

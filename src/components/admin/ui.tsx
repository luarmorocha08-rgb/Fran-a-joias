"use client";

import { useFormStatus } from "react-dom";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { reorder } from "@/app/admin/actions";

export const inputCls =
  "w-full border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.18em] text-ivory/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ivory/40">{hint}</span>}
    </label>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-ivory/80">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[#c59a45]" />
      {label}
    </label>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 bg-gold px-6 text-xs font-medium uppercase tracking-[0.2em] text-noir transition-colors hover:bg-gold-light disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Salvando…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p role="status" className={`border px-4 py-3 text-sm ${state.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-ruby bg-ruby/30 text-red-100"}`}>
      {state.ok ? state.message : state.error}
    </p>
  );
}

export function DeleteButton({ action, label = "Excluir", confirmText }: { action: () => Promise<ActionState>; label?: string; confirmText: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        disabled={pending}
        onClick={(e) => {
          e.preventDefault(); // evita abrir/fechar <details> quando usado dentro de <summary>
          if (!window.confirm(confirmText)) return;
          start(async () => {
            const res = await action();
            if (res && !res.ok) setError(res.error ?? "Erro ao excluir.");
            else router.refresh();
          });
        }}
        className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs text-red-300/80 hover:text-red-200 disabled:opacity-50"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} {label}
      </button>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </span>
  );
}

/** Botões ↑ ↓ para organizar a ordem de exibição. */
export function OrderButtons({ table, ids, index }: { table: Parameters<typeof reorder>[0]; ids: string[]; index: number }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const move = (e: React.MouseEvent, dir: -1 | 1) => {
    e.preventDefault();
    const next = [...ids];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    start(async () => {
      await reorder(table, next);
      router.refresh();
    });
  };
  return (
    <span className="inline-flex">
      <button type="button" aria-label="Mover para cima" disabled={pending || index === 0} onClick={(e) => move(e, -1)} className="grid h-8 w-8 place-items-center text-ivory/50 hover:text-gold disabled:opacity-20">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" aria-label="Mover para baixo" disabled={pending || index === ids.length - 1} onClick={(e) => move(e, 1)} className="grid h-8 w-8 place-items-center text-ivory/50 hover:text-gold disabled:opacity-20">
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-white/10 bg-white/[0.02] p-5 md:p-6 ${className ?? ""}`}>{children}</div>;
}

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ivory/50">{description}</p>}
      </div>
      {action}
    </div>
  );
}

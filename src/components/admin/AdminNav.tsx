"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExternalLink, FolderTree, Gem, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Sparkles, X } from "lucide-react";
import { Monogram } from "../icons";
import { signOut } from "@/app/admin/actions";

const ITEMS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Gem },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/colecoes", label: "Coleções", icon: Sparkles },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { href: "/admin/configuracoes", label: "Conteúdo e contato", icon: Settings },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-5 py-6">
        <Monogram className="h-10 w-10" />
        <span className="font-display text-sm tracking-[0.2em]">FRANÇA JÓIAS</span>
      </Link>
      <ul className="flex-1 space-y-1 px-3">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center gap-3 px-3 text-sm transition-colors ${active ? "bg-gold/15 text-gold-light" : "text-ivory/70 hover:bg-white/5 hover:text-ivory"}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 px-3 text-sm text-ivory/60 hover:text-ivory">
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} /> Ver site
        </Link>
        <form action={signOut}>
          <button className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-ivory/60 hover:text-ivory">
            <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sair
          </button>
        </form>
        <p className="truncate px-3 pt-2 text-xs text-ivory/35">{email}</p>
      </div>
    </nav>
  );
  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#0c0b0a]/95 px-4 backdrop-blur lg:hidden">
        <span className="font-display text-sm tracking-[0.2em]">PAINEL</span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menu" className="grid h-10 w-10 place-items-center">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0a0909] lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#0a0909]">
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="absolute right-3 top-5 grid h-10 w-10 place-items-center">
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}

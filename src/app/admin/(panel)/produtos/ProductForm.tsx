"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, X } from "lucide-react";
import type { Category, Product, ProductImage } from "@/lib/types";
import { saveProduct, type ActionState } from "../../actions";
import { Card, Check, Field, FormMessage, SubmitButton, inputCls } from "@/components/admin/ui";

const MATERIALS = ["Moeda", "Ouro 18k", "Ouro 10k", "Prata 950", "Prata", "Ouro e Prata"];

export function ProductForm({ product, categories }: { product?: Product | null; categories: Category[] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveProduct, null);
  const router = useRouter();
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [removed, setRemoved] = useState<string[]>([]);
  const [previews, setPreviews] = useState<{ name: string; url: string }[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [onRequest, setOnRequest] = useState(product?.price_on_request ?? true);

  useEffect(() => {
    if (!state?.ok) return;
    if (!product && state.id) router.replace(`/admin/produtos/${state.id}`);
    else router.refresh();
    // limpa arquivos já enviados
    if (fileInput.current) fileInput.current.value = "";
    setPreviews([]);
    setRemoved([]);
  }, [state, product, router]);

  useEffect(() => setImages(product?.images ?? []), [product?.images]);

  const onFiles = (list: FileList | null) => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews(Array.from(list ?? []).map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
  };

  const removeNew = (i: number) => {
    const input = fileInput.current;
    if (!input?.files) return;
    const dt = new DataTransfer();
    Array.from(input.files).forEach((f, j) => j !== i && dt.items.add(f));
    input.files = dt.files;
    onFiles(dt.files);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  return (
    <form action={action} className="space-y-6">
      <Link href="/admin/produtos" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ivory/50 hover:text-ivory">
        <ArrowLeft className="h-4 w-4" /> Produtos
      </Link>
      <h1 className="font-serif text-3xl md:text-4xl">{product ? `Editar: ${product.name}` : "Novo produto"}</h1>

      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="removed_paths" value={JSON.stringify(removed)} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <Field label="Nome do produto *">
              <input name="name" required defaultValue={product?.name} className={inputCls} placeholder="Ex.: Aliança Clássica Dourada" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Código" hint="Vazio = gerado automaticamente (FJ-001...)">
                <input name="code" defaultValue={product?.code} className={inputCls} placeholder="FJ-001" />
              </Field>
              <Field label="Endereço (slug)" hint="Vazio = gerado a partir do nome">
                <input name="slug" defaultValue={product?.slug} className={inputCls} placeholder="alianca-classica-dourada" />
              </Field>
            </div>
            <Field label="Descrição curta" hint="Exibida no card do catálogo">
              <input name="short_description" defaultValue={product?.short_description ?? ""} maxLength={180} className={inputCls} />
            </Field>
            <Field label="Descrição completa">
              <textarea name="description" rows={5} defaultValue={product?.description ?? ""} className={inputCls} />
            </Field>
          </Card>

          <Card className="space-y-4">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Características</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Material">
                <input name="material" list="materials" defaultValue={product?.material ?? ""} className={inputCls} />
                <datalist id="materials">{MATERIALS.map((m) => <option key={m} value={m} />)}</datalist>
              </Field>
              <Field label="Acabamento">
                <input name="finish" defaultValue={product?.finish ?? ""} className={inputCls} placeholder="Polido, fosco..." />
              </Field>
              <Field label="Largura">
                <input name="width" defaultValue={product?.width ?? ""} className={inputCls} placeholder="6 mm" />
              </Field>
            </div>
            <Field label="Opções de personalização">
              <textarea name="customization" rows={3} defaultValue={product?.customization ?? ""} className={inputCls} placeholder="Gravação interna, tamanhos disponíveis..." />
            </Field>
            <Field label="Informações adicionais">
              <textarea name="additional_info" rows={3} defaultValue={product?.additional_info ?? ""} className={inputCls} />
            </Field>
          </Card>

          <Card className="space-y-4">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Fotografias</p>
            {images.length > 0 && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, i) => (
                  <li key={img.url} className="relative border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt ?? ""} className="aspect-[4/5] w-full object-cover" />
                    {i === 0 && <span className="absolute left-1 top-1 bg-gold px-1.5 py-0.5 text-[0.55rem] uppercase text-noir">Principal</span>}
                    <div className="flex items-center justify-between bg-black/60 p-1">
                      <span className="flex">
                        <button type="button" aria-label="Mover para a esquerda" onClick={() => move(i, -1)} className="grid h-7 w-7 place-items-center hover:text-gold"><ArrowUp className="h-3.5 w-3.5 -rotate-90" /></button>
                        <button type="button" aria-label="Mover para a direita" onClick={() => move(i, 1)} className="grid h-7 w-7 place-items-center hover:text-gold"><ArrowDown className="h-3.5 w-3.5 -rotate-90" /></button>
                      </span>
                      <button
                        type="button"
                        aria-label="Remover imagem"
                        onClick={() => {
                          setImages(images.filter((_, j) => j !== i));
                          if (img.path) setRemoved([...removed, img.path]);
                        }}
                        className="grid h-7 w-7 place-items-center text-red-300 hover:text-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-white/20 px-4 py-8 text-center text-sm text-ivory/60 hover:border-gold/60">
              <ImagePlus className="h-6 w-6 text-gold" strokeWidth={1.4} />
              Adicionar fotografias (JPG, PNG, WEBP · até 8 MB cada)
              <input ref={fileInput} type="file" name="new_images" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            </label>
            {previews.length > 0 && (
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {previews.map((p, i) => (
                  <li key={p.url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="aspect-square w-full object-cover opacity-80" />
                    <button type="button" onClick={() => removeNew(i)} aria-label="Remover" className="absolute right-1 top-1 grid h-6 w-6 place-items-center bg-black/70"><X className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
            {removed.length > 0 && <p className="text-xs text-ivory/50">{removed.length} imagem(ns) serão removidas ao salvar.</p>}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Publicação</p>
            <Check name="published" label="Publicado no site" defaultChecked={product?.published ?? true} />
            <Check name="available" label="Disponível" defaultChecked={product?.available ?? true} />
            <Check name="featured" label="Destacar na página inicial" defaultChecked={product?.featured ?? false} />
            <Field label="Ordem de exibição" hint="Menor número aparece primeiro">
              <input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} className={inputCls} />
            </Field>
          </Card>

          <Card className="space-y-4">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Categoria e preço</p>
            <Field label="Categoria">
              <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputCls}>
                <option value="">Sem categoria</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-ivory/80">
              <input type="checkbox" name="price_on_request" checked={onRequest} onChange={(e) => setOnRequest(e.target.checked)} className="h-4 w-4 accent-[#c59a45]" />
              Preço sob consulta
            </label>
            <Field label="Preço (R$)" hint={onRequest ? "O preço não será exibido enquanto estiver “sob consulta”." : undefined}>
              <input name="price" inputMode="decimal" defaultValue={product?.price != null ? String(product.price).replace(".", ",") : ""} className={inputCls} placeholder="1.250,00" />
            </Field>
          </Card>

          <Card className="space-y-4">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Modelo 3D (opcional)</p>
            <p className="text-xs text-ivory/45">Envie apenas modelos GLB/GLTF fiéis à peça real.</p>
            <Field label="Enviar arquivo .glb">
              <input type="file" name="model_file" accept=".glb,.gltf" className="block w-full text-xs text-ivory/60 file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-ivory" />
            </Field>
            <Field label="ou URL do modelo">
              <input name="model_url" defaultValue={product?.model_url ?? ""} className={inputCls} placeholder="https://..." />
            </Field>
          </Card>

          <div className="sticky bottom-4 space-y-3">
            <FormMessage state={state} />
            <SubmitButton>{product ? "Salvar alterações" : "Cadastrar produto"}</SubmitButton>
            {product && (
              <Link href={`/produtos/${product.slug}`} target="_blank" className="block text-xs uppercase tracking-[0.18em] text-ivory/50 hover:text-gold">
                Ver no site ↗
              </Link>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

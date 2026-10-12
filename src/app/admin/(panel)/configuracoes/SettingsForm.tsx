"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { saveSettings, type ActionState } from "../../actions";
import { Card, Check, Field, FormMessage, SubmitButton, inputCls } from "@/components/admin/ui";

const fileCls = "block w-full text-xs text-ivory/60 file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-ivory";

function ImageField({ name, label, url, hint }: { name: "about" | "detail"; label: string; url: string | null; hint: string }) {
  return (
    <div className="grid items-end gap-3 sm:grid-cols-[auto_1fr]">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-24 w-20 object-cover" />
      )}
      <div className="space-y-2">
        <Field label={label} hint={hint}>
          <input type="file" name={`${name}_image`} accept="image/jpeg,image/png,image/webp,image/avif" className={fileCls} />
        </Field>
        {url && <Check name={`remove_${name}_image`} label="Remover fotografia atual" />}
      </div>
    </div>
  );
}

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, action] = useActionState<ActionState, FormData>(saveSettings, null);
  const router = useRouter();
  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Atendimento</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp (com DDI e DDD) *" hint="Somente números. Ex.: 5514991477961">
            <input name="whatsapp_number" required defaultValue={s.whatsapp_number} inputMode="numeric" className={inputCls} />
          </Field>
          <Field label="E-mail (opcional)">
            <input name="email" type="email" defaultValue={s.email ?? ""} className={inputCls} />
          </Field>
          <Field label="Link do Instagram *">
            <input name="instagram_url" required defaultValue={s.instagram_url} className={inputCls} />
          </Field>
          <Field label="Usuário do Instagram">
            <input name="instagram_handle" defaultValue={s.instagram_handle} className={inputCls} />
          </Field>
          <Field label="Cidade">
            <input name="city" defaultValue={s.city} className={inputCls} />
          </Field>
          <Field label="Endereço (opcional)" hint="Deixe vazio para não exibir">
            <input name="address" defaultValue={s.address ?? ""} className={inputCls} />
          </Field>
        </div>
        <Field label="Horário de funcionamento (opcional)" hint="Uma linha por dia/período. Vazio = “Consulte os horários pelo WhatsApp”.">
          <textarea name="opening_hours" rows={3} defaultValue={s.opening_hours ?? ""} className={inputCls} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Textos institucionais</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome no hero"><input name="hero_title" defaultValue={s.hero_title} className={inputCls} /></Field>
          <Field label="Slogan"><input name="hero_tagline" defaultValue={s.hero_tagline} className={inputCls} /></Field>
        </div>
        <Field label="Título da apresentação"><input name="about_title" defaultValue={s.about_title} className={inputCls} /></Field>
        <Field label="Texto da apresentação"><textarea name="about_text" rows={4} defaultValue={s.about_text} className={inputCls} /></Field>
      </Card>

      <Card className="space-y-5">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Fotografias de destaque</p>
        <ImageField name="about" label="Foto da apresentação da marca" url={s.about_image_url} hint="Vertical (4:5) recomendada." />
        <ImageField name="detail" label="Foto da seção “A beleza está nos detalhes”" url={s.detail_image_url} hint="Usada quando não há modelo 3D. Quadrada recomendada." />
      </Card>

      <Card className="space-y-4">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">Modelo 3D da seção de detalhes (opcional)</p>
        <p className="text-xs text-ivory/45">Use somente um modelo GLB/GLTF fiel a uma peça real. Sem modelo, o site mostra a fotografia com efeito de profundidade.</p>
        <Field label="Enviar arquivo .glb">
          <input type="file" name="detail_model_file" accept=".glb,.gltf" className={fileCls} />
        </Field>
        <Field label="ou URL do modelo" hint="Apague o campo para remover o modelo.">
          <input name="detail_model_url" defaultValue={s.detail_model_url ?? ""} className={inputCls} />
        </Field>
      </Card>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3">
        <SubmitButton>Salvar configurações</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

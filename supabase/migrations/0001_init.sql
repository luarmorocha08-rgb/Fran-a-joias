-- =====================================================================
-- França Jóias — esquema inicial
-- Execute no SQL Editor do Supabase (ou via `supabase db push`).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Função usada pelas políticas RLS. SECURITY DEFINER evita recursão de RLS.
-- Fica no schema "private", que não é exposto pela API REST.
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Atualiza updated_at automaticamente
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Categorias
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Produtos
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  code              text not null unique,               -- ex.: FJ-001
  slug              text not null unique,
  name              text not null,
  category_id       uuid references public.categories (id) on delete set null,
  material          text,
  finish            text,
  width             text,
  short_description text,
  description       text,
  customization     text,
  additional_info   text,
  price             numeric(12, 2) check (price is null or price >= 0),
  price_on_request  boolean not null default true,
  available         boolean not null default true,
  featured          boolean not null default false,
  published         boolean not null default true,
  sort_order        int     not null default 0,
  images            jsonb   not null default '[]'::jsonb, -- [{url, path, alt}]
  model_url         text,                                 -- GLB/GLTF real (opcional)
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_listing_idx on public.products (published, sort_order);

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Coleções (vitrines editoriais ligadas a uma categoria)
-- ---------------------------------------------------------------------
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  tagline     text,
  description text,
  image_url   text,
  image_path  text,
  category_id uuid references public.categories (id) on delete set null,
  theme       text not null default 'dark' check (theme in ('dark', 'light')),
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists collections_category_idx on public.collections (category_id);

-- ---------------------------------------------------------------------
-- Depoimentos (somente reais, cadastrados pela equipe)
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null,
  location    text,
  text        text not null,
  rating      smallint check (rating is null or rating between 1 and 5),
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Configurações do site (linha única, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id                 int primary key default 1 check (id = 1),
  whatsapp_number    text not null default '5514991477961',
  instagram_url      text not null default 'https://www.instagram.com/franca.joiasmarilia/',
  instagram_handle   text not null default '@franca.joiasmarilia',
  city               text not null default 'Marília — SP',
  address            text,
  opening_hours      text,
  email              text,
  hero_title         text not null default 'França Jóias',
  hero_tagline       text not null default 'Celebrando histórias que duram para sempre.',
  about_title        text not null default 'Cada aliança carrega uma história.',
  about_text         text not null default 'Na França Jóias, transformamos sentimentos em símbolos eternos. Alianças cuidadosamente selecionadas e produzidas para celebrar os momentos mais especiais da sua vida.',
  about_image_url    text,
  about_image_path   text,
  detail_image_url   text,
  detail_image_path  text,
  detail_model_url   text,
  updated_at         timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.admin_users   enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.collections   enable row level security;
alter table public.testimonials  enable row level security;
alter table public.site_settings enable row level security;

-- admin_users: cada usuário só enxerga a própria linha; ninguém escreve via API
drop policy if exists "admin_users self read" on public.admin_users;
create policy "admin_users self read" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- Leitura pública
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select using (true);

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (published or (select private.is_admin()));

drop policy if exists "collections public read" on public.collections;
create policy "collections public read" on public.collections
  for select using (published or (select private.is_admin()));

drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select using (published or (select private.is_admin()));

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select using (true);

-- Escrita somente para administradores
do $$
declare t text;
begin
  foreach t in array array['categories', 'products', 'collections', 'testimonials'] loop
    execute format('drop policy if exists "%1$s admin insert" on public.%1$s', t);
    execute format('drop policy if exists "%1$s admin update" on public.%1$s', t);
    execute format('drop policy if exists "%1$s admin delete" on public.%1$s', t);
    execute format('create policy "%1$s admin insert" on public.%1$s for insert to authenticated with check ((select private.is_admin()))', t);
    execute format('create policy "%1$s admin update" on public.%1$s for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('create policy "%1$s admin delete" on public.%1$s for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end $$;

drop policy if exists "settings admin update" on public.site_settings;
create policy "settings admin update" on public.site_settings
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- =====================================================================
-- Storage: bucket público "media" (leitura pública, escrita só admin)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'model/gltf-binary', 'model/gltf+json', 'application/octet-stream'])
on conflict (id) do nothing;

-- O bucket é público: as URLs das fotos abrem sem política de leitura.
-- A leitura via API (listar/remover arquivos) fica restrita aos administradores.
drop policy if exists "media admin select" on storage.objects;
create policy "media admin select" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select private.is_admin()));

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select private.is_admin()));

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select private.is_admin()));

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select private.is_admin()));

# França Jóias — Luxury Digital Showroom

Vitrine digital da **França Jóias** (Marília — SP), especializada em alianças de moedas e fabricação de alianças de ouro e prata.
Catálogo real conectado ao Supabase, painel administrativo e contato direto via WhatsApp e Instagram. Não há carrinho nem checkout.

## Stack

- **Next.js 16** (App Router, Server Actions, ISR) + **TypeScript**
- **Tailwind CSS 4** (tokens da marca em `src/app/globals.css`)
- **GSAP + ScrollTrigger** para as animações de scroll (reveal, parallax, máscaras, seções fixadas)
- **Motion** apenas para micro-interações de UI (menu, painel de filtros, lightbox), sem disputar elementos com o GSAP
- **Three.js / React Three Fiber / Drei** no hero (emblema 3D) e no visualizador de modelos GLB/GLTF reais
- **Supabase**: Postgres + RLS, Storage (imagens e modelos 3D) e Auth (administradores)
- **Lucide** para os ícones

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional: sem Supabase o site roda em modo demonstração
npm run dev                  # http://localhost:3000
```

Outros scripts: `npm run build`, `npm start`, `npm run typecheck`.

### Modo demonstração

Sem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` o site usa **dados demonstrativos** (`src/lib/demo-data.ts`):

- produtos com o prefixo “Demonstração ·” e código `DEMO-xxx`, com ilustrações vetoriais marcadas como “Imagem ilustrativa”;
- um selo “Modo demonstração” aparece no site e as páginas de produto ficam com `noindex`;
- **nenhum depoimento é inventado**: a seção fica oculta;
- o painel `/admin` mostra as instruções de configuração e não grava nada.

## Conectando o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, execute `supabase/migrations/0001_init.sql` (tabelas, RLS, bucket `media` e políticas de Storage).
3. Execute `supabase/seed.sql` para criar as 5 categorias e 3 coleções iniciais (sem produtos fictícios).
4. Em **Project Settings → API**, copie a URL e a chave `anon` para `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. Em **Authentication → Users**, crie o usuário da equipe (e-mail e senha). Desative cadastros públicos em *Authentication → Sign In / Providers* se desejar.
6. Autorize o usuário como administrador:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'equipe@francajoias.com.br';
   ```
7. Reinicie o servidor e acesse `/admin`.

A chave `service_role` **não é usada** pelo projeto e nunca deve ir para o frontend.

## Segurança

- Leitura pública somente de itens `published` (RLS). Configurações e categorias são públicas para leitura.
- Toda escrita passa por **Server Actions** que validam no servidor o usuário (`auth.getUser()`) **e** a presença em `admin_users`;
  as políticas RLS (`public.is_admin()`) repetem essa verificação no banco e no Storage.
- O `src/proxy.ts` renova a sessão e redireciona visitantes não autenticados de `/admin` para `/admin/login`.
- Uploads aceitam apenas JPG/PNG/WEBP/AVIF (até 8 MB) e GLB/GLTF (até 10 MB).

## Painel administrativo (`/admin`)

| Área | O que permite |
| --- | --- |
| Produtos | cadastrar, editar, excluir; várias fotos (ordenar, remover); preço ou “sob consulta”; categoria; material; disponível/indisponível; destaque na home; publicar/ocultar; ordem de exibição; modelo 3D opcional |
| Categorias | criar, renomear, ordenar, excluir |
| Coleções | título, frase, foto, categoria vinculada, fundo preto/champagne, ordem |
| Depoimentos | somente avaliações reais; sem depoimentos publicados a seção some do site |
| Conteúdo e contato | WhatsApp, Instagram, cidade, endereço e horário (opcionais), textos do hero e da apresentação, fotos de destaque, modelo 3D da seção de detalhes |

As páginas públicas são estáticas com revalidação (ISR de 60 s) e são revalidadas imediatamente após cada alteração no painel.

## Estrutura

```
src/
  app/
    (site)/            páginas públicas: home, /produtos, /produtos/[slug], /colecoes, /colecoes/[slug]
    admin/             login, painel e server actions
    sitemap.ts, robots.ts
  components/
    home/              Hero, BrandIntro, CollectionsShowcase, DetailSection, ServiceSteps, Testimonials, ContactSection
    catalog/           Catalog (filtros e busca), ProductCard
    product/           ProductGallery (zoom e lightbox), ProductActions
    three/             RingsScene (hero), ModelViewer (GLB/GLTF), StudioEnvironment
    motion/            Reveal, TextReveal, MaskReveal, GoldLine (GSAP)
    admin/             componentes do painel
  lib/                 dados, Supabase, WhatsApp, analytics, formatação
supabase/              migrations + seed
```

## WhatsApp e Instagram

- Links oficiais `wa.me` gerados com `encodeURIComponent` (`src/lib/whatsapp.ts`).
- Mensagem do produto: nome, código e link real da página. O botão “Agendar Atendimento” envia uma mensagem de agendamento;
  não há calendário fictício.
- O Instagram abre o perfil configurado; não há integração de mensagens automáticas.

## Analytics

`src/lib/analytics.ts` dispara `product_view`, `whatsapp_click`, `instagram_click`, `collection_click` e `catalog_search`
para `dataLayer`, GA4 (`gtag`) e Meta Pixel (`fbq`) quando carregados. Defina `NEXT_PUBLIC_GA_ID` e/ou `NEXT_PUBLIC_META_PIXEL_ID`
para ativar os scripts. Nenhum dado pessoal é enviado.

## 3D e desempenho

- O hero mostra um **emblema** 3D de duas alianças entrelaçadas (inspirado no logotipo), não um produto do catálogo.
- A seção “A beleza está nos detalhes” só usa 3D quando existe um **modelo GLB/GLTF real** (cadastrado no produto ou nas configurações).
  Sem modelo, exibe a fotografia real com profundidade e parallax.
- Dispositivos sem WebGL, com pouca memória, em modo de economia de dados ou com `prefers-reduced-motion` recebem a versão estática.
  No celular a geometria e a resolução são reduzidas.
- As animações respeitam `prefers-reduced-motion` e nunca bloqueiam o scroll nativo.

## Deploy

Recomendado: Vercel. Configure as mesmas variáveis do `.env.local` no projeto e defina `NEXT_PUBLIC_SITE_URL` com o domínio final
(usado no sitemap, no Open Graph e nos links enviados pelo WhatsApp).

/**
 * DADOS DEMONSTRATIVOS — usados apenas quando o Supabase não está configurado.
 * Não representam produtos, preços ou clientes reais da França Jóias.
 * As imagens são ilustrações vetoriais genéricas (public/demo), não fotografias de peças.
 */
import type { Category, Collection, Product, SiteSettings, Testimonial } from "./types";
import { BRAND } from "./config";

export const DEMO_SETTINGS: SiteSettings = {
  whatsapp_number: BRAND.whatsapp,
  instagram_url: BRAND.instagramUrl,
  instagram_handle: BRAND.instagramHandle,
  city: BRAND.city,
  address: null,
  opening_hours: null,
  email: null,
  hero_title: "França Jóias",
  hero_tagline: "Celebrando histórias que duram para sempre.",
  about_title: "Cada aliança carrega uma história.",
  about_text:
    "Na França Jóias, transformamos sentimentos em símbolos eternos. Alianças cuidadosamente selecionadas e produzidas para celebrar os momentos mais especiais da sua vida.",
  about_image_url: null,
  about_image_path: null,
  detail_image_url: null,
  detail_image_path: null,
  detail_model_url: null,
};

export const DEMO_CATEGORIES: Category[] = [
  { id: "c1", name: "Alianças de Moedas", slug: "aliancas-de-moedas", description: "Nossa especialidade: alianças fabricadas a partir de moedas.", sort_order: 1 },
  { id: "c2", name: "Alianças de Ouro", slug: "aliancas-de-ouro", description: "Alianças fabricadas em ouro.", sort_order: 2 },
  { id: "c3", name: "Alianças de Prata", slug: "aliancas-de-prata", description: "Alianças fabricadas em prata.", sort_order: 3 },
  { id: "c4", name: "Alianças Tradicionais", slug: "aliancas-tradicionais", description: "Modelos clássicos e atemporais.", sort_order: 4 },
  { id: "c5", name: "Modelos Especiais", slug: "modelos-especiais", description: "Criações diferenciadas e personalizadas.", sort_order: 5 },
];

const img = (file: string, alt: string) => [{ url: `/demo/${file}`, alt }];

function demo(p: Partial<Product> & Pick<Product, "id" | "code" | "slug" | "name" | "category_id">): Product {
  return {
    material: null,
    finish: null,
    width: null,
    short_description: null,
    description: null,
    customization: null,
    additional_info: "Produto demonstrativo — cadastre os produtos reais no painel administrativo.",
    price: null,
    price_on_request: true,
    available: true,
    featured: false,
    published: true,
    sort_order: 0,
    images: [],
    model_url: null,
    ...p,
  };
}

export const DEMO_PRODUCTS: Product[] = [
  demo({
    id: "p1", code: "DEMO-001", slug: "demo-alianca-de-moeda-classica", name: "Demonstração · Aliança de Moeda Clássica",
    category_id: "c1", material: "Moeda", finish: "Polido", width: "6 mm", featured: true, sort_order: 1,
    short_description: "Exemplo ilustrativo de card de produto da categoria Alianças de Moedas.",
    description: "Este é um produto demonstrativo para visualizar o layout do catálogo. Substitua pelos produtos reais no painel.",
    customization: "Gravação interna (exemplo)",
    images: [...img("ring-coin.svg", "Ilustração de aliança de moeda"), ...img("ring-pair.svg", "Ilustração de par de alianças")],
  }),
  demo({
    id: "p2", code: "DEMO-002", slug: "demo-alianca-ouro-tradicional", name: "Demonstração · Aliança Tradicional em Ouro",
    category_id: "c2", material: "Ouro", finish: "Polido", width: "4 mm", featured: true, sort_order: 2,
    short_description: "Exemplo ilustrativo com preço demonstrativo.",
    price: 1000, price_on_request: false,
    images: img("ring-gold.svg", "Ilustração de aliança dourada"),
  }),
  demo({
    id: "p3", code: "DEMO-003", slug: "demo-alianca-prata-fosca", name: "Demonstração · Aliança de Prata Fosca",
    category_id: "c3", material: "Prata", finish: "Fosco", width: "5 mm", featured: true, sort_order: 3,
    short_description: "Exemplo ilustrativo da categoria Alianças de Prata.",
    price: 300, price_on_request: false,
    images: img("ring-silver.svg", "Ilustração de aliança prateada"),
  }),
  demo({
    id: "p4", code: "DEMO-004", slug: "demo-par-tradicional", name: "Demonstração · Par Tradicional",
    category_id: "c4", material: "Ouro", finish: "Polido", sort_order: 4,
    short_description: "Exemplo ilustrativo de produto sob consulta.",
    images: img("ring-pair.svg", "Ilustração de par de alianças"),
  }),
  demo({
    id: "p5", code: "DEMO-005", slug: "demo-modelo-especial-bicolor", name: "Demonstração · Modelo Especial Bicolor",
    category_id: "c5", material: "Ouro e Prata", finish: "Escovado", width: "7 mm", sort_order: 5, available: false,
    short_description: "Exemplo ilustrativo de produto indisponível.",
    images: img("ring-twotone.svg", "Ilustração de aliança bicolor"),
  }),
  demo({
    id: "p6", code: "DEMO-006", slug: "demo-alianca-moeda-anatomica", name: "Demonstração · Aliança de Moeda Anatômica",
    category_id: "c1", material: "Moeda", finish: "Diamantado", width: "8 mm", featured: true, sort_order: 6,
    short_description: "Exemplo ilustrativo de acabamento diferenciado.",
    images: img("ring-coin.svg", "Ilustração de aliança de moeda"),
  }),
];

export const DEMO_COLLECTIONS: Collection[] = [
  { id: "k1", title: "Alianças de Moedas", slug: "aliancas-de-moedas", tagline: "A especialidade que só Marília tem.", description: "A única loja de Marília especializada em alianças de moedas.", image_url: "/demo/ring-coin.svg", image_path: null, category_id: "c1", theme: "dark", published: true, sort_order: 1 },
  { id: "k2", title: "Alianças de Ouro", slug: "aliancas-de-ouro", tagline: "Um símbolo eterno para um amor único.", description: "Fabricamos também alianças de ouro.", image_url: "/demo/ring-gold.svg", image_path: null, category_id: "c2", theme: "light", published: true, sort_order: 2 },
  { id: "k3", title: "Alianças de Prata", slug: "aliancas-de-prata", tagline: "A delicadeza que acompanha cada promessa.", description: "Fabricamos também alianças de prata.", image_url: "/demo/ring-silver.svg", image_path: null, category_id: "c3", theme: "dark", published: true, sort_order: 3 },
];

/** Nunca inventar depoimentos: em modo demonstração a seção fica oculta. */
export const DEMO_TESTIMONIALS: Testimonial[] = [];

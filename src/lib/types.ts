export type ProductImage = { url: string; path?: string | null; alt?: string | null };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  code: string;
  slug: string;
  name: string;
  category_id: string | null;
  material: string | null;
  finish: string | null;
  width: string | null;
  short_description: string | null;
  description: string | null;
  customization: string | null;
  additional_info: string | null;
  price: number | null;
  price_on_request: boolean;
  available: boolean;
  featured: boolean;
  published: boolean;
  sort_order: number;
  images: ProductImage[];
  model_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProductWithCategory = Product & { category: Category | null };

export type Collection = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  category_id: string | null;
  theme: "dark" | "light";
  published: boolean;
  sort_order: number;
};

export type CollectionWithCategory = Collection & { category: Category | null };

export type Testimonial = {
  id: string;
  author_name: string;
  location: string | null;
  text: string;
  rating: number | null;
  published: boolean;
  sort_order: number;
};

export type SiteSettings = {
  whatsapp_number: string;
  instagram_url: string;
  instagram_handle: string;
  city: string;
  address: string | null;
  opening_hours: string | null;
  email: string | null;
  hero_title: string;
  hero_tagline: string;
  about_title: string;
  about_text: string;
  about_image_url: string | null;
  about_image_path: string | null;
  detail_image_url: string | null;
  detail_image_path: string | null;
  detail_model_url: string | null;
};

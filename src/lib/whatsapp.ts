import { SITE_URL } from "./config";

/** Gera um link oficial wa.me com a mensagem corretamente codificada. */
export function whatsappUrl(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productUrl(slug: string) {
  return `${SITE_URL}/produtos/${slug}`;
}

export function productMessage(p: { name: string; code: string; slug: string }) {
  return `Olá, França Jóias! Tenho interesse no produto ${p.name}, código ${p.code}. Gostaria de consultar valores e disponibilidade. Vi este modelo no site: ${productUrl(p.slug)}`;
}

export const MESSAGES = {
  general: "Olá, França Jóias! Vim pelo site e gostaria de falar com um especialista.",
  schedule:
    "Olá, França Jóias! Vim pelo site e gostaria de agendar um atendimento para conhecer as alianças. Qual o melhor dia e horário?",
};

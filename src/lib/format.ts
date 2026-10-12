const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(price: number | null | undefined, onRequest: boolean) {
  if (onRequest || price == null) return "Sob consulta";
  return brl.format(price);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normalize(input: string) {
  return input.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** 5514991477961 -> +55 14 99147-7961 */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  const m = d.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : `+${d}`;
}

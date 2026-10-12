import { ProductCardSkeleton } from "@/components/catalog/ProductCard";

export default function Loading() {
  return (
    <div className="container-luxe pb-28 pt-40" aria-busy="true" aria-label="Carregando catálogo">
      <div className="skeleton mb-6 h-3 w-24" />
      <div className="skeleton mb-16 h-12 w-2/3 max-w-lg" />
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

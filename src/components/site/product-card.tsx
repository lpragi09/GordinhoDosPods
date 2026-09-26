import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  name: string;
  priceCents: number;
  compareCents?: number | null;
  imageUrl?: string | null;
};

export function ProductCard({
  slug,
  name,
  priceCents,
  compareCents,
  imageUrl,
}: ProductCardProps) {
  return (
    <Link
      href={`/produtos/${slug}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-800">
          {name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900">
            {formatCurrency(priceCents)}
          </span>
          {compareCents && compareCents > priceCents && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(compareCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

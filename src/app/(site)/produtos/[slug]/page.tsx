import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/catalog";
import { formatCurrency } from "@/lib/utils";
import { AddToCart } from "@/components/site/add-to-cart";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface/5">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              Sem imagem
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatCurrency(product.priceCents)}
            </span>
            {product.compareCents && product.compareCents > product.priceCents && (
              <span className="text-lg text-muted line-through">
                {formatCurrency(product.compareCents)}
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-foreground/60">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCart
              productId={product.id}
              name={product.name}
              slug={product.slug}
              priceCents={product.priceCents}
              imageUrl={product.images[0]}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      {product.images.length > 1 && (
        <div className="mt-8 grid grid-cols-4 gap-4 sm:grid-cols-6">
          {product.images.slice(1).map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-md bg-surface/5"
            >
              <Image src={img} alt={product.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

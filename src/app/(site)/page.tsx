import Link from "next/link";
import Image from "next/image";
import {
  getActiveBanners,
  getActiveCategories,
  getFeaturedProducts,
} from "@/lib/data/catalog";
import { ProductCard } from "@/components/site/product-card";

export default async function HomePage() {
  const [banners, categories, featured] = await Promise.all([
    getActiveBanners(),
    getActiveCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {banners.length > 0 ? (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link || "/produtos"}
              className="relative block aspect-[16/7] overflow-hidden rounded-xl bg-slate-100"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                fill
                className="object-cover"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mb-10 rounded-xl bg-slate-900 px-8 py-16 text-center text-white">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Bem-vindo(a) à nossa loja
          </h1>
          <p className="mt-3 text-slate-300">
            Os melhores produtos, com entrega para todo o Brasil.
          </p>
          <Link
            href="/produtos"
            className="mt-6 inline-block rounded-md bg-white px-6 py-3 font-semibold text-slate-900"
          >
            Ver produtos
          </Link>
        </div>
      )}

      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Categorias</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produtos?categoria=${cat.slug}`}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-900 hover:text-slate-900"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Destaques</h2>
          <Link href="/produtos" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Ver todos →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-slate-500">
            Nenhum produto cadastrado ainda. Acesse o painel administrativo para começar a montar seu catálogo.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                priceCents={p.priceCents}
                compareCents={p.compareCents}
                imageUrl={p.images[0]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

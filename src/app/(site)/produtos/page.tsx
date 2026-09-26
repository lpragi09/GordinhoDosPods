import Link from "next/link";
import { getActiveCategories, getProducts } from "@/lib/data/catalog";
import { ProductCard } from "@/components/site/product-card";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string; pagina?: string }>;
}) {
  const { categoria, busca, pagina } = await searchParams;
  const page = Number(pagina) || 1;

  const [categories, result] = await Promise.all([
    getActiveCategories(),
    getProducts({ categorySlug: categoria, search: busca, page }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Produtos</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <form action="/produtos" className="mb-6">
            <input
              type="text"
              name="busca"
              defaultValue={busca}
              placeholder="Buscar produtos..."
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </form>

          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Categorias
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/produtos"
                className={`block rounded px-2 py-1 ${
                  !categoria ? "bg-accent text-accent-foreground" : "text-foreground/60 hover:bg-surface/5"
                }`}
              >
                Todas
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/produtos?categoria=${cat.slug}`}
                  className={`block rounded px-2 py-1 ${
                    categoria === cat.slug
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/60 hover:bg-surface/5"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          {result.items.length === 0 ? (
            <p className="text-muted">Nenhum produto encontrado.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {result.items.map((p) => (
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

              {result.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={{
                          pathname: "/produtos",
                          query: {
                            ...(categoria ? { categoria } : {}),
                            ...(busca ? { busca } : {}),
                            pagina: p,
                          },
                        }}
                        className={`h-9 w-9 rounded-md text-center text-sm leading-9 ${
                          p === page
                            ? "bg-accent text-accent-foreground"
                            : "border border-border text-foreground/80"
                        }`}
                      >
                        {p}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

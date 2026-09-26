import Link from "next/link";
import Image from "next/image";
import {
  getActiveBanners,
  getActiveCategories,
  getFeaturedProducts,
} from "@/lib/data/catalog";
import { ProductCard } from "@/components/site/product-card";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { HeroCta } from "@/components/site/hero-cta";

export default async function HomePage() {
  const [banners, categories, featured] = await Promise.all([
    getActiveBanners(),
    getActiveCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-16 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-blob rounded-full bg-accent/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-blob rounded-full bg-accent/10 blur-[100px] [animation-delay:6s]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <span className="mb-6 inline-block rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted">
            Bem-vindo(a)
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl">
            Produtos que
            <br />
            <span className="text-accent">fazem sentido</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-foreground/60">
            Curadoria, qualidade e entrega para todo o Brasil. Sem enrolação.
          </p>
          <div className="mt-9 flex justify-center">
            <HeroCta />
          </div>
        </div>
      </section>

      {banners.length > 0 && (
        <div className="mx-auto mb-16 max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {banners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link || "/produtos"}
                className="relative block aspect-[16/7] overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <Image src={banner.imageUrl} alt={banner.title || "Banner"} fill className="object-cover" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <Marquee
        items={[
          "ENTREGA PARA TODO O BRASIL",
          "PAGAMENTO SEGURO",
          "TROCA FÁCIL",
          "SUPORTE DEDICADO",
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {categories.length > 0 && (
          <Reveal className="mb-16">
            <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
              Categorias
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-accent hover:text-accent"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
              Destaques
            </h2>
            <Link href="/produtos" className="text-sm font-medium text-muted hover:text-accent">
              Ver todos →
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">
              Nenhum produto cadastrado ainda. Acesse o painel administrativo para começar a
              montar seu catálogo.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <ProductCard
                    slug={p.slug}
                    name={p.name}
                    priceCents={p.priceCents}
                    compareCents={p.compareCents}
                    imageUrl={p.images[0]}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

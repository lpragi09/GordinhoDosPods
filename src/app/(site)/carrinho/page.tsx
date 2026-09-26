"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalCents } = useCartStore();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Meu carrinho</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="mb-4 text-muted">Seu carrinho está vazio.</p>
          <Link
            href="/produtos"
            className="inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-lg border border-border p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface/5">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/produtos/${item.slug}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">
                    {formatCurrency(item.priceCents)}
                  </p>
                  <div className="mt-2 flex items-center rounded-md border border-border w-fit">
                    <button
                      className="px-3 py-1"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(item.priceCents * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-muted hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-lg border border-border p-5">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatCurrency(totalCents())}</span>
            </div>
            <p className="mb-4 text-xs text-muted">
              Frete calculado no checkout.
            </p>
            <Link
              href="/checkout"
              className="block w-full rounded-md bg-accent px-4 py-3 text-center font-semibold text-accent-foreground hover:opacity-90"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

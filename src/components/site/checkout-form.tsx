"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { createOrderAction } from "@/lib/actions/checkout";
import { formatCep, formatCurrency } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

type AddressOption = {
  id: string;
  label: string;
  recipient: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
};

export function CheckoutForm({ addresses }: { addresses: AddressOption[] }) {
  const { items, totalCents, clear } = useCartStore();
  const mounted = useMounted();
  const [addressId, setAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || "",
  );
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!mounted) return null;

  const subtotal = totalCents();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="mb-4 text-muted">Seu carrinho está vazio.</p>
        <Link
          href="/produtos"
          className="inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  async function handleSubmit() {
    if (!addressId) {
      setError("Selecione um endereço de entrega.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await createOrderAction({
      addressId,
      couponCode: couponCode || undefined,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    clear();
    window.location.href = result.redirectUrl;
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Endereço de entrega</h2>
            <Link
              href="/conta/enderecos/novo"
              className="text-sm font-medium text-foreground/60 hover:underline"
            >
              + Novo endereço
            </Link>
          </div>

          {addresses.length === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted">
              Você ainda não tem endereços cadastrados.{" "}
              <Link href="/conta/enderecos/novo" className="font-semibold underline">
                Cadastrar endereço
              </Link>
            </p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
                    addressId === addr.id
                      ? "border-accent bg-surface"
                      : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={addressId === addr.id}
                    onChange={() => setAddressId(addr.id)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{addr.label}</p>
                    <p className="text-foreground/60">
                      {addr.recipient} · {addr.street}, {addr.number}
                      {addr.complement ? ` - ${addr.complement}` : ""}
                      <br />
                      {addr.neighborhood} - {addr.city}/{addr.state} · CEP{" "}
                      {formatCep(addr.cep)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-semibold text-foreground">Cupom de desconto</h2>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Código do cupom (opcional)"
            className="w-full max-w-xs rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="h-fit rounded-lg border border-border p-5">
        <h2 className="mb-3 font-semibold text-foreground">Resumo</h2>
        <div className="space-y-1 divide-y divide-slate-100 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-2">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{formatCurrency(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm text-muted">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <p className="mb-3 text-xs text-muted">
          Frete e descontos calculados na próxima etapa.
        </p>

        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || addresses.length === 0}
          className="w-full rounded-md bg-accent px-4 py-3 font-semibold text-accent-foreground disabled:opacity-60"
        >
          {loading ? "Redirecionando..." : "Pagar com Mercado Pago"}
        </button>
      </div>
    </div>
  );
}

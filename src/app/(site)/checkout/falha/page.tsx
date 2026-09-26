import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <XCircle className="mx-auto mb-4 text-red-500" size={56} />
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Pagamento não aprovado
      </h1>
      <p className="mb-8 text-foreground/60">
        Não conseguimos confirmar seu pagamento. Você pode tentar novamente ou
        escolher outra forma de pagamento.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {order && (
          <Link
            href={`/conta/pedidos/${order}`}
            className="rounded-md border border-border px-6 py-3 font-semibold text-foreground/80"
          >
            Ver pedido
          </Link>
        )}
        <Link
          href="/carrinho"
          className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground"
        >
          Tentar novamente
        </Link>
      </div>
    </div>
  );
}

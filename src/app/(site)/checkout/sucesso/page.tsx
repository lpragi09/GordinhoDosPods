import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={56} />
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Pagamento em processamento!
      </h1>
      <p className="mb-8 text-foreground/60">
        Recebemos seu pagamento e estamos confirmando com o Mercado Pago. Você
        receberá um e-mail assim que o status for atualizado.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {order && (
          <Link
            href={`/conta/pedidos/${order}`}
            className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground"
          >
            Ver meu pedido
          </Link>
        )}
        <Link
          href="/produtos"
          className="rounded-md border border-border px-6 py-3 font-semibold text-foreground/80"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}

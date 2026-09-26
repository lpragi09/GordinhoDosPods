import Link from "next/link";
import { Clock } from "lucide-react";

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <Clock className="mx-auto mb-4 text-amber-500" size={56} />
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Pagamento pendente
      </h1>
      <p className="mb-8 text-foreground/60">
        Seu pagamento está sendo processado (comum em boletos e PIX com
        compensação). Você será avisado por e-mail assim que for aprovado.
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

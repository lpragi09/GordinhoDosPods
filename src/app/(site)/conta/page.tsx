import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account-nav";
import Link from "next/link";

export default async function AccountOverviewPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
  });

  const [orderCount, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId: session!.user.id } }),
    prisma.address.count({ where: { userId: session!.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-56">
          <AccountNav current="/conta" />
        </div>

        <div className="flex-1 space-y-6">
          <div className="rounded-lg border border-border p-5">
            <h2 className="mb-3 font-semibold text-foreground">Meus dados</h2>
            <p className="text-sm text-foreground/60">{user?.name}</p>
            <p className="text-sm text-foreground/60">{user?.email}</p>
            {user?.phone && <p className="text-sm text-foreground/60">{user.phone}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/conta/pedidos"
              className="rounded-lg border border-border p-5 hover:border-accent/50"
            >
              <p className="text-2xl font-bold text-foreground">{orderCount}</p>
              <p className="text-sm text-muted">Pedidos realizados</p>
            </Link>
            <Link
              href="/conta/enderecos"
              className="rounded-lg border border-border p-5 hover:border-accent/50"
            >
              <p className="text-2xl font-bold text-foreground">{addressCount}</p>
              <p className="text-sm text-muted">Endereços cadastrados</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

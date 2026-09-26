import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/site/checkout-form";

export default async function CheckoutPage() {
  const session = await auth();
  const addresses = session?.user
    ? await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Finalizar compra</h1>
      <CheckoutForm addresses={addresses} />
    </div>
  );
}

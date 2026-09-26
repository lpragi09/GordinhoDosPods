"use client";

import { useTransition } from "react";
import { deleteAddressAction } from "@/lib/actions/addresses";

export function DeleteAddressButton({ addressId }: { addressId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Remover este endereço?")) {
          startTransition(() => deleteAddressAction(addressId));
        }
      }}
      className="font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      Remover
    </button>
  );
}

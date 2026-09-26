"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage = "Tem certeza?",
}: {
  action: () => Promise<void> | void;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      Excluir
    </button>
  );
}

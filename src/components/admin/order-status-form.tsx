"use client";

import { useActionState, useState } from "react";
import { updateOrderStatusAction, type OrderActionState } from "@/lib/actions/admin/orders";
import { statusLabel } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
];

const initialState: OrderActionState = {};

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [state, formAction, pending] = useActionState(updateOrderStatusAction, initialState);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Status atualizado! O cliente foi notificado por e-mail.
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Status do pedido</label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Observação (opcional, visível ao cliente)
        </label>
        <input
          type="text"
          name="note"
          placeholder="Ex: enviado via Correios, código de rastreio XPTO123"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Atualizando..." : "Atualizar status"}
      </button>
    </form>
  );
}

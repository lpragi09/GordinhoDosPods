"use client";

import Link from "next/link";
import { use, useActionState } from "react";
import { resetPasswordAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Definir nova senha
      </h1>

      {state.success ? (
        <div className="flex flex-col gap-4">
          <p className="rounded-md bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
            Senha redefinida com sucesso!
          </p>
          <Link
            href="/conta/entrar"
            className="rounded-md bg-slate-900 px-4 py-3 text-center font-semibold text-white"
          >
            Entrar
          </Link>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nova senha
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      )}
    </div>
  );
}

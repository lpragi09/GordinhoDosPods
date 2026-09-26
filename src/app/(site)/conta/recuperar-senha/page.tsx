"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export default function RequestPasswordResetPage() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">
        Recuperar senha
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Informe seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      {state.success ? (
        <p className="rounded-md bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
          Se o e-mail informado estiver cadastrado, você receberá um link de
          redefinição em instantes.
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>
      )}

      <Link
        href="/conta/entrar"
        className="mt-6 text-center text-sm text-slate-600 hover:underline"
      >
        Voltar para o login
      </Link>
    </div>
  );
}

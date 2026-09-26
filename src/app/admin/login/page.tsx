"use client";

import { useActionState } from "react";
import { adminLoginAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-xl font-bold text-slate-900">
          Painel administrativo
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Acesso restrito a administradores da loja.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

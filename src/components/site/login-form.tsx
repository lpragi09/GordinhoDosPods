"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/conta";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Entrar</h1>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

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

        <Link
          href="/conta/recuperar-senha"
          className="text-right text-sm text-slate-500 hover:underline"
        >
          Esqueci minha senha
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Não tem uma conta?{" "}
        <Link href="/conta/cadastro" className="font-semibold text-slate-900 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

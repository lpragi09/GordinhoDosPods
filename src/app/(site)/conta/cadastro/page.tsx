"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Criar conta</h1>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground/80">
            Nome completo
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-md border border-border px-3 py-2"
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground/80">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-border px-3 py-2"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground/80">
            Telefone (opcional)
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full rounded-md border border-border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground/80">
            Senha
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full rounded-md border border-border px-3 py-2"
          />
          {state.fieldErrors?.password && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-accent px-4 py-3 font-semibold text-accent-foreground disabled:opacity-60"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Já tem uma conta?{" "}
        <Link href="/conta/entrar" className="font-semibold text-foreground hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useMounted } from "@/lib/use-mounted";

export function Header({ storeName }: { storeName: string }) {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          {storeName}
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/produtos" className="hover:text-slate-900">
            Produtos
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/conta"
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <User size={18} />
                <span className="hidden sm:inline">
                  {session.user.name?.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sair"
                className="text-slate-500 hover:text-slate-900"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/conta/entrar"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <User size={18} />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}

          <Link href="/carrinho" className="relative text-slate-700 hover:text-slate-900">
            <ShoppingCart size={22} />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

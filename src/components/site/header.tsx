"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useMounted } from "@/lib/use-mounted";
import { AnimatePresence, motion } from "framer-motion";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative py-1 text-sm font-medium text-foreground/80 hover:text-foreground">
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

export function Header({ storeName }: { storeName: string }) {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const mounted = useMounted();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-foreground"
        >
          {storeName}
        </Link>

        <nav className="hidden gap-8 md:flex">
          <NavLink href="/produtos">Produtos</NavLink>
        </nav>

        <div className="flex items-center gap-5">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/conta"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                <User size={18} />
                <span className="hidden sm:inline">{session.user.name?.split(" ")[0]}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Sair"
                className="text-foreground/50 hover:text-accent"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/conta/entrar"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              <User size={18} />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}

          <Link href="/carrinho" className="relative text-foreground/80 hover:text-foreground">
            <ShoppingBag size={22} />
            <AnimatePresence>
              {mounted && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </header>
  );
}

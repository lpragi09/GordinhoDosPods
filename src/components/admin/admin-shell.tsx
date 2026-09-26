import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export async function AdminShell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([auth(), getSettings()]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="text-xs font-medium uppercase text-slate-400">Painel</p>
          <p className="font-bold text-slate-900">{settings.storeName}</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => {
            const Icon = link.icon;
            const active = current === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-slate-200 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ExternalLink size={18} />
            Ver loja
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
              <LogOut size={18} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <span className="font-bold text-slate-900">{settings.storeName}</span>
          <nav className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                  current === link.href
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="flex items-center justify-end gap-2 border-b border-slate-200 bg-white px-6 py-2 text-sm text-slate-500">
          Logado como <strong>{session?.user?.name}</strong>
        </div>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

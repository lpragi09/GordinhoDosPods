import Link from "next/link";

const links = [
  { href: "/conta", label: "Visão geral" },
  { href: "/conta/pedidos", label: "Meus pedidos" },
  { href: "/conta/enderecos", label: "Meus endereços" },
];

export function AccountNav({ current }: { current: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border pb-3 md:flex-col md:border-b-0 md:pb-0">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
            current === link.href
              ? "bg-accent text-accent-foreground"
              : "text-foreground/60 hover:bg-surface/5"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

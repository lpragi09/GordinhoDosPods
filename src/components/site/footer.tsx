type FooterProps = {
  storeName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  address?: string | null;
};

export function Footer({
  storeName,
  contactEmail,
  contactPhone,
  whatsapp,
  instagram,
  address,
}: FooterProps) {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {storeName}
        </p>

        <div className="mt-10 grid gap-8 text-sm sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold uppercase tracking-wider text-muted">Loja</h3>
            {address && <p className="text-foreground/70">{address}</p>}
          </div>
          <div>
            <h3 className="mb-2 font-semibold uppercase tracking-wider text-muted">Contato</h3>
            {contactEmail && <p className="text-foreground/70">{contactEmail}</p>}
            {contactPhone && <p className="text-foreground/70">{contactPhone}</p>}
            {whatsapp && <p className="text-foreground/70">WhatsApp: {whatsapp}</p>}
          </div>
          <div>
            <h3 className="mb-2 font-semibold uppercase tracking-wider text-muted">Redes</h3>
            {instagram && <p className="text-foreground/70">{instagram}</p>}
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

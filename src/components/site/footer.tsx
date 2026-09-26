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
    <footer className="mt-16 border-t bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-slate-900">{storeName}</h3>
            {address && <p>{address}</p>}
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Contato</h3>
            {contactEmail && <p>{contactEmail}</p>}
            {contactPhone && <p>{contactPhone}</p>}
            {whatsapp && <p>WhatsApp: {whatsapp}</p>}
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Redes sociais</h3>
            {instagram && <p>{instagram}</p>}
          </div>
        </div>
        <p className="mt-8 border-t pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

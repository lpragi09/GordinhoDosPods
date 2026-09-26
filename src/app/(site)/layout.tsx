import { getSettings } from "@/lib/settings";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header storeName={settings.storeName} />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={settings.storeName}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        whatsapp={settings.whatsapp}
        instagram={settings.instagram}
        address={settings.address}
      />
    </>
  );
}

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <AdminShell current="/admin/configuracoes">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Configurações da loja</h1>
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}

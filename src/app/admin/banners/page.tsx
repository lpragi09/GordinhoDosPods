import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";
import { saveBannerAction, deleteBannerAction } from "@/lib/actions/admin/banners";
import { BannerForm } from "@/components/admin/banner-form";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });

  return (
    <AdminShell current="/admin/banners">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Banners da home</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-semibold text-slate-900">Novo banner</h2>
          <BannerForm action={saveBannerAction} />
        </div>

        <div>
          <h2 className="mb-3 font-semibold text-slate-900">Banners cadastrados</h2>
          <div className="space-y-3">
            {banners.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum banner cadastrado.</p>
            ) : (
              banners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded bg-slate-100">
                    <Image src={banner.imageUrl} alt={banner.title || ""} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-slate-900">{banner.title || "Sem título"}</p>
                    <p className="text-xs text-slate-400">{banner.active ? "Ativo" : "Inativo"}</p>
                  </div>
                  <DeleteButton
                    action={deleteBannerAction.bind(null, banner.id)}
                    confirmMessage="Remover este banner?"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

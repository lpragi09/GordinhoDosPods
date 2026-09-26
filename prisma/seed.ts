import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "NovaLoja",
      primaryColor: "#0f172a",
      flatShippingCents: 1500,
    },
  });

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@novaloja.com.br").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin pronto: ${adminEmail} / senha: ${adminPassword}`);

  const category = await prisma.category.upsert({
    where: { slug: "geral" },
    update: {},
    create: {
      name: "Geral",
      slug: "geral",
      description: "Categoria padrão",
      order: 0,
    },
  });

  console.log(`Categoria de exemplo criada: ${category.name}`);
  console.log("Seed concluído. Cadastre seus produtos pelo painel /admin.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

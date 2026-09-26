import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone inválido").optional().or(z.literal("")),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const addressSchema = z.object({
  label: z.string().min(1).default("Principal"),
  recipient: z.string().min(2, "Informe o nome do destinatário"),
  cep: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "CEP inválido"),
  street: z.string().min(2, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().min(1, "Informe o bairro"),
  city: z.string().min(1, "Informe a cidade"),
  state: z.string().length(2, "UF inválida"),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto"),
  slug: z.string().min(2, "Informe o slug"),
  description: z.string().min(1, "Informe a descrição"),
  priceCents: z.coerce.number().int().min(0),
  compareCents: z.coerce.number().int().min(0).optional().nullable(),
  sku: z.string().min(1, "Informe o SKU"),
  stock: z.coerce.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  categoryId: z.string().optional().nullable(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  weightGrams: z.coerce.number().int().min(0).default(0),
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  slug: z.string().min(2, "Informe o slug"),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const settingsSchema = z.object({
  storeName: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal("")),
  primaryColor: z.string().min(4),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  freeShippingCents: z.coerce.number().int().optional().nullable(),
  flatShippingCents: z.coerce.number().int().min(0).default(0),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Selecione um endereço"),
  couponCode: z.string().optional().or(z.literal("")),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

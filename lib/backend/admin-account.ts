import "server-only";
import { z } from "zod";
import { ADMIN_ROLE_IDS } from "@/lib/auth/rbac";

const adminAccountSchema = z.object({
  id: z.string().uuid(),
  email: z
    .string()
    .email()
    .max(254)
    .refine((value) => value === value.trim().toLowerCase()),
  name: z.string().trim().min(1).max(120),
  passwordHash: z.string().max(255).nullable(),
  role: z.enum(ADMIN_ROLE_IDS),
  active: z.boolean(),
  createdAtMs: z.number().int().nonnegative().refine(Number.isSafeInteger),
  updatedAtMs: z.number().int().nonnegative().refine(Number.isSafeInteger),
});

const adminAccountRowSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    display_name: z.string(),
    password_hash: z.string().nullable(),
    role: z.string(),
    is_active: z.union([z.boolean(), z.literal(0), z.literal(1)]),
    created_at_ms: z.coerce.number().int().nonnegative(),
    updated_at_ms: z.coerce.number().int().nonnegative(),
  })
  .transform((row) => ({
    id: row.id,
    email: row.email,
    name: row.display_name,
    passwordHash: row.password_hash,
    role: row.role,
    active: Boolean(row.is_active),
    createdAtMs: row.created_at_ms,
    updatedAtMs: row.updated_at_ms,
  }))
  .pipe(adminAccountSchema);

export type AdminAccount = z.infer<typeof adminAccountSchema>;

export interface AdminAccountRepository {
  findByEmail(normalizedEmail: string): Promise<AdminAccount | null>;
}

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseAdminAccount(value: unknown): AdminAccount {
  const result = adminAccountSchema.safeParse(value);
  if (!result.success) {
    throw new Error("Admin account repository returned an invalid account record.");
  }

  return result.data;
}

export function parseAdminAccountRow(value: unknown): AdminAccount {
  const result = adminAccountRowSchema.safeParse(value);
  if (!result.success) {
    throw new Error("Database returned an invalid administrator account row.");
  }

  return result.data;
}

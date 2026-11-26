import "server-only";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { isAdminRoleId, type AdminRoleId } from "./rbac";
import { verifyAdminPassword } from "./password-hash";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(256),
});

export interface AdminCredentialAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: AdminRoleId;
  active: boolean;
}

export interface AdminCredentialRepository {
  findByEmail(email: string): Promise<AdminCredentialAccount | null>;
}

export function createAdminCredentialsProvider(
  repository: AdminCredentialRepository | null,
) {
  return Credentials({
    id: "credentials",
    name: "Email and password",
    credentials: {
      email: { label: "Work email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!repository) {
        return null;
      }

      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      const email = parsed.data.email.toLowerCase();
      const account = await repository.findByEmail(email);
      if (
        !account ||
        !account.active ||
        !isAdminRoleId(account.role) ||
        !(await verifyAdminPassword(parsed.data.password, account.passwordHash))
      ) {
        return null;
      }

      return {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      };
    },
  });
}

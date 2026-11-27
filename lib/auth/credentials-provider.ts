import "server-only";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import {
  normalizeAdminEmail,
  parseAdminAccount,
  type AdminAccountRepository,
} from "@/lib/backend/admin-account";
import { isAdminRoleId } from "./rbac";
import { verifyAdminPassword } from "./password-hash";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(256),
});

export function createAdminCredentialsProvider(
  repository: AdminAccountRepository | null,
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

      const email = normalizeAdminEmail(parsed.data.email);
      const accountRecord = await repository.findByEmail(email);
      const account = accountRecord ? parseAdminAccount(accountRecord) : null;
      if (
        !account ||
        !account.active ||
        !isAdminRoleId(account.role) ||
        !account.passwordHash ||
        !(await verifyAdminPassword(parsed.data.password, account.passwordHash))
      ) {
        return null;
      }

      return {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        barangayScopeIds: account.barangayScopeIds,
      };
    },
  });
}

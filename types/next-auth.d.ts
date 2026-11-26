import type { DefaultSession } from "next-auth";
import type { AdminRoleId } from "@/lib/auth/rbac";

declare module "next-auth" {
  interface User {
    role?: AdminRoleId;
  }

  interface Session {
    user: {
      id?: string;
      role?: AdminRoleId;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRoleId;
  }
}

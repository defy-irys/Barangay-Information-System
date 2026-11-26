import "server-only";
import { ApiError } from "@/lib/backend/api-error";
import {
  hasPermission,
  isAdminRoleId,
  type AdminPermission,
  type AdminRoleId,
} from "./rbac";
import { auth } from "@/auth";

export interface AuthenticatedPrincipal {
  userId: string;
  role: AdminRoleId;
}

export function requirePermission(
  principal: AuthenticatedPrincipal | null,
  permission: AdminPermission,
): AuthenticatedPrincipal {
  if (!principal) {
    throw new ApiError(401, "UNAUTHENTICATED", "Sign-in is required.");
  }

  if (!hasPermission(principal.role, permission)) {
    throw new ApiError(403, "FORBIDDEN", "You do not have permission.");
  }

  return principal;
}

export async function getAuthenticatedPrincipal(): Promise<AuthenticatedPrincipal | null> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !isAdminRoleId(user.role)) {
    return null;
  }

  return { userId: user.id, role: user.role };
}

export async function requireCurrentPermission(
  permission: AdminPermission,
): Promise<AuthenticatedPrincipal> {
  return requirePermission(await getAuthenticatedPrincipal(), permission);
}

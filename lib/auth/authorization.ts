import "server-only";
import { ApiError } from "@/lib/backend/api-error";
import {
  hasPermission,
  type AdminPermission,
  type AdminRoleId,
} from "./rbac";

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

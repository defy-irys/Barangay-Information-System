import "server-only";
import { isAdminRoleId } from "./rbac";
import { auth } from "@/auth";
import { normalizeBarangayScopeIds } from "./access-attributes";
import {
  requirePermission,
  type AuthenticatedPrincipal,
} from "./authorization-policy";
import type { AdminPermission } from "./rbac";

export {
  requirePermission,
  requireResourcePermission,
} from "./authorization-policy";
export type {
  AuthenticatedPrincipal,
  ResourceAuthorizationAttributes,
  ResourceClassification,
} from "./authorization-policy";

export async function getAuthenticatedPrincipal(): Promise<AuthenticatedPrincipal | null> {
  const session = await auth();
  const user = session?.user;
  const barangayScopeIds = normalizeBarangayScopeIds(
    user?.barangayScopeIds,
  );

  if (!user?.id || !isAdminRoleId(user.role) || !barangayScopeIds) {
    return null;
  }

  return {
    userId: user.id,
    role: user.role,
    attributes: { barangayScopeIds },
  };
}

export async function requireCurrentPermission(
  permission: AdminPermission,
): Promise<AuthenticatedPrincipal> {
  return requirePermission(await getAuthenticatedPrincipal(), permission);
}

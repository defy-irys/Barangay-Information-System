import "server-only";
import { ApiError } from "@/lib/backend/api-error";
import {
  hasPermission,
  isAdminRoleId,
  type AdminPermission,
  type AdminRoleId,
} from "./rbac";
import { auth } from "@/auth";
import { normalizeBarangayScopeIds } from "./access-attributes";

export interface AuthenticatedPrincipal {
  userId: string;
  role: AdminRoleId;
  attributes: {
    barangayScopeIds: string[];
  };
}

export type ResourceClassification =
  | "internal"
  | "confidential"
  | "restricted-vawc";

export interface ResourceAuthorizationAttributes {
  barangayScopeId: string;
  classification: ResourceClassification;
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

export function requireResourcePermission(
  principal: AuthenticatedPrincipal | null,
  permission: AdminPermission,
  resource: ResourceAuthorizationAttributes,
): AuthenticatedPrincipal {
  const authorizedPrincipal = requirePermission(principal, permission);

  if (
    !authorizedPrincipal.attributes.barangayScopeIds.includes(
      resource.barangayScopeId.toLowerCase(),
    )
  ) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "You do not have access to this barangay scope.",
    );
  }

  const requestsVawcPermission = permission.startsWith("vawc:");
  if (
    (resource.classification === "restricted-vawc") !==
    requestsVawcPermission
  ) {
    throw new ApiError(
      403,
      "FORBIDDEN",
      "The requested permission does not match the resource classification.",
    );
  }

  return authorizedPrincipal;
}

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

import { ApiError } from "../backend/api-error";
import {
  hasPermission,
  type AdminPermission,
  type AdminRoleId,
} from "./rbac";

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

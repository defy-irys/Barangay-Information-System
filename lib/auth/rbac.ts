export const ADMIN_MODULES = [
  { id: "overview", name: "Dashboard", href: "/" },
  { id: "inhabitants", name: "Inhabitants", href: "/profiling" },
  { id: "certifications", name: "Certificates", href: "/certifications" },
  { id: "helpdesk", name: "Helpdesk & Blotter", href: "/helpdesk-blotter" },
  { id: "assets", name: "Asset Management", href: "/assets" },
  { id: "disaster", name: "Disaster Resilience", href: "/disaster-resilience" },
  { id: "gad", name: "Gender & Development", href: "/gad-monitoring" },
  { id: "ordinances", name: "Ordinances", href: "/ordinances" },
  { id: "portal", name: "Public Portal CMS", href: "/public-portal" },
  { id: "development", name: "Development Plan", href: "/development-plan" },
  { id: "institutions", name: "Barangay Institutions", href: "/institutions" },
  { id: "financials", name: "Financial Management", href: "/financials" },
] as const;

export type AdminModuleId = (typeof ADMIN_MODULES)[number]["id"];
export type PermissionAction = "read" | "create" | "update" | "approve";
export type AdminPermission =
  | `${AdminModuleId}:${PermissionAction}`
  | "vawc:read"
  | "vawc:create"
  | "vawc:update"
  | "system:users:manage"
  | "system:settings:manage";

export const ADMIN_ROLE_IDS = [
  "system-administrator",
  "punong-barangay",
  "barangay-secretary",
  "lupon-secretary",
  "vaw-desk-officer",
] as const;

export type AdminRoleId = (typeof ADMIN_ROLE_IDS)[number];

export interface AdminProfile {
  name: string;
  title: string;
  summary: string;
  permissions: readonly AdminPermission[];
}

function modulePermission<M extends AdminModuleId, A extends PermissionAction>(
  module: M,
  action: A,
): `${M}:${A}` {
  return `${module}:${action}`;
}

const allModuleReadPermissions = ADMIN_MODULES.map(({ id }) =>
  modulePermission(id, "read"),
);

export const ADMIN_PROFILES: Record<AdminRoleId, AdminProfile> = {
  "system-administrator": {
    name: "System Administrator",
    title: "Accounts & configuration",
    summary: "Manage system settings and user access; operational data is read-only.",
    permissions: [
      ...allModuleReadPermissions,
      "system:users:manage",
      "system:settings:manage",
    ],
  },
  "punong-barangay": {
    name: "Punong Barangay",
    title: "Executive oversight",
    summary: "Review barangay operations and approve designated issuances.",
    permissions: [
      "overview:read",
      "inhabitants:read",
      "certifications:read",
      "certifications:approve",
      "helpdesk:read",
      "helpdesk:approve",
      "assets:read",
      "disaster:read",
      "disaster:approve",
      "gad:read",
      "ordinances:read",
      "ordinances:approve",
      "portal:read",
      "development:read",
      "development:approve",
      "institutions:read",
      "financials:read",
      "financials:approve",
    ],
  },
  "barangay-secretary": {
    name: "Barangay Secretary",
    title: "Records & certificates",
    summary: "Maintain resident records and process certificates and official records.",
    permissions: [
      "overview:read",
      "inhabitants:read",
      "inhabitants:create",
      "inhabitants:update",
      "certifications:read",
      "certifications:create",
      "helpdesk:read",
      "helpdesk:create",
      "ordinances:read",
      "ordinances:create",
      "institutions:read",
    ],
  },
  "lupon-secretary": {
    name: "Lupon Secretary",
    title: "Mediation records",
    summary: "Register and update mediation cases and hearing records.",
    permissions: [
      "overview:read",
      "helpdesk:read",
      "helpdesk:create",
      "helpdesk:update",
    ],
  },
  "vaw-desk-officer": {
    name: "VAW Desk Officer",
    title: "Restricted case handling",
    summary: "Handle VAWC records with access limited to the designated desk.",
    permissions: [
      "overview:read",
      "helpdesk:read",
      "vawc:read",
      "vawc:create",
      "vawc:update",
    ],
  },
};

export function hasPermission(
  role: AdminRoleId,
  permission: AdminPermission,
): boolean {
  return ADMIN_PROFILES[role].permissions.includes(permission);
}

export function getAccessibleModules(role: AdminRoleId) {
  return ADMIN_MODULES.filter(({ id }) => hasPermission(role, `${id}:read`));
}

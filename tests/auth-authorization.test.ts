import assert from "node:assert/strict";
import test from "node:test";
import { ApiError } from "../lib/backend/api-error";
import {
  requirePermission,
  requireResourcePermission,
  type AuthenticatedPrincipal,
} from "../lib/auth/authorization-policy";
import { normalizeBarangayScopeIds } from "../lib/auth/access-attributes";

const scopeA = "550e8400-e29b-41d4-a716-446655440000";
const scopeB = "550e8400-e29b-41d4-a716-446655440001";

const secretary: AuthenticatedPrincipal = {
  userId: "secretary",
  role: "barangay-secretary",
  attributes: { barangayScopeIds: [scopeA] },
};

const vawDeskOfficer: AuthenticatedPrincipal = {
  userId: "vaw-officer",
  role: "vaw-desk-officer",
  attributes: { barangayScopeIds: [scopeA] },
};

function assertApiError(action: () => unknown, status: number): void {
  assert.throws(action, (error: unknown) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.status, status);
    return true;
  });
}

test("requires both the role permission and matching barangay scope", () => {
  assert.equal(
    requireResourcePermission(secretary, "inhabitants:read", {
      barangayScopeId: scopeA,
      classification: "confidential",
    }),
    secretary,
  );

  assertApiError(
    () =>
      requireResourcePermission(secretary, "inhabitants:read", {
        barangayScopeId: scopeB,
        classification: "confidential",
      }),
    403,
  );

  assertApiError(
    () =>
      requireResourcePermission(secretary, "system:users:manage", {
        barangayScopeId: scopeA,
        classification: "internal",
      }),
    403,
  );
});

test("restricts sensitive VAWC records to matching VAWC permissions", () => {
  assert.equal(
    requireResourcePermission(vawDeskOfficer, "vawc:read", {
      barangayScopeId: scopeA,
      classification: "restricted-vawc",
    }),
    vawDeskOfficer,
  );

  assertApiError(
    () =>
      requireResourcePermission(vawDeskOfficer, "helpdesk:read", {
        barangayScopeId: scopeA,
        classification: "restricted-vawc",
      }),
    403,
  );

  assertApiError(
    () =>
      requireResourcePermission(vawDeskOfficer, "vawc:read", {
        barangayScopeId: scopeA,
        classification: "confidential",
      }),
    403,
  );
});

test("fails closed for missing principals and invalid scope attributes", () => {
  assertApiError(() => requirePermission(null, "inhabitants:read"), 401);
  assert.equal(normalizeBarangayScopeIds([]), null);
  assert.equal(normalizeBarangayScopeIds(["not-a-scope-id"]), null);
  assert.deepEqual(
    normalizeBarangayScopeIds([scopeA.toUpperCase(), scopeA]),
    [scopeA],
  );
});

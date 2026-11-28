import assert from "node:assert/strict";
import test from "node:test";
import { ApiError } from "../lib/backend/api-error";
import {
  parseResidentListQuery,
  residentCreateSchema,
  residentUpdateSchema,
} from "../lib/residents/model";

const residentInput = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  barangayScopeId: "550e8400-e29b-41d4-a716-446655440000",
  birthDate: "1990-01-01",
  sex: "Male",
  civilStatus: "Single",
  houseLotNo: "12",
  street: "Sta Lucia St",
  barangay: "Sta Lucia",
  city: "Quezon City",
  province: "Metro Manila",
};

test("accepts minimal resident data and rejects fields outside the schema", () => {
  assert.equal(residentCreateSchema.safeParse(residentInput).success, true);
  assert.equal(
    residentCreateSchema.safeParse({
      ...residentInput,
      philsysNumber: "not-accepted",
    }).success,
    false,
  );
  assert.equal(
    residentCreateSchema.safeParse({
      ...residentInput,
      birthDate: "2026-02-31",
    }).success,
    false,
  );
});

test("prevents updates from changing a resident's assigned scope", () => {
  assert.equal(residentUpdateSchema.safeParse({ lastName: "Santos" }).success, true);
  assert.equal(
    residentUpdateSchema.safeParse({
      barangayScopeId: "550e8400-e29b-41d4-a716-446655440001",
    }).success,
    false,
  );
  assert.equal(residentUpdateSchema.safeParse({}).success, false);
});

test("bounds pagination and reports invalid parameters as a client error", () => {
  assert.deepEqual(parseResidentListQuery({}), {
    limit: 25,
    offset: 0,
  });

  assert.throws(
    () => parseResidentListQuery({ limit: "101" }),
    (error: unknown) => error instanceof ApiError && error.status === 422,
  );
  assert.throws(
    () => parseResidentListQuery({ offset: "-1" }),
    (error: unknown) => error instanceof ApiError && error.status === 422,
  );
});

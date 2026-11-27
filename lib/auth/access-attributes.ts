import { z } from "zod";

const barangayScopeIdsSchema = z.array(z.string().uuid()).min(1).max(100);

export type BarangayScopeId = string;

export function normalizeBarangayScopeIds(value: unknown): string[] | null {
  const values = typeof value === "string" ? [value] : value;
  const result = barangayScopeIdsSchema.safeParse(values);

  if (!result.success) {
    return null;
  }

  return [...new Set(result.data.map((scopeId) => scopeId.toLowerCase()))];
}

export function isBarangayScopeIds(value: unknown): value is string[] {
  return Array.isArray(value) && normalizeBarangayScopeIds(value) !== null;
}

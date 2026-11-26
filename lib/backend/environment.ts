import "server-only";
import { z } from "zod";

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const result = z.string().url().safeParse(databaseUrl);

  if (!result.success) {
    throw new Error("DATABASE_URL must be a valid connection URL.");
  }

  return result.data;
}

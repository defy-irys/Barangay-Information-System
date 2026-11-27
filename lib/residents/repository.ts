import "server-only";
import { ApiError } from "@/lib/backend/api-error";
import type { ResidentRepository } from "./model";

export function getResidentRepository(): ResidentRepository {
  throw new ApiError(
    503,
    "SERVICE_UNAVAILABLE",
    "Resident storage is not configured. Connect the selected database adapter before using resident records.",
  );
}

import { apiSuccessResponse } from "@/lib/backend/api-error";

export function GET(): Response {
  return apiSuccessResponse({
    status: "ok",
    service: "barangay-information-system",
    apiVersion: 1,
  });
}

import { apiSuccessResponse } from "@/lib/backend/api-error";
import { getAuthCapabilities } from "@/lib/auth/provider-configuration";

export function GET(): Response {
  return apiSuccessResponse(getAuthCapabilities());
}

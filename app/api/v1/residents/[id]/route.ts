import {
  apiErrorResponse,
  apiSuccessResponse,
  ApiError,
} from "@/lib/backend/api-error";
import { parseJsonBody } from "@/lib/backend/request-validation";
import {
  requireCurrentPermission,
  requireResourcePermission,
} from "@/lib/auth/authorization";
import {
  residentIdSchema,
  residentUpdateSchema,
} from "@/lib/residents/model";
import { getResidentRepository } from "@/lib/residents/repository";

interface ResidentRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: ResidentRouteContext,
): Promise<Response> {
  try {
    const principal = await requireCurrentPermission("inhabitants:read");
    const { id } = await context.params;
    const parsedId = residentIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new ApiError(400, "VALIDATION_FAILED", "Resident ID must be a UUID.");
    }

    const resident = await getResidentRepository().findById(
      parsedId.data,
      principal.attributes.barangayScopeIds,
    );
    if (!resident) {
      throw new ApiError(404, "NOT_FOUND", "Resident record was not found.");
    }
    requireResourcePermission(principal, "inhabitants:read", {
      barangayScopeId: resident.barangayScopeId,
      classification: "confidential",
    });

    return apiSuccessResponse(resident);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  context: ResidentRouteContext,
): Promise<Response> {
  try {
    const principal = await requireCurrentPermission("inhabitants:update");
    const { id } = await context.params;
    const parsedId = residentIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new ApiError(400, "VALIDATION_FAILED", "Resident ID must be a UUID.");
    }

    const changes = await parseJsonBody(request, residentUpdateSchema);
    const updated = await getResidentRepository().update(
      parsedId.data,
      changes,
      principal.attributes.barangayScopeIds,
      principal.userId,
      Date.now(),
    );
    if (!updated) {
      throw new ApiError(404, "NOT_FOUND", "Resident record was not found.");
    }
    requireResourcePermission(principal, "inhabitants:update", {
      barangayScopeId: updated.barangayScopeId,
      classification: "confidential",
    });

    return apiSuccessResponse(updated);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

import { randomUUID } from "node:crypto";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/backend/api-error";
import { parseJsonBody } from "@/lib/backend/request-validation";
import { requireCurrentPermission } from "@/lib/auth/authorization";
import {
  residentCreateSchema,
  parseResidentListQuery,
  type ResidentRecord,
} from "@/lib/residents/model";
import { getResidentRepository } from "@/lib/residents/repository";

export async function GET(request: Request): Promise<Response> {
  try {
    await requireCurrentPermission("inhabitants:read");
    const url = new URL(request.url);
    const query = parseResidentListQuery({
      search: url.searchParams.get("search") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      offset: url.searchParams.get("offset") ?? undefined,
    });
    const page = await getResidentRepository().list(query);

    return apiSuccessResponse(page);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const principal = await requireCurrentPermission("inhabitants:create");
    const input = await parseJsonBody(request, residentCreateSchema);
    const now = Date.now();
    const year = new Date(now).getUTCFullYear();
    const residentSuffix = randomUUID()
      .replaceAll("-", "")
      .slice(0, 20)
      .toUpperCase();
    const record: ResidentRecord = {
      ...input,
      id: randomUUID(),
      residentNumber: `RES-${year}-${residentSuffix}`,
      middleName: input.middleName || null,
      extensionName: input.extensionName || null,
      subdivision: input.subdivision || null,
      zipCode: input.zipCode || null,
      email: input.email?.toLowerCase() || null,
      mobileNumber: input.mobileNumber || null,
      createdAtMs: now,
      updatedAtMs: now,
    };
    const created = await getResidentRepository().create(record, principal.userId);

    return apiSuccessResponse(created, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

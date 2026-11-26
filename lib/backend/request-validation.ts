import { z } from "zod";
import { ApiError } from "./api-error";

export async function parseJsonBody<Schema extends z.ZodType>(
  request: Request,
  schema: Schema,
): Promise<z.output<Schema>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw new ApiError(
      422,
      "VALIDATION_FAILED",
      "Request validation failed.",
      result.error.issues.map(({ path, message }) => ({
        path: path.map((part) =>
          typeof part === "symbol" ? part.toString() : part,
        ),
        message,
      })),
    );
  }

  return result.data;
}

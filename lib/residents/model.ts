import { z } from "zod";
import { ApiError } from "@/lib/backend/api-error";

const optionalContact = z.string().trim().max(254).nullable().optional();

export const residentCreateSchema = z.strictObject({
  firstName: z.string().trim().min(1).max(100),
  middleName: z.string().trim().max(100).nullable().optional(),
  lastName: z.string().trim().min(1).max(100),
  extensionName: z.string().trim().max(20).nullable().optional(),
  birthDate: z.iso.date(),
  sex: z.enum(["Male", "Female"]),
  civilStatus: z.enum([
    "Single",
    "Married",
    "Widowed",
    "Separated",
    "Divorced",
  ]),
  houseLotNo: z.string().trim().min(1).max(80),
  street: z.string().trim().min(1).max(120),
  subdivision: z.string().trim().max(120).nullable().optional(),
  barangay: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(120),
  province: z.string().trim().min(1).max(120),
  zipCode: z.string().trim().max(12).nullable().optional(),
  email: optionalContact.pipe(z.string().email().max(254).nullable().optional()),
  mobileNumber: z.string().trim().max(32).nullable().optional(),
});

export const residentUpdateSchema = residentCreateSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export const residentListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).max(1_000_000).default(0),
});

export const residentIdSchema = z.string().uuid();

export interface ResidentRecord {
  id: string;
  residentNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  extensionName: string | null;
  birthDate: string;
  sex: "Male" | "Female";
  civilStatus: "Single" | "Married" | "Widowed" | "Separated" | "Divorced";
  houseLotNo: string;
  street: string;
  subdivision: string | null;
  barangay: string;
  city: string;
  province: string;
  zipCode: string | null;
  email: string | null;
  mobileNumber: string | null;
  createdAtMs: number;
  updatedAtMs: number;
}

export type ResidentCreateInput = z.infer<typeof residentCreateSchema>;
export type ResidentUpdateInput = z.infer<typeof residentUpdateSchema>;
export type ResidentListQuery = z.infer<typeof residentListQuerySchema>;

export interface ResidentPage {
  items: ResidentRecord[];
  total: number;
}

export interface ResidentRepository {
  list(query: ResidentListQuery): Promise<ResidentPage>;
  findById(id: string): Promise<ResidentRecord | null>;
  /** Persist the record and resident.created audit event in one transaction. */
  create(
    record: ResidentRecord,
    actorUserId: string,
  ): Promise<ResidentRecord>;
  /** Persist the changes and resident.updated audit event in one transaction. */
  update(
    id: string,
    changes: ResidentUpdateInput,
    actorUserId: string,
    updatedAtMs: number,
  ): Promise<ResidentRecord | null>;
}

export function parseResidentListQuery(value: unknown): ResidentListQuery {
  const result = residentListQuerySchema.safeParse(value);
  if (!result.success) {
    throw new ApiError(
      422,
      "VALIDATION_FAILED",
      "Resident query validation failed.",
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

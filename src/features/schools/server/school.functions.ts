import { createServerFn } from "@tanstack/react-start";

import {
	onboardSchoolPayloadSchema,
	schoolIdSchema,
	schoolListFiltersSchema,
	schoolStatusInputSchema,
	slugCheckSchema,
	updateSchoolInputSchema,
} from "#/features/schools/schema/school.schema.ts";
import {
	checkSlugAvailability,
	createSchoolRequest,
	deleteSchoolRequest,
	fetchSchoolById,
	fetchSchoolPlans,
	fetchSchools,
	updateSchoolRequest,
	updateSchoolStatusRequest,
} from "#/features/schools/server/school.server.ts";
import type {
	Plan,
	School,
	SlugAvailability,
} from "#/features/schools/types/schools.type.ts";

export const getSchoolsFn = createServerFn({ method: "GET" })
	.validator((data?: unknown) => schoolListFiltersSchema.parse(data ?? {}))
	.handler(async ({ data }): Promise<School[]> => {
		return await fetchSchools(data);
	});

export const getSchoolByIdFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => schoolIdSchema.parse(data))
	.handler(async ({ data: id }): Promise<School> => {
		return await fetchSchoolById(id);
	});

export const createSchoolFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => onboardSchoolPayloadSchema.parse(data))
	.handler(async ({ data }): Promise<School | null> => {
		return await createSchoolRequest(data);
	});

export const updateSchoolFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => updateSchoolInputSchema.parse(data))
	.handler(async ({ data }): Promise<School | null> => {
		return await updateSchoolRequest(data.id, data.payload);
	});

export const updateSchoolStatusFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => schoolStatusInputSchema.parse(data))
	.handler(async ({ data }): Promise<School | null> => {
		return await updateSchoolStatusRequest(data.id, data.status);
	});

export const deleteSchoolFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => schoolIdSchema.parse(data))
	.handler(async ({ data: id }): Promise<{ success: boolean }> => {
		return await deleteSchoolRequest(id);
	});

export const checkSlugAvailabilityFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => slugCheckSchema.parse(data))
	.handler(async ({ data }): Promise<SlugAvailability> => {
		return await checkSlugAvailability(data.slug);
	});

export const getSchoolPlansFn = createServerFn({ method: "GET" }).handler(
	async (): Promise<Plan[]> => {
		return await fetchSchoolPlans();
	},
);

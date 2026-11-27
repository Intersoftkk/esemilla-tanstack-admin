import type {
	OnboardSchoolPayload,
	Plan,
	School,
	SchoolListFilters,
	SchoolStatus,
	SlugAvailability,
	UpdateSchoolPayload,
} from "#/features/schools/types/schools.type.ts";
import {
	normalizePlan,
	normalizeSchool,
	unwrapEntity,
	unwrapList,
} from "#/features/schools/utils/school.mapper.ts";
import { ApiError, api } from "#/server/api.server.ts";

export async function fetchSchools(
	filters?: SchoolListFilters,
): Promise<School[]> {
	const { data } = await api.get<unknown>("/owner/tenants", {
		params: {
			include: "plan",
			per_page: 100,
			sort: "-created_at",
			...(filters?.search ? { "filter[search]": filters.search } : {}),
			...(filters?.status ? { "filter[status]": filters.status } : {}),
		},
	});

	return unwrapList(data)
		.map(normalizeSchool)
		.filter((item): item is School => item !== null);
}

export async function fetchSchoolById(id: string): Promise<School> {
	const { data } = await api.get<unknown>(
		`/owner/tenants/${encodeURIComponent(id)}`,
		{ params: { include: "plan" } },
	);

	const normalized = normalizeSchool(unwrapEntity(data) ?? data);
	if (!normalized) {
		throw new Error("School record could not be parsed.");
	}
	return normalized;
}

export async function createSchoolRequest(
	payload: OnboardSchoolPayload,
): Promise<School | null> {
	const { data } = await api.post<unknown>("/owner/tenants", payload);
	const entity = unwrapEntity(data) ?? data;
	return normalizeSchool(entity);
}

export async function updateSchoolRequest(
	id: string,
	payload: UpdateSchoolPayload,
): Promise<School | null> {
	const { data } = await api.put<unknown>(
		`/owner/tenants/${encodeURIComponent(id)}`,
		payload,
	);
	const entity = unwrapEntity(data) ?? data;
	return normalizeSchool(entity);
}

export async function updateSchoolStatusRequest(
	id: string,
	status: SchoolStatus,
): Promise<School | null> {
	const { data } = await api.patch<unknown>(
		`/owner/tenants/${encodeURIComponent(id)}/status`,
		{ status },
	);
	const entity = unwrapEntity(data) ?? data;
	return normalizeSchool(entity);
}

export async function deleteSchoolRequest(
	id: string,
): Promise<{ success: boolean }> {
	await api.delete(`/owner/tenants/${encodeURIComponent(id)}`);
	return { success: true };
}

export async function checkSlugAvailability(
	slug: string,
): Promise<SlugAvailability> {
	try {
		const { data } = await api.get<unknown>(
			"/owner/tenants/slug-availability",
			{
				params: { slug },
			},
		);
		const entity = unwrapEntity(data) ?? {};
		return {
			available: Boolean(entity.available ?? true),
			suggestions: Array.isArray(entity.suggestions)
				? entity.suggestions.filter((s): s is string => typeof s === "string")
				: [],
		};
	} catch (error) {
		if (
			error instanceof ApiError &&
			(error.status === 404 || error.status === 405)
		) {
			return { available: true, suggestions: [] };
		}
		throw error;
	}
}

export async function fetchSchoolPlans(): Promise<Plan[]> {
	const { data } = await api.get<unknown>("/plans");
	return unwrapList(data)
		.map(normalizePlan)
		.filter((item): item is Plan => item !== null);
}

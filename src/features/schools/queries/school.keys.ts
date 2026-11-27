import type { SchoolListFilters } from "#/features/schools/types/schools.type.ts";

export const SCHOOL_KEYS = {
	all: ["schools"] as const,
	lists: (filters?: SchoolListFilters) =>
		[...SCHOOL_KEYS.all, "list", filters ?? {}] as const,
	detail: (id: string) => [...SCHOOL_KEYS.all, "detail", id] as const,
	plans: () => [...SCHOOL_KEYS.all, "plans"] as const,
	slug: (slug: string) => [...SCHOOL_KEYS.all, "slug", slug] as const,
};

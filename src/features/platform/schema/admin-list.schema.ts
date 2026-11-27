// #/features/platform/schema/admin-list.schema.ts
import { z } from "zod";

/** Shared list parameters for the platform admin endpoints (Spatie query builder). */
export const adminListParamsSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1).default(1),
	perPage: z.coerce.number().int().min(1).max(100).catch(20).default(20),
	search: z.string().trim().max(200).optional(),
	filters: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional(),
});

export type AdminListParams = z.infer<typeof adminListParamsSchema>;

export interface AdminListMeta {
	total: number;
	page: number;
	perPage: number;
	lastPage: number;
}

export interface AdminListResult<T> {
	items: Array<T>;
	meta: AdminListMeta;
}

/**
 * Turns the shared list params into the query string Laravel's Spatie query
 * builder expects (`page`, `per_page`, `filter[...]`).
 */
export function buildAdminListQuery(
	params: AdminListParams,
	extra: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {
		page: params.page,
		per_page: params.perPage,
		...extra,
	};

	if (params.search) {
		query["filter[search]"] = params.search;
	}

	for (const [key, value] of Object.entries(params.filters ?? {})) {
		query[`filter[${key}]`] = value;
	}

	return query;
}

// #/features/feature-usage/server/feature-usage.server.ts
import type {
	FeatureUsageRecord,
	FeatureUsageRef,
} from "#/features/feature-usage/types/feature-usage.type.ts";
import {
	type AdminListParams,
	type AdminListResult,
	buildAdminListQuery,
} from "#/features/platform/schema/admin-list.schema.ts";
import {
	asRecord,
	readNumber,
	readText,
	unwrapPaginated,
} from "#/lib/payload.ts";
import { adminApi } from "#/server/admin-endpoints.ts";
import { api } from "#/server/api.server.ts";

function normalizeRef(
	value: unknown,
	fallbackName?: string,
): FeatureUsageRef | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	const name = readText(record.name, record.title, fallbackName);
	if (!id && !name) return null;
	return { id: id ?? name ?? "", name };
}

/** Normalizes a feature-usage counter from the backend payload. */
export function normalizeFeatureUsage(
	value: unknown,
): FeatureUsageRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;

	const limitRaw =
		record.limit ?? record.quota ?? record.max ?? record.allowance;

	return {
		id,
		tenant:
			normalizeRef(
				record.tenant ?? record.company,
				readText(record.tenant_name) ?? undefined,
			) ?? null,
		feature:
			normalizeRef(
				record.feature,
				readText(record.feature_name) ?? undefined,
			) ?? null,
		used: readNumber(
			record.used ?? record.usage ?? record.consumed ?? record.value,
			0,
		),
		limit:
			limitRaw === null || limitRaw === undefined || limitRaw === ""
				? null
				: readNumber(limitRaw, 0),
		period: readText(record.period, record.billing_period, record.cycle),
		resetsAt: readText(record.resets_at, record.reset_at, record.renewal_at),
		updatedAt: readText(record.updated_at, record.updatedAt),
	};
}

/** `GET /v1/admin/feature-usage` */
export async function fetchFeatureUsages(
	params: AdminListParams,
): Promise<AdminListResult<FeatureUsageRecord>> {
	const { data } = await api.get<unknown>(adminApi.featureUsage.index, {
		params: buildAdminListQuery(params),
	});

	const { items, meta } = unwrapPaginated(data, normalizeFeatureUsage);
	return { items, meta };
}

/** `POST /v1/admin/feature-usage/{featureUsage}/reset` */
export async function resetFeatureUsageRequest(id: string): Promise<void> {
	await api.post(adminApi.featureUsage.reset(id));
}

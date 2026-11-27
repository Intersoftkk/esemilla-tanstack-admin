// #/features/owners/server/owners.server.ts

import type { OwnerRecord } from "#/features/owners/types/owners.type.ts";
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
import { api } from "#/server/api.server.ts";

/** Normalizes a central owner profile from the backend payload. */
export function normalizeOwner(value: unknown): OwnerRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;

	const tenants = record.tenants;
	const tenantsCount = Array.isArray(tenants)
		? tenants.length
		: readNumber(
				record.tenants_count ??
					asRecord(record.counts).tenants ??
					record.businesses_count,
				0,
			);

	return {
		id,
		name: readText(record.name, record.full_name),
		email: readText(record.email),
		phone: readText(record.phone, record.mobile),
		status: readText(record.status, record.state) ?? "active",
		tenantsCount,
		createdAt: readText(record.created_at, record.createdAt),
	};
}

/** `GET /admin/owners` */
export async function fetchOwners(
	params: AdminListParams,
): Promise<AdminListResult<OwnerRecord>> {
	const { data } = await api.get<unknown>("/admin/owners", {
		params: buildAdminListQuery(params),
	});

	const { items, meta } = unwrapPaginated(data, normalizeOwner);
	return { items, meta };
}

// #/features/domains/server/domains.server.ts
import type { DomainRecord } from "#/features/domains/types/domains.type.ts";
import {
	type AdminListParams,
	type AdminListResult,
	buildAdminListQuery,
} from "#/features/platform/schema/admin-list.schema.ts";
import {
	asRecord,
	readBoolean,
	readText,
	unwrapPaginated,
} from "#/lib/payload.ts";
import { api } from "#/server/api.server.ts";

/** Normalizes a custom-domain record from the backend payload. */
export function normalizeDomain(value: unknown): DomainRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	const domain = readText(record.domain, record.host, record.name);
	if (!id || !domain) return null;

	const tenant = asRecord(record.tenant ?? record.company);
	const tenantId = readText(tenant.id, record.tenant_id);

	return {
		id,
		domain,
		tenant:
			tenantId || readText(tenant.name)
				? {
						id: tenantId ?? "",
						name: readText(tenant.name, record.tenant_name),
					}
				: null,
		status: readText(record.status, record.state) ?? "pending",
		verified: readBoolean(
			record.verified ?? record.is_verified ?? record.dns_verified,
		),
		isPrimary: readBoolean(record.is_primary ?? record.primary),
		createdAt: readText(record.created_at, record.createdAt),
	};
}

/** `GET /v1/admin/domains` */
export async function fetchDomains(
	params: AdminListParams,
): Promise<AdminListResult<DomainRecord>> {
	const { data } = await api.get<unknown>("/v1/admin/domains", {
		params: buildAdminListQuery(params),
	});

	const { items, meta } = unwrapPaginated(data, normalizeDomain);
	return { items, meta };
}

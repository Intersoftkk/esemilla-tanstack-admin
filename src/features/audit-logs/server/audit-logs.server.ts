// #/features/audit-logs/server/audit-logs.server.ts
import type { AuditLogRecord } from "#/features/audit-logs/types/audit-logs.type.ts";
import {
	type AdminListParams,
	type AdminListResult,
	buildAdminListQuery,
} from "#/features/platform/schema/admin-list.schema.ts";
import { asRecord, readText, unwrapPaginated } from "#/lib/payload.ts";
import { api } from "#/server/api.server.ts";

/** Drops the PHP namespace so the UI can show `Tenant` instead of `App\\Models\\Tenant`. */
function shortClassName(value: string | null): string | null {
	if (!value) return null;
	const parts = value.split("\\");
	return parts[parts.length - 1] || null;
}

/** Normalizes an audit entry from the backend payload. */
export function normalizeAuditLog(value: unknown): AuditLogRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;

	const actor = asRecord(record.actor ?? record.causer ?? record.user);
	const actorId = readText(actor.id, record.actor_id, record.causer_id);
	const actorName = readText(actor.name, record.actor_name, record.causer_name);
	const changes = asRecord(
		record.changes ?? record.properties ?? record.new_values,
	);

	return {
		id,
		event: readText(record.event, record.action) ?? "updated",
		description: readText(
			record.description,
			record.message,
			record.subject_name,
		),
		actor:
			actorId || actorName
				? {
						id: actorId ?? "",
						name: actorName,
						email: readText(actor.email, record.actor_email),
					}
				: null,
		subjectType: shortClassName(
			readText(record.subject_type, record.subjectType, record.model_type),
		),
		subjectId: readText(record.subject_id, record.subjectId, record.model_id),
		ipAddress: readText(record.ip_address, record.ip, record.ipAddress),
		createdAt: readText(record.created_at, record.createdAt),
		changes: Object.keys(changes).length
			? JSON.stringify(changes, null, 2)
			: null,
	};
}

/** `GET /v1/admin/audit-logs` */
export async function fetchAuditLogs(
	params: AdminListParams,
): Promise<AdminListResult<AuditLogRecord>> {
	const { data } = await api.get<unknown>("/v1/admin/audit-logs", {
		params: buildAdminListQuery(params),
	});

	const { items, meta } = unwrapPaginated(data, normalizeAuditLog);
	return { items, meta };
}

/** `GET /v1/admin/audit-logs/record/{type}/{id}` */
export async function fetchAuditLogsForRecord(
	type: string,
	id: string,
): Promise<Array<AuditLogRecord>> {
	const { data } = await api.get<unknown>(
		`/v1/admin/audit-logs/record/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
	);
	const { items } = unwrapPaginated(data, normalizeAuditLog);
	return items;
}

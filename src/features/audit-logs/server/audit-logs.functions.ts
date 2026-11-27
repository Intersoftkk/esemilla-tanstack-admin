// #/features/audit-logs/server/audit-logs.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	fetchAuditLogs,
	fetchAuditLogsForRecord,
} from "#/features/audit-logs/server/audit-logs.server.ts";
import { adminListParamsSchema } from "#/features/platform/schema/admin-list.schema.ts";

const idSchema = z.union([z.string(), z.number()]).transform(String);

const recordSchema = z.object({ type: idSchema, id: idSchema });

/** Server function: paginated audit trail. */
export const getAuditLogsFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => adminListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchAuditLogs(data));

/** Server function: the audit trail of a single record. */
export const getRecordAuditLogsFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => recordSchema.parse(data))
	.handler(async ({ data }) => fetchAuditLogsForRecord(data.type, data.id));

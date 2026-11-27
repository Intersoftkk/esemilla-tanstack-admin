// #/features/domains/server/domains.functions.ts
import { createServerFn } from "@tanstack/react-start";

import { fetchDomains } from "#/features/domains/server/domains.server.ts";
import { adminListParamsSchema } from "#/features/platform/schema/admin-list.schema.ts";

/** Server function: paginated custom domains. */
export const getDomainsFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => adminListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchDomains(data));

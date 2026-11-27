// #/features/admins/server/admins.functions.ts
import { createServerFn } from "@tanstack/react-start";

import { fetchAdmins } from "#/features/admins/server/admins.server.ts";
import { adminListParamsSchema } from "#/features/platform/schema/admin-list.schema.ts";

/** Server function: paginated central admins. */
export const getAdminsFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => adminListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchAdmins(data));

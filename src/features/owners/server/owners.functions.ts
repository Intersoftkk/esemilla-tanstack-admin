// #/features/owners/server/owners.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { fetchOwners } from "#/features/owners/server/owners.server.ts";
import { adminListParamsSchema } from "#/features/platform/schema/admin-list.schema.ts";

/** Server function: paginated central owners. */
export const getOwnersFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => adminListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchOwners(data));

// #/features/feature-usage/server/feature-usage.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	fetchFeatureUsages,
	resetFeatureUsageRequest,
} from "#/features/feature-usage/server/feature-usage.server.ts";
import { adminListParamsSchema } from "#/features/platform/schema/admin-list.schema.ts";

const idSchema = z.union([z.string(), z.number()]).transform(String);

/** Server function: platform-wide usage counters. */
export const getFeatureUsagesFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => adminListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchFeatureUsages(data));

/** Server function: reset a usage counter. */
export const resetFeatureUsageFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => idSchema.parse(data))
	.handler(async ({ data: id }) => {
		await resetFeatureUsageRequest(id);
		return { success: true };
	});

// #/features/support/server/support.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { supportSchema } from "#/features/support/schema/support-form.schema.ts";
import { supportListParamsSchema } from "#/features/support/schema/support-search.schema.ts";
import {
	createSupportRequest,
	deleteSupportRequest,
	fetchCompanies,
	fetchSupport,
	fetchSupportList,
	updateSupportRequest,
} from "#/features/support/server/support.server.ts";

const supportIdSchema = z.union([z.string(), z.number()]).transform(String);

const updateSupportSchema = z.object({
	id: supportIdSchema,
	payload: supportSchema,
});

/** Server function: paginated support list. */
export const getSupportListFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => supportListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchSupportList(data));

/** Server function: a single support by ID. */
export const getSupportFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => supportIdSchema.parse(data))
	.handler(async ({ data: id }) => fetchSupport(id));

/** Server function: companies available for support assignment. */
export const getCompaniesFn = createServerFn({ method: "GET" }).handler(
	async () => fetchCompanies(),
);

/** Server function: create a support. */
export const createSupportFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => supportSchema.parse(data))
	.handler(async ({ data }) => createSupportRequest(data));

/** Server function: update a support. */
export const updateSupportFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => updateSupportSchema.parse(data))
	.handler(async ({ data }) => updateSupportRequest(data.id, data.payload));

/** Server function: delete a support. */
export const deleteSupportFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => supportIdSchema.parse(data))
	.handler(async ({ data: id }) => deleteSupportRequest(id));

/** Server function: delete several support in one request. */
export const deleteSupportsFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => z.array(supportIdSchema).min(1).parse(data))
	.handler(async ({ data: ids }) => {
		await Promise.all(ids.map((id) => deleteSupportRequest(id)));
		return { deleted: ids.length };
	});

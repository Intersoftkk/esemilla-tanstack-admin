// #/features/settings/server/settings.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
	fetchSettingGroups,
	updateSettingsBulkRequest,
} from "#/features/settings/server/settings.server.ts";

const settingValueSchema = z.union([z.string(), z.number(), z.boolean()]);

const bulkUpdateSchema = z.object({
	changes: z
		.array(z.object({ key: z.string().min(1), value: settingValueSchema }))
		.min(1),
});

/** Server function: every platform setting, grouped by section. */
export const getSettingGroupsFn = createServerFn({ method: "GET" }).handler(
	async () => fetchSettingGroups(),
);

/** Server function: persist a batch of platform settings. */
export const updateSettingsBulkFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => bulkUpdateSchema.parse(data))
	.handler(async ({ data }) => {
		await updateSettingsBulkRequest(data.changes);
		return { success: true };
	});

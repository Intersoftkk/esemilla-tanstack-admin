import { z } from "zod";

/** Shareable list state; the schools endpoint currently returns an unpaginated list. */
export const schoolsSearchSchema = z.object({
	search: z.string().default("").catch(""),
	status: z
		.enum(["all", "active", "pending", "suspended", "archived"])
		.default("all")
		.catch("all"),
	sort: z
		.enum(["newest", "name", "students"])
		.default("newest")
		.catch("newest"),
	view: z.enum(["table", "grid"]).default("table").catch("table"),
	page: z.coerce.number().int().min(1).default(1).catch(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(10).catch(10),
});
export type SchoolsSearch = z.infer<typeof schoolsSearchSchema>;

// src/features/notification/schema/notification-search.schema.ts

import type { PaginationState, SortingState } from "@tanstack/react-table";
import { z } from "zod";
import type { QueryBuilderInput } from "#/utils/query-builder.ts";
import {
	arrayPreprocess,
	numberPreprocess,
	stringPreprocess,
} from "#/utils/zod-preprocessors.ts";

export const notificationSearchSchema = z.object({
	search: z.preprocess(stringPreprocess, z.string()).default(""),
	pageIndex: z
		.preprocess((val) => numberPreprocess(val, 1), z.number())
		.default(1),
	pageSize: z
		.preprocess((val) => numberPreprocess(val, 10), z.number())
		.default(10),
	read_status: z
		.preprocess(
			(val) =>
				typeof val === "string" &&
				["all", "unread", "read"].includes(val.trim())
					? val.trim()
					: "all",
			z.enum(["all", "unread", "read"]),
		)
		.default("all"),
	type: z.preprocess(arrayPreprocess, z.array(z.string())).default([]),
	sort: z.preprocess(arrayPreprocess, z.array(z.string())).default([]),
});

export type NotificationSearch = z.infer<typeof notificationSearchSchema>;
export type NotificationSearchInput = z.input<typeof notificationSearchSchema>;

export type NotificationFilters = Pick<
	NotificationSearch,
	"search" | "read_status" | "type"
>;

export const EMPTY_NOTIFICATION_FILTERS: NotificationFilters = {
	search: "",
	read_status: "all",
	type: [],
};

/**
 * Converts TanStack Table pagination, sorting, and filters states
 * into a flat, validated NotificationSearch payload.
 */
export function tableStateToNotificationSearch(
	pagination: PaginationState,
	sorting: SortingState,
	filters: NotificationFilters,
): NotificationSearch {
	return {
		pageIndex: pagination.pageIndex + 1, // 0-indexed to 1-indexed
		pageSize: pagination.pageSize,
		sort: sorting.map((s) => (s.desc ? `-${s.id}` : s.id)),
		...filters,
	};
}

export function mapNotificationSearchToQuery(
	search: NotificationSearch,
): QueryBuilderInput {
	return {
		page: search.pageIndex,
		perPage: search.pageSize,
		sort: search.sort.length > 0 ? search.sort : undefined,
		filters: {
			search: search.search || undefined,
			type: search.type.length > 0 ? search.type : undefined,
			read:
				search.read_status === "read"
					? true
					: search.read_status === "unread"
						? false
						: undefined,
		},
	};
}

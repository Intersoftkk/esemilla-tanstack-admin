import type { RowData } from "@tanstack/react-table";
import { BreadcrumbValue } from "#/components/layout/router-breadcrumb";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
	interface StaticDataRouteOption {
		breadcrumb?: BreadcrumbValue;
	}
}

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		className: string;
	}
}

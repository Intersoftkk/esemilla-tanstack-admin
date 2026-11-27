import type { ColumnSort } from "@tanstack/react-table";
import type { FilterItemSchema } from "#/lib/nuqs-parsers";

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
	id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
	id: Extract<keyof TData, string>;
}

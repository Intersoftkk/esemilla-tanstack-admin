import type { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

interface DataTableViewOptionsProps {
	table: Table<any, any>;
}

export function DataTableViewOptions({ table }: DataTableViewOptionsProps) {
	const hideableColumns =
		table
			.getAllColumns?.()
			?.filter(
				(column) =>
					typeof column.accessorFn !== "undefined" && column.getCanHide?.(),
			) ?? [];

	if (hideableColumns.length === 0) {
		return null;
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 lg:flex"
				>
					<SlidersHorizontal className="mr-2 h-4 w-4" />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{hideableColumns.map((column) => (
					<DropdownMenuCheckboxItem
						key={column.id}
						className="capitalize"
						checked={column.getIsVisible?.() ?? true}
						onCheckedChange={(value) => column.toggleVisibility?.(!!value)}
					>
						{column.id}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

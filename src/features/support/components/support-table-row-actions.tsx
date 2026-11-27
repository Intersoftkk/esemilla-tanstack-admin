// #/features/support/components/support-table-row-actions.tsx

import type { Row } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Eye, Trash2 } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import type { supportTableFeatures } from "#/features/support/config/support.config.ts";
import { useSupport } from "#/features/support/context/support-context.tsx";
import type { SupportRecord } from "#/features/support/types/support.type.ts";

interface SupportTableRowActionsProps {
	row: Row<typeof supportTableFeatures, SupportRecord>;
}

/** Row action menu with view, edit and delete permissions. */
export function SupportTableRowActions({ row }: SupportTableRowActionsProps) {
	const { setOpen, setCurrentRow } = useSupport();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex w-8 p-0 data-[state=open]:bg-muted"
				>
					<EllipsisVertical className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-44">
				<DropdownMenuItem
					className="w-full cursor-pointer"
					onClick={() => {
						setCurrentRow(row.original);
						setOpen("view");
					}}
				>
					View
					<DropdownMenuShortcut>
						<Eye size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="w-full cursor-pointer"
					onClick={() => {
						setCurrentRow(row.original);
						setOpen("edit");
					}}
				>
					Edit
					<DropdownMenuShortcut>
						<Edit size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="w-full cursor-pointer text-destructive focus:text-destructive"
					onClick={() => {
						setCurrentRow(row.original);
						setOpen("delete");
					}}
				>
					Delete
					<DropdownMenuShortcut>
						<Trash2 size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

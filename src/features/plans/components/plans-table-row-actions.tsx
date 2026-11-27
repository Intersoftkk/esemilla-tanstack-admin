// #/features/plans/components/plans-table-row-actions.tsx

import type { Row } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Eye, Settings2, Trash2 } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { PLATFORM_PERMISSIONS } from "#/config/permissions.config";
import { PermissionGuard } from "#/features/auth/components/permission-guard";
import type { plansTableFeatures } from "#/features/plans/config/plans.config.ts";
import { usePlans } from "#/features/plans/context/plans-context.tsx";
import type { PlanRecord } from "#/features/plans/types/plans.type.ts";

interface PlansTableRowActionsProps {
	row: Row<typeof plansTableFeatures, PlanRecord>;
}

/** Row action menu with view, edit and delete permissions. */
export function PlansTableRowActions({ row }: PlansTableRowActionsProps) {
	const { setOpen, setCurrentRow } = usePlans();

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
				<PermissionGuard permissions={[PLATFORM_PERMISSIONS.PlatformPlanView]}>
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
				</PermissionGuard>

				<PermissionGuard permissions={[PLATFORM_PERMISSIONS.PlatformPlanEdit]}>
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
				</PermissionGuard>

				<PermissionGuard permissions={[PLATFORM_PERMISSIONS.PlatformPlanEdit]}>
					<DropdownMenuItem
						className="w-full cursor-pointer"
						onClick={() => {
							setCurrentRow(row.original);
							setOpen("features");
						}}
					>
						Features
						<DropdownMenuShortcut>
							<Settings2 size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</PermissionGuard>

				<PermissionGuard
					permissions={[PLATFORM_PERMISSIONS.PlatformPlanDelete]}
				>
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
				</PermissionGuard>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

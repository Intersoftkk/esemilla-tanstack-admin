// #/features/subscriptions/components/subscriptions-table-row-actions.tsx

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
import type { subscriptionsTableFeatures } from "#/features/subscriptions/config/subscriptions.config.ts";
import { useSubscriptions } from "#/features/subscriptions/context/subscriptions-context.tsx";
import type { SubscriptionRecord } from "#/features/subscriptions/types/subscriptions.type.ts";

interface SubscriptionsTableRowActionsProps {
	row: Row<typeof subscriptionsTableFeatures, SubscriptionRecord>;
}

/** Row action menu with view, edit and delete permissions. */
export function SubscriptionsTableRowActions({
	row,
}: SubscriptionsTableRowActionsProps) {
	const { setOpen, setCurrentRow } = useSubscriptions();

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
				<PermissionGuard
					permissions={[PLATFORM_PERMISSIONS.PlatformSubscriptionView]}
				>
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

				<PermissionGuard
					permissions={[PLATFORM_PERMISSIONS.PlatformSubscriptionEdit]}
				>
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

				<PermissionGuard
					permissions={[PLATFORM_PERMISSIONS.PlatformSubscriptionEdit]}
				>
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
					permissions={[PLATFORM_PERMISSIONS.PlatformSubscriptionCancel]}
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

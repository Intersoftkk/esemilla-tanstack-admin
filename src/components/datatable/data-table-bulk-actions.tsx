import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

interface DataTableBulkActionsProps {
	table: Table<any, any>;
	entityName?: string;
	children?: React.ReactNode;
}

export function DataTableBulkActions({
	table,
	entityName = "item",
	children,
}: DataTableBulkActionsProps) {
	const selectedRows = table.getSelectedRowModel?.()?.rows ?? [];
	const selectedCount = selectedRows.length;
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [announcement, setAnnouncement] = useState("");

	// Announce selection changes to screen readers
	useEffect(() => {
		if (selectedCount > 0) {
			const message = `${selectedCount} ${entityName}${selectedCount > 1 ? "s" : ""} selected. Bulk actions toolbar is available.`;
			setAnnouncement(message);

			const timer = setTimeout(() => setAnnouncement(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [selectedCount, entityName]);

	const handleClearSelection = () => {
		table.resetRowSelection?.();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		const buttons = toolbarRef.current?.querySelectorAll("button");
		if (!buttons || buttons.length === 0) return;

		const currentIndex = Array.from(buttons).findIndex(
			(button) => button === document.activeElement,
		);

		switch (event.key) {
			case "ArrowRight": {
				event.preventDefault();
				const nextIndex = (currentIndex + 1) % buttons.length;
				buttons[nextIndex]?.focus();
				break;
			}
			case "ArrowLeft": {
				event.preventDefault();
				const prevIndex =
					currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
				buttons[prevIndex]?.focus();
				break;
			}
			case "Home":
				event.preventDefault();
				buttons[0]?.focus();
				break;
			case "End":
				event.preventDefault();
				buttons[buttons.length - 1]?.focus();
				break;
			case "Escape": {
				const target = event.target as HTMLElement;
				const activeElement = document.activeElement as HTMLElement;

				// Prevent clearing selection if Escape was triggered inside a dropdown/dialog
				const isFromDropdown =
					target?.closest('[data-slot*="dropdown"]') ||
					activeElement?.closest('[data-slot*="dropdown"]');

				if (isFromDropdown) return;

				event.preventDefault();
				handleClearSelection();
				break;
			}
		}
	};

	if (selectedCount === 0) {
		return null;
	}

	return (
		<>
			<output aria-live="polite" aria-atomic="true" className="sr-only">
				{announcement}
			</output>

			<div
				ref={toolbarRef}
				role="toolbar"
				aria-label={`Bulk actions for ${selectedCount} selected ${entityName}${selectedCount > 1 ? "s" : ""}`}
				aria-describedby="bulk-actions-description"
				tabIndex={-1}
				onKeyDown={handleKeyDown}
				className={cn(
					"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl",
					"transition-all duration-300 ease-out hover:scale-105",
					"focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
				)}
			>
				<div
					className={cn(
						"flex items-center gap-x-2 rounded-xl border p-2 shadow-xl",
						"bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/60",
					)}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={handleClearSelection}
								className="h-6 w-6 rounded-full"
								aria-label="Clear selection"
							>
								<X className="h-3.5 w-3.5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Clear selection (Escape)</p>
						</TooltipContent>
					</Tooltip>

					<Separator
						className="h-5"
						orientation="vertical"
						aria-hidden="true"
					/>

					<div
						className="flex items-center gap-x-1 text-sm font-medium"
						id="bulk-actions-description"
					>
						<Badge
							variant="secondary"
							className="min-w-6 rounded-md px-1.5 py-0.5 text-xs"
						>
							{selectedCount}
						</Badge>
						<span className="hidden sm:inline">
							{entityName}
							{selectedCount > 1 ? "s" : ""}
						</span>
						<span>selected</span>
					</div>

					{children && (
						<>
							<Separator
								className="h-5"
								orientation="vertical"
								aria-hidden="true"
							/>
							<div className="flex items-center gap-x-1">{children}</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}

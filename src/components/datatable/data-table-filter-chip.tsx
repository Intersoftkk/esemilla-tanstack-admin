"use client";

import { X } from "lucide-react";
import { cn } from "#/lib/utils";

interface DataTableFilterChipProps {
	label: string;
	value: string;
	onRemove: () => void;
	className?: string;
}

export function DataTableFilterChip({
	label,
	value,
	onRemove,
	className,
}: DataTableFilterChipProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
				className,
			)}
		>
			<span className="text-muted-foreground">{label}:</span>
			<span className="font-medium truncate max-w-[180px]">{value}</span>

			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				className="ml-0.5 rounded-full p-0.5 hover:bg-background/20 transition-colors"
				aria-label={`Remove filter: ${value}`}
			>
				<X className="h-3 w-3" />
			</button>
		</span>
	);
}

interface DataTableFilterChipGroupProps {
	children: React.ReactNode;
	className?: string;
}

export function DataTableFilterChipGroup({
	children,
	className,
}: DataTableFilterChipGroupProps) {
	return (
		<div className={cn("flex flex-wrap items-center gap-1.5", className)}>
			{children}
		</div>
	);
}

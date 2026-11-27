import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

export interface PageHeaderProps {
	title: ReactNode;
	description?: string;
	icon?: LucideIcon;
	iconClassName?: string;
	iconBgClassName?: string;
	badge?: ReactNode;
	actions?: ReactNode;
	className?: string;
	size?: "sm" | "md";
}

export function PageHeader({
	title,
	description,
	icon: Icon,
	iconClassName,
	iconBgClassName,
	badge,
	actions,
	className,
	size = "md",
}: PageHeaderProps) {
	const isCompact = size === "sm";

	return (
		<div
			className={cn(
				"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			{/* Left: Icon, Title, Badge & Description */}
			<div className="flex min-w-0 items-center gap-2.5">
				{Icon && (
					<div
						className={cn(
							"flex shrink-0 items-center justify-center rounded-lg shadow-sm",
							isCompact ? "h-8 w-8" : "h-9 w-9",
							iconBgClassName ?? "bg-primary/10",
						)}
					>
						<Icon
							className={cn(
								isCompact ? "h-3.5 w-3.5" : "h-4 w-4",
								iconClassName ?? "text-primary",
							)}
						/>
					</div>
				)}

				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<h1
							className={cn(
								"font-semibold tracking-tight text-foreground truncate",
								isCompact ? "text-base" : "text-lg",
							)}
						>
							{title}
						</h1>
						{badge}
					</div>

					{description && (
						<p className="mt-0.5 text-xs text-muted-foreground truncate">
							{description}
						</p>
					)}
				</div>
			</div>

			{/* Right: Action Buttons / Menus */}
			{actions && (
				<div className="flex shrink-0 flex-wrap items-center gap-2">
					{actions}
				</div>
			)}
		</div>
	);
}

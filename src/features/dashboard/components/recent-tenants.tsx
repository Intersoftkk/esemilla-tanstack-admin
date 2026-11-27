// #/features/dashboard/components/recent-tenants.tsx
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	recentTenants,
	type TenantStatus,
} from "#/features/dashboard/data/dashboard.data.ts";
import { cn } from "#/lib/utils";

const statusStyles: Record<TenantStatus, { label: string; className: string }> =
	{
		active: {
			label: "Active",
			className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
		},
		trial: {
			label: "Trial",
			className: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
		},
		suspended: {
			label: "Suspended",
			className: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
		},
	};

/** Initials shown in the tenant avatar tile. */
function initialsOf(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}

/** The most recently onboarded tenant schools. */
export function RecentTenants({ className }: { className?: string }) {
	return (
		<Card className={cn("gap-0", className)}>
			<CardHeader className="pb-2">
				<CardTitle>Recent tenants</CardTitle>
				<CardDescription>
					Schools onboarded over the last two weeks.
				</CardDescription>
				<CardAction>
					<Button variant="ghost" size="sm" asChild>
						<Link to="/schools">
							View all
							<ChevronRight className="h-3.5 w-3.5" />
						</Link>
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="divide-y divide-border/60">
					{recentTenants.map((tenant) => {
						const status = statusStyles[tenant.status];

						return (
							<div
								key={tenant.id}
								className="flex items-center justify-between gap-3 py-3 first:pt-2 last:pb-0"
							>
								<div className="flex min-w-0 items-center gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/15">
										{initialsOf(tenant.name)}
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-medium text-foreground">
											{tenant.name}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{tenant.location} · {tenant.id}
										</p>
									</div>
								</div>

								<div className="flex shrink-0 items-center gap-2">
									<Badge variant="outline" className="hidden sm:inline-flex">
										{tenant.plan}
									</Badge>
									<span
										className={cn(
											"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
											status.className,
										)}
									>
										<span className="h-1.5 w-1.5 rounded-full bg-current" />
										{status.label}
									</span>
									<span className="hidden w-14 text-right text-xs text-muted-foreground tabular-nums sm:inline">
										{tenant.joined}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

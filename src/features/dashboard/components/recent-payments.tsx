// #/features/dashboard/components/recent-payments.tsx
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

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
	type PaymentStatus,
	recentPayments,
} from "#/features/dashboard/data/dashboard.data.ts";
import { cn } from "#/lib/utils";

const statusStyles: Record<
	PaymentStatus,
	{ label: string; className: string }
> = {
	paid: {
		label: "Paid",
		className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
	},
	pending: {
		label: "Pending",
		className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
	},
	failed: {
		label: "Failed",
		className: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
	},
};

/** Latest payments received from tenant schools. */
export function RecentPayments({ className }: { className?: string }) {
	return (
		<Card className={cn("gap-0", className)}>
			<CardHeader className="pb-2">
				<CardTitle>Latest payments</CardTitle>
				<CardDescription>Settlements and failed charges.</CardDescription>
				<CardAction>
					<Button variant="ghost" size="sm" asChild>
						<Link
							to="/payments"
							search={{
								search: "",
								pageIndex: 1,
								pageSize: 10,
								created_by_ids: [],
								status: [],
							}}
						>
							View all
							<ChevronRight className="h-3.5 w-3.5" />
						</Link>
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="divide-y divide-border/60">
					{recentPayments.map((payment) => {
						const status = statusStyles[payment.status];

						return (
							<div
								key={payment.id}
								className="flex items-center justify-between gap-3 py-3 first:pt-2 last:pb-0"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-foreground">
										{payment.tenant}
									</p>
									<p className="truncate text-xs text-muted-foreground">
										{payment.id} · {payment.method}
									</p>
								</div>

								<div className="flex shrink-0 items-center gap-2">
									<span className="text-sm font-semibold tabular-nums text-foreground">
										{payment.amount}
									</span>
									<span
										className={cn(
											"inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
											status.className,
										)}
									>
										{status.label}
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

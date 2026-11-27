// #/features/dashboard/components/dashboard-stats.tsx
import {
	ArrowDownRight,
	ArrowUpRight,
	Building2,
	CreditCard,
	LifeBuoy,
	type LucideIcon,
	Minus,
	Wallet,
} from "lucide-react";

import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
} from "#/components/ui/card.tsx";
import type { DashboardKpi } from "#/features/dashboard/data/dashboard.data.ts";
import { dashboardKpis } from "#/features/dashboard/data/dashboard.data.ts";
import { cn } from "#/lib/utils";

const kpiIcons: Record<DashboardKpi["id"], LucideIcon> = {
	tenants: Building2,
	mrr: Wallet,
	subscriptions: CreditCard,
	tickets: LifeBuoy,
};

const toneClasses: Record<DashboardKpi["tone"], string> = {
	positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
	negative: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
	neutral: "bg-muted text-muted-foreground",
};

/** Small pill showing the movement of a KPI. */
function ChangePill({ change, tone }: Pick<DashboardKpi, "change" | "tone">) {
	const Icon =
		tone === "positive"
			? ArrowUpRight
			: tone === "negative"
				? ArrowDownRight
				: Minus;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
				toneClasses[tone],
			)}
		>
			<Icon className="h-3 w-3" />
			{change}
		</span>
	);
}

/** Four headline numbers for the platform overview. */
export function DashboardStats() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{dashboardKpis.map((kpi) => {
				const Icon = kpiIcons[kpi.id];

				return (
					<Card key={kpi.id} className="gap-3">
						<CardHeader>
							<p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
								{kpi.label}
							</p>
							<CardAction>
								<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
									<Icon className="h-4 w-4" />
								</span>
							</CardAction>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
								{kpi.value}
							</p>
							<ChangePill change={kpi.change} tone={kpi.tone} />
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

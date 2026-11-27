// #/features/dashboard/components/plan-mix.tsx
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	planMix,
	tenantTotals,
} from "#/features/dashboard/data/dashboard.data.ts";
import { cn } from "#/lib/utils";

/** Share of active tenants per subscription plan. */
export function PlanMix({ className }: { className?: string }) {
	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>Plan mix</CardTitle>
				<CardDescription>
					{tenantTotals.tenants} active tenants ·{" "}
					{tenantTotals.averageRevenuePerTenant} average revenue
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{planMix.map((plan) => (
					<div key={plan.plan} className="space-y-1.5">
						<div className="flex items-center justify-between gap-2 text-xs">
							<span className="font-medium text-foreground">{plan.plan}</span>
							<span className="text-muted-foreground tabular-nums">
								{plan.tenants} tenants · {plan.share}%
							</span>
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								className={cn(
									"h-full rounded-full transition-all",
									plan.colorClass,
								)}
								style={{ width: `${plan.share}%` }}
							/>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

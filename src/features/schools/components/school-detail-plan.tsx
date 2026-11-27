import { Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { BILLING_CYCLE_OPTIONS } from "#/features/schools/config/school.config.ts";
import {
	useSchoolPlansQuery,
	useUpdateSchoolMutation,
} from "#/features/schools/queries/school.queries.ts";
import type {
	BillingCycle,
	School,
} from "#/features/schools/types/schools.type.ts";
import {
	formatMoney,
	priceForCycle,
} from "#/features/schools/utils/school.utils.ts";
import { cn } from "#/lib/utils.ts";

export function SchoolDetailPlan({ school }: { school: School }) {
	const plansQuery = useSchoolPlansQuery();
	const updateMutation = useUpdateSchoolMutation();
	const plans = plansQuery.data ?? [];

	const [cycle, setCycle] = useState<BillingCycle>(school.billingCycle);

	useEffect(() => {
		setCycle(school.billingCycle);
	}, [school.billingCycle]);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h3 className="text-base font-semibold">Subscription plan</h3>
					<p className="text-xs text-muted-foreground">
						Switch plan tiers or billing cycle for {school.name}.
					</p>
				</div>
				<div className="flex items-center gap-2">
					{BILLING_CYCLE_OPTIONS.map((option) => (
						<Button
							key={option.value}
							type="button"
							variant={cycle === option.value ? "default" : "outline"}
							size="sm"
							onClick={() => setCycle(option.value)}
						>
							{option.label}
						</Button>
					))}
				</div>
			</div>

			{plansQuery.isLoading && (
				<p className="text-sm text-muted-foreground">Loading plans…</p>
			)}
			{plansQuery.isError && (
				<div
					className="flex items-center gap-3 text-sm text-destructive"
					role="alert"
				>
					Unable to load plans.{" "}
					<Button
						variant="outline"
						size="sm"
						onClick={() => void plansQuery.refetch()}
					>
						Try again
					</Button>
				</div>
			)}
			{!plansQuery.isLoading && !plansQuery.isError && plans.length === 0 && (
				<p className="text-sm text-muted-foreground">No plans are available.</p>
			)}
			<div className="grid gap-4 md:grid-cols-3">
				{plans.map((plan) => {
					const isCurrent =
						school.planId === plan.id && school.billingCycle === cycle;
					const price = priceForCycle(plan, cycle);

					return (
						<Card
							key={plan.id}
							className={cn(
								"flex flex-col shadow-xs",
								isCurrent && "border-primary/50 ring-1 ring-primary/20",
							)}
						>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-base">{plan.name}</CardTitle>
									{plan.popular && (
										<Badge className="text-[10px]">
											<Sparkles className="mr-1 h-2.5 w-2.5" />
											Popular
										</Badge>
									)}
								</div>
								<CardDescription>{plan.tagline}</CardDescription>
								<div className="pt-2">
									<span className="text-2xl font-bold tabular-nums">
										{formatMoney(price, plan.currency)}
									</span>
									<span className="text-xs text-muted-foreground">
										/{cycle === "yearly" ? "year" : "month"}
									</span>
								</div>
							</CardHeader>

							<CardContent className="flex-1">
								<ul className="space-y-1.5 text-xs text-muted-foreground">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-start gap-2">
											<Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>

							<CardFooter className="border-t pt-4">
								<Button
									type="button"
									variant={isCurrent ? "secondary" : "default"}
									className="w-full"
									disabled={isCurrent || updateMutation.isPending}
									onClick={() =>
										updateMutation.mutate({
											id: school.id,
											payload: { planId: plan.id, billingCycle: cycle },
										})
									}
								>
									{updateMutation.isPending ? (
										<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
									) : null}
									{isCurrent ? "Current plan" : `Select ${plan.name}`}
								</Button>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

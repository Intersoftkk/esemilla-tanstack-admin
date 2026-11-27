// #/features/dashboard/dashboard-page.tsx
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Plus } from "lucide-react";

import { PageHeader } from "#/components/page-header.tsx";
import { Button } from "#/components/ui/button.tsx";
import { usePermission } from "#/features/auth/hooks/use-permission";
import { DashboardStats } from "#/features/dashboard/components/dashboard-stats.tsx";
import { NeedsAttention } from "#/features/dashboard/components/needs-attention.tsx";
import { PlanMix } from "#/features/dashboard/components/plan-mix.tsx";
import { RecentPayments } from "#/features/dashboard/components/recent-payments.tsx";
import { RecentTenants } from "#/features/dashboard/components/recent-tenants.tsx";
import { RevenueChart } from "#/features/dashboard/components/revenue-chart.tsx";

/** Platform admin overview: revenue, tenants and support at a glance. */
export function DashboardPage() {
	const { user } = usePermission();
	const firstName = user?.name?.trim().split(/\s+/)[0];

	return (
		<div className="space-y-6">
			<PageHeader
				title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
				description="Platform health across tenants, revenue and support."
				icon={LayoutDashboard}
				iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
				badge={
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
						<span className="h-1.5 w-1.5 rounded-full bg-current" />
						All systems operational
					</span>
				}
				actions={
					<>
						<Button variant="outline" size="sm" asChild>
							<Link
								to="/plans"
								search={{
									search: "",
									pageIndex: 1,
									pageSize: 10,
									created_by_ids: [],
									status: [],
								}}
							>
								View plans
							</Link>
						</Button>
						<Button size="sm" asChild>
							<Link to="/schools/new">
								<Plus className="h-3.5 w-3.5" />
								Onboard school
							</Link>
						</Button>
					</>
				}
			/>

			<DashboardStats />

			<div className="grid gap-4 lg:grid-cols-12">
				<RevenueChart className="lg:col-span-8" />
				<div className="space-y-4 lg:col-span-4">
					<PlanMix />
					<NeedsAttention />
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-12">
				<RecentTenants className="lg:col-span-7" />
				<RecentPayments className="lg:col-span-5" />
			</div>
		</div>
	);
}

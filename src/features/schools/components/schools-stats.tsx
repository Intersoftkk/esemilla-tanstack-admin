import { Building2, CheckCircle2, Globe, GraduationCap } from "lucide-react";

import { Card, CardContent } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import type { School } from "#/features/schools/types/school.types.ts";
import {
	computeSchoolStats,
	formatCompactNumber,
} from "#/features/schools/utils/school.utils.ts";

interface SchoolsStatsProps {
	schools: School[];
	isLoading: boolean;
}

export function SchoolsStats({ schools, isLoading }: SchoolsStatsProps) {
	if (isLoading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((slot) => (
					<Card key={`school-stat-${slot}`}>
						<CardContent className="space-y-2 p-4">
							<Skeleton className="h-3.5 w-24" />
							<Skeleton className="h-6 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const stats = computeSchoolStats(schools);
	const items = [
		{
			label: "Total schools",
			value: String(stats.total),
			icon: Building2,
			tone: "text-primary",
			bg: "bg-primary/10",
		},
		{
			label: "Active portals",
			value: String(stats.active),
			icon: CheckCircle2,
			tone: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-500/10",
		},
		{
			label: "Enrolled students",
			value: formatCompactNumber(stats.students),
			icon: GraduationCap,
			tone: "text-blue-600 dark:text-blue-400",
			bg: "bg-blue-500/10",
		},
		{
			label: "Custom domains",
			value: String(stats.customDomains),
			icon: Globe,
			tone: "text-amber-600 dark:text-amber-400",
			bg: "bg-amber-500/10",
		},
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{items.map((item) => (
				<Card key={item.label} className="shadow-xs">
					<CardContent className="flex items-center justify-between p-4">
						<div>
							<p className="text-xs font-medium text-muted-foreground">
								{item.label}
							</p>
							<p className="mt-1 text-lg font-semibold tabular-nums">
								{item.value}
							</p>
						</div>
						<div
							className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}
						>
							<item.icon className={`h-4 w-4 ${item.tone}`} />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

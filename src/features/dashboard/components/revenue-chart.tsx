// #/features/dashboard/components/revenue-chart.tsx
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "#/components/ui/chart.tsx";
import { revenueSeries } from "#/features/dashboard/data/dashboard.data.ts";
import { cn } from "#/lib/utils";

const chartConfig = {
	mrr: {
		label: "MRR",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

/** Area chart of monthly recurring revenue over the last twelve months. */
export function RevenueChart({ className }: { className?: string }) {
	const latest = revenueSeries[revenueSeries.length - 1]?.mrr ?? 0;
	const previous = revenueSeries[revenueSeries.length - 2]?.mrr ?? latest;
	const growth = previous ? ((latest - previous) / previous) * 100 : 0;

	return (
		<Card className={cn("gap-0", className)}>
			<CardHeader className="pb-2">
				<CardTitle>Recurring revenue</CardTitle>
				<CardDescription>
					Monthly recurring revenue across all tenants, last 12 months.
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-2">
				<ChartContainer config={chartConfig} className="h-[264px] w-full">
					<AreaChart
						data={revenueSeries}
						margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
					>
						<defs>
							<linearGradient id="fillMrr" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-mrr)"
									stopOpacity={0.35}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-mrr)"
									stopOpacity={0.02}
								/>
							</linearGradient>
						</defs>

						<CartesianGrid vertical={false} strokeDasharray="3 3" />

						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>

						<YAxis
							width={52}
							tickLine={false}
							axisLine={false}
							tickMargin={4}
							tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
						/>

						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									indicator="line"
									formatter={(value) => currency.format(Number(value))}
								/>
							}
						/>

						<Area
							dataKey="mrr"
							type="monotone"
							stroke="var(--color-mrr)"
							strokeWidth={2}
							fill="url(#fillMrr)"
							activeDot={{ r: 4 }}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>

			<CardFooter className="mt-2 justify-between gap-3 border-t-0 bg-transparent px-(--card-spacing)">
				<div className="flex flex-col">
					<span className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
						Current MRR
					</span>
					<span className="text-lg font-semibold tabular-nums text-foreground">
						{currency.format(latest)}
					</span>
				</div>
				<span
					className={cn(
						"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
						growth >= 0
							? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
							: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
					)}
				>
					{growth >= 0 ? "+" : ""}
					{growth.toFixed(1)}% vs last month
				</span>
			</CardFooter>
		</Card>
	);
}

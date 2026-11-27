// #/features/dashboard/components/needs-attention.tsx
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { attentionItems } from "#/features/dashboard/data/dashboard.data.ts";
import { cn } from "#/lib/utils";

const toneClasses = {
	negative: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
	positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
	neutral: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
} as const;

/** Operational items that need a follow-up from the platform team. */
export function NeedsAttention({ className }: { className?: string }) {
	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>Needs attention</CardTitle>
				<CardDescription>Items to follow up this week.</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				{attentionItems.map((item) => (
					<Link
						key={item.id}
						to={item.to}
						className="flex items-center justify-between gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-muted/50"
					>
						<div className="flex min-w-0 items-center gap-2.5">
							<span
								className={cn(
									"flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums",
									toneClasses[item.tone],
								)}
							>
								{item.value}
							</span>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-foreground">
									{item.label}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{item.hint}
								</p>
							</div>
						</div>
						<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
					</Link>
				))}
			</CardContent>
		</Card>
	);
}

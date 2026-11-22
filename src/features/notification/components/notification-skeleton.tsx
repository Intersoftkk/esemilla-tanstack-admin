import { Skeleton } from "#/components/ui/skeleton.tsx";

export function NotificationSkeleton() {
	return (
		<div className="divide-y divide-border/50">
			{[1, 2, 3, 4].map((slot) => (
				<div key={`notif-sk-${slot}`} className="flex items-start gap-4 p-5">
					<Skeleton className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" />
					<div className="flex-1 space-y-2.5">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="h-3.5 w-full max-w-md" />
					</div>
				</div>
			))}
		</div>
	);
}

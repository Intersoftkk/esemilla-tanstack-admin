import { Inbox } from "lucide-react";

interface NotificationEmptyStateProps {
	filter: "all" | "unread";
	searchQuery: string;
	onReset: () => void;
}

export function NotificationEmptyState({
	filter,
	searchQuery,
	onReset,
}: NotificationEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center px-4 py-16 text-center">
			<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
				<Inbox className="h-6 w-6 opacity-60" />
			</div>
			<h3 className="text-sm font-semibold text-foreground">
				{searchQuery
					? "No matching notifications"
					: filter === "unread"
						? "You're all caught up!"
						: "No notifications yet"}
			</h3>
			<p className="mt-1 max-w-xs text-xs text-muted-foreground">
				{searchQuery
					? `We couldn't find any notifications matching "${searchQuery}".`
					: filter === "unread"
						? "You have read all of your notifications. Check back later for updates."
						: "When you receive alerts, replies, or system events, they will appear here."}
			</p>
			{(searchQuery || filter === "unread") && (
				<button
					type="button"
					onClick={onReset}
					className="mt-4 text-xs font-medium text-primary hover:underline"
				>
					Clear filters
				</button>
			)}
		</div>
	);
}

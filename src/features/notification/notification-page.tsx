import {
	AlertCircle,
	Bell,
	Check,
	Loader2,
	RefreshCw,
	Search,
} from "lucide-react";
import { useState } from "react";

import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { NotificationEmptyState } from "#/features/notification/components/notification-empty-state.tsx";
import { NotificationRow } from "#/features/notification/components/notification-row.tsx";
import { NotificationSkeleton } from "#/features/notification/components/notification-skeleton.tsx";
import {
	useDeleteNotificationMutation,
	useMarkAllNotificationsReadMutation,
	useMarkNotificationReadMutation,
	useNotificationsQuery,
} from "#/features/notification/queries/notification.queries.ts";

export function NotificationPage() {
	const [filter, setFilter] = useState<"all" | "unread">("all");
	const [searchQuery, setSearchQuery] = useState("");

	const { data, isLoading, isError, refetch, isFetching } =
		useNotificationsQuery();
	const markAllMutation = useMarkAllNotificationsReadMutation();
	const markSingleMutation = useMarkNotificationReadMutation();
	const deleteMutation = useDeleteNotificationMutation();

	const notifications = data?.data ?? [];
	const unreadCount =
		data?.unread_count ?? notifications.filter((n) => !n.read_at).length;

	const filteredNotifications = notifications.filter((n) => {
		if (filter === "unread" && n.read_at) return false;
		if (searchQuery.trim() !== "") {
			const q = searchQuery.toLowerCase();
			return (
				n.data.subject.toLowerCase().includes(q) ||
				n.data.description.toLowerCase().includes(q) ||
				(n.data.notified_from?.full_name.toLowerCase().includes(q) ?? false)
			);
		}
		return true;
	});

	return (
		<div className="space-y-6">
			<PageHeader
				title="Notifications"
				description="Stay updated with recent events, security alerts, and updates."
				icon={Bell}
				badge={
					unreadCount > 0 ? (
						<Badge variant="secondary" className="font-semibold">
							{unreadCount} unread
						</Badge>
					) : null
				}
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => void refetch()}
							disabled={isFetching}
						>
							<RefreshCw
								className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
							/>
							Refresh
						</Button>

						{unreadCount > 0 && (
							<Button
								size="sm"
								onClick={() => markAllMutation.mutate()}
								disabled={markAllMutation.isPending}
							>
								{markAllMutation.isPending ? (
									<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
								) : (
									<Check className="mr-1.5 h-3.5 w-3.5" />
								)}
								Mark all read
							</Button>
						)}
					</div>
				}
			/>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Tabs
					value={filter}
					onValueChange={(value) => setFilter(value as "all" | "unread")}
					className="w-full sm:w-auto"
				>
					<TabsList>
						<TabsTrigger value="all">
							All
							<span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
								{notifications.length}
							</span>
						</TabsTrigger>
						<TabsTrigger value="unread">
							Unread
							{unreadCount > 0 && (
								<span className="ml-1.5 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
									{unreadCount}
								</span>
							)}
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="relative w-full sm:w-72">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search notifications..."
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			<Card className="overflow-hidden border shadow-xs">
				{isLoading ? (
					<NotificationSkeleton />
				) : isError ? (
					<div className="flex flex-col items-center justify-center p-12 text-center">
						<AlertCircle className="mb-3 h-8 w-8 text-destructive/80" />
						<h3 className="text-sm font-semibold text-foreground">
							Failed to load notifications
						</h3>
						<p className="mt-1 text-xs text-muted-foreground">
							We could not retrieve your notifications at this time.
						</p>
						<Button
							variant="outline"
							size="sm"
							className="mt-4"
							onClick={() => void refetch()}
						>
							Try again
						</Button>
					</div>
				) : filteredNotifications.length > 0 ? (
					<div className="divide-y divide-border/50">
						{filteredNotifications.map((notification) => (
							<NotificationRow
								key={notification.id}
								notification={notification}
								onMarkRead={(id) => markSingleMutation.mutate(id)}
								onDelete={(id) => deleteMutation.mutate(id)}
								isDeleting={
									deleteMutation.isPending &&
									deleteMutation.variables === notification.id
								}
							/>
						))}
					</div>
				) : (
					<NotificationEmptyState
						filter={filter}
						searchQuery={searchQuery}
						onReset={() => {
							setFilter("all");
							setSearchQuery("");
						}}
					/>
				)}
			</Card>
		</div>
	);
}

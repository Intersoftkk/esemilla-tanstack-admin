import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Bell, Check, Inbox, Loader2, User } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { NOTIFICATION_KEYS } from "#/features/notification/queries/notification.keys.ts";
import {
	useMarkAllNotificationsReadMutation,
	useMarkNotificationReadMutation,
	useNotificationsQuery,
} from "#/features/notification/queries/notification.queries.ts";
import type {
	NotificationRecord,
	NotificationsResponse,
} from "#/features/notification/types/notification.ts";
import { usePrivateChannel } from "#/hooks/use-echo.ts";

export function NotificationDropdown() {
	const { user } = useRouteContext({ from: "__root__" });
	const queryClient = useQueryClient();

	const { data, isLoading } = useNotificationsQuery({
		enabled: Boolean(user),
	});
	const { mutate: handleMarkAllRead, isPending: isMarkingAll } =
		useMarkAllNotificationsReadMutation();
	const { mutate: handleMarkSingleRead } = useMarkNotificationReadMutation();

	const notifications = data?.data ?? [];
	const unreadCount =
		data?.unread_count ?? notifications.filter((n) => !n.read_at).length;

	usePrivateChannel(
		user ? `notifications.${user.id}` : null,
		"UserNotificationEvent",
		(newEvent: unknown) => {
			const parsed =
				typeof newEvent === "string"
					? (JSON.parse(newEvent) as NotificationRecord)
					: (newEvent as NotificationRecord);

			queryClient.setQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
				(old) => {
					if (!old) {
						return {
							data: [parsed],
							unread_count: 1,
							total: 1,
						};
					}
					return {
						...old,
						unread_count: old.unread_count + 1,
						total: (old.total ?? old.data.length) + 1,
						data: [parsed, ...old.data],
					};
				},
			);
		},
	);

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-9 w-9 rounded-lg border hover:bg-accent"
					aria-label="Open notifications"
				>
					<Bell className="h-4 w-4 text-foreground" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
						>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-80" align="end" forceMount>
				<DropdownMenuLabel className="flex items-center justify-between font-medium">
					<span className="text-sm font-semibold">Notifications</span>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
							onClick={() => handleMarkAllRead()}
							disabled={isMarkingAll}
						>
							{isMarkingAll ? (
								<Loader2 className="mr-1 h-3 w-3 animate-spin" />
							) : (
								<Check className="mr-1 h-3 w-3" />
							)}
							Mark all read
						</Button>
					)}
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup className="max-h-72 divide-y divide-border/50 overflow-y-auto">
					{isLoading ? (
						<div className="flex h-24 items-center justify-center">
							<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
						</div>
					) : notifications.length > 0 ? (
						notifications.map((n) => (
							<DropdownMenuItem
								key={n.id}
								className={`flex cursor-pointer flex-col items-start gap-1 p-3 transition-colors ${
									!n.read_at ? "bg-primary/5 font-medium" : ""
								}`}
								onClick={() => {
									if (!n.read_at) {
										handleMarkSingleRead(n.id);
									}
								}}
							>
								<div className="flex w-full items-center justify-between gap-2">
									<span className="truncate text-xs font-semibold text-foreground">
										{n.data.subject}
									</span>
									{!n.read_at && (
										<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
									)}
								</div>

								<span className="line-clamp-2 text-xs text-muted-foreground">
									{n.data.description}
								</span>

								<div className="mt-1 flex w-full items-center justify-between text-[10px] text-muted-foreground/70">
									{n.data.notified_from?.full_name ? (
										<span className="flex items-center gap-1 truncate font-medium">
											<User className="h-2.5 w-2.5" />
											{n.data.notified_from.full_name}
										</span>
									) : (
										<span />
									)}
									{n.created_at && (
										<span>
											{new Date(n.created_at).toLocaleDateString(undefined, {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									)}
								</div>
							</DropdownMenuItem>
						))
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
							<Inbox className="mb-2 h-6 w-6 opacity-40" />
							<p className="text-xs">No new notifications</p>
						</div>
					)}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link
						to="/notifications"
						search={{
							search: "",
							pageIndex: 1,
							pageSize: 10,
							created_by_ids: [],
							status: [],
						}}
						className="w-full justify-center text-center text-xs font-medium text-primary hover:underline"
					>
						View all notifications
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

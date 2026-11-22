import { Check, Loader2, MailOpen, Trash2, User } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import type { NotificationRecord } from "#/features/notification/types/notification.ts";
import { formatDateTimeUTC } from "#/lib/format";
import { cn } from "#/lib/utils.ts";

interface NotificationRowProps {
	notification: NotificationRecord;
	onMarkRead: (id: string) => void;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}

export function NotificationRow({
	notification,
	onMarkRead,
	onDelete,
	isDeleting,
}: NotificationRowProps) {
	const isUnread = !notification.read_at;

	return (
		<div
			className={cn(
				"group relative flex items-start gap-4 px-5 py-4 transition-colors",
				isUnread
					? "bg-primary/[0.03] hover:bg-primary/[0.06]"
					: "hover:bg-muted/40",
			)}
		>
			<div className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
				{isUnread ? (
					<span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
				) : (
					<span className="h-2 w-2 rounded-full bg-muted-foreground/20" />
				)}
			</div>

			<div className="min-w-0 flex-1 space-y-1.5">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<h3
								className={cn(
									"truncate text-sm tracking-tight",
									isUnread
										? "font-semibold text-foreground"
										: "font-medium text-foreground/85",
								)}
							>
								{notification.data.subject}
							</h3>
							{isUnread && (
								<Badge
									variant="default"
									className="h-4 px-1.5 text-[10px] font-semibold uppercase tracking-wider"
								>
									New
								</Badge>
							)}
						</div>
					</div>

					<time
						dateTime={notification.created_at}
						className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"
					>
						{notification.created_at
							? formatDateTimeUTC(notification.created_at, false)
							: ""}
					</time>
				</div>

				<p className="text-sm leading-relaxed text-muted-foreground">
					{notification.data.description}
				</p>

				<div className="flex items-center justify-between pt-1">
					<div className="flex items-center gap-3 text-xs text-muted-foreground/80">
						{notification.data.notified_from?.full_name && (
							<span className="flex items-center gap-1.5 font-medium">
								<User className="h-3.5 w-3.5 text-muted-foreground" />
								{notification.data.notified_from.full_name}
							</span>
						)}
						{notification.read_at && (
							<span className="flex items-center gap-1 text-muted-foreground/60">
								<MailOpen className="h-3 w-3" />
								Read
							</span>
						)}
					</div>

					<div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
						{isUnread && (
							<Button
								variant="ghost"
								size="sm"
								className="h-7 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
								onClick={() => onMarkRead(notification.id)}
							>
								<Check className="mr-1 h-3.5 w-3.5" />
								Mark read
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							disabled={isDeleting}
							className="h-7 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
							onClick={() => onDelete(notification.id)}
							title="Delete notification"
						>
							{isDeleting ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Trash2 className="h-3.5 w-3.5" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

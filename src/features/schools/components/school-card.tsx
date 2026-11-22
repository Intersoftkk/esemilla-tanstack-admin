import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Check,
	Copy,
	ExternalLink,
	Globe,
	MoreHorizontal,
	PauseCircle,
	PlayCircle,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "#/components/ui/card.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { SchoolStatusBadge } from "#/features/schools/components/school-status-badge.tsx";
import {
	getSchoolTypeMeta,
	SCHOOL_STATUS_META,
} from "#/features/schools/config/school.config.ts";
import type {
	School,
	SchoolStatus,
} from "#/features/schools/types/school.types.ts";
import {
	copyToClipboard,
	formatCompactNumber,
	portalHost,
	portalUrl,
	schoolGradient,
	schoolInitials,
} from "#/features/schools/utils/school.utils.ts";

interface SchoolCardProps {
	school: School;
	onUpdateStatus: (school: School, status: SchoolStatus) => void;
	onDelete: (school: School) => void;
}

export function SchoolCard({
	school,
	onUpdateStatus,
	onDelete,
}: SchoolCardProps) {
	const [copied, setCopied] = useState(false);
	const statusMeta = SCHOOL_STATUS_META[school.status];
	const typeMeta = getSchoolTypeMeta(school.type);
	const host = portalHost(school);
	const url = portalUrl(school);

	const handleCopy = async () => {
		if (!url) return;
		const ok = await copyToClipboard(url);
		if (ok) {
			setCopied(true);
			toast.success("Portal URL copied");
			setTimeout(() => setCopied(false), 1800);
		}
	};

	return (
		<Card className="flex flex-col overflow-hidden shadow-xs">
			<div
				className={`h-1.5 w-full bg-gradient-to-r ${statusMeta.accentClassName}`}
			/>

			<CardHeader className="gap-3 pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 items-center gap-3">
						<div
							className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white shadow-xs ${schoolGradient(school.name)}`}
						>
							{schoolInitials(school.name)}
						</div>
						<div className="min-w-0">
							<Link
								to="/schools/$schoolId"
								params={{ schoolId: school.id }}
								className="block truncate text-sm font-semibold text-foreground hover:text-primary hover:underline"
							>
								{school.name}
							</Link>
							<p className="truncate text-[11px] text-muted-foreground">
								{typeMeta.label} ·{" "}
								{school.address.city || school.address.country || "Global"}
							</p>
						</div>
					</div>

					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link to="/schools/$schoolId" params={{ schoolId: school.id }}>
									Manage school
								</Link>
							</DropdownMenuItem>
							{school.status !== "active" && (
								<DropdownMenuItem
									onClick={() => onUpdateStatus(school, "active")}
								>
									<PlayCircle className="mr-2 h-3.5 w-3.5 text-emerald-600" />
									Activate portal
								</DropdownMenuItem>
							)}
							{school.status === "active" && (
								<DropdownMenuItem
									onClick={() => onUpdateStatus(school, "suspended")}
								>
									<PauseCircle className="mr-2 h-3.5 w-3.5 text-amber-600" />
									Suspend portal
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onDelete(school)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 h-3.5 w-3.5" />
								Delete workspace
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					<SchoolStatusBadge status={school.status} />
					{school.plan && (
						<Badge variant="secondary" className="text-[11px]">
							{school.plan.name}
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="flex-1 space-y-3 text-xs">
				{host && url && (
					<div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/20 px-2.5 py-2">
						<span className="flex min-w-0 items-center gap-1.5 truncate text-muted-foreground">
							<Globe className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">{host}</span>
						</span>
						<div className="flex shrink-0 items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() => void handleCopy()}
								title="Copy portal URL"
							>
								{copied ? (
									<Check className="h-3 w-3 text-emerald-500" />
								) : (
									<Copy className="h-3 w-3" />
								)}
							</Button>
							<a
								href={url}
								target="_blank"
								rel="noreferrer"
								className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
								title="Open portal"
							>
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
					</div>
				)}

				<div className="grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-center">
					<div>
						<p className="font-semibold tabular-nums">
							{formatCompactNumber(school.usage.students)}
						</p>
						<p className="text-[10px] text-muted-foreground">Students</p>
					</div>
					<div>
						<p className="font-semibold tabular-nums">
							{formatCompactNumber(school.usage.staff)}
						</p>
						<p className="text-[10px] text-muted-foreground">Staff</p>
					</div>
					<div>
						<p className="font-semibold tabular-nums">
							{school.usage.branches}
						</p>
						<p className="text-[10px] text-muted-foreground">Campuses</p>
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t pt-3">
				<Button asChild variant="outline" size="sm" className="w-full">
					<Link to="/schools/$schoolId" params={{ schoolId: school.id }}>
						Open workspace
						<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

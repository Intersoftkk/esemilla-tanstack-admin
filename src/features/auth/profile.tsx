import { Link } from "@tanstack/react-router";
import {
	KeyRound,
	MailCheck,
	MailWarning,
	Settings,
	ShieldCheck,
	UserRound,
} from "lucide-react";

import { PageHeader } from "#/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { usePermission } from "#/features/auth/hooks/use-permission";
import { initials } from "#/lib/format";
import { cn } from "#/lib/utils";

export function ProfilePage() {
	const { user = null, roles, permissions } = usePermission();

	if (!user) {
		return (
			<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card px-4 py-14 text-center">
				<p className="text-sm font-semibold">You're signed out</p>
				<p className="max-w-md text-[11px] text-muted-foreground">
					Sign in again to view your profile.
				</p>
				<Button asChild size="sm">
					<Link to="/sign-in">Sign in</Link>
				</Button>
			</div>
		);
	}

	const emailVerified = Boolean(user.emailVerifiedAt);

	return (
		<div className="flex flex-col gap-4 sm:gap-5">
			<PageHeader
				title="Profile"
				description="Your identity across the portal."
				icon={UserRound}
				actions={
					<div className="flex items-center gap-1.5">
						<Button asChild variant="outline" size="sm" className="gap-1.5">
							<Link to="/settings">
								<Settings className="size-3.5" />
								Settings
							</Link>
						</Button>
						<Button asChild size="sm" className="gap-1.5">
							<Link to="/profile/change-password">
								<KeyRound className="size-3.5" />
								Change password
							</Link>
						</Button>
					</div>
				}
			/>

			<section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
				<Avatar className="size-16">
					{user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
					<AvatarFallback className="text-lg font-semibold">
						{initials(user.name)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h2 className="truncate text-base font-semibold">{user.name}</h2>
						<Badge
							variant="outline"
							className={cn(
								emailVerified
									? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
									: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
							)}
						>
							{emailVerified ? (
								<MailCheck className="mr-1 size-3" />
							) : (
								<MailWarning className="mr-1 size-3" />
							)}
							{emailVerified ? "Email verified" : "Email unverified"}
						</Badge>
					</div>
					<p className="mt-0.5 truncate text-xs text-muted-foreground">
						{user.email}
					</p>
				</div>
			</section>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<section className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
					<h2 className="text-sm font-semibold">Contact</h2>
					<dl className="mt-3 grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
						<div className="rounded-xl border border-border/60 p-2.5">
							<dt className="text-muted-foreground">Email</dt>
							<dd className="mt-0.5 truncate font-semibold">{user.email}</dd>
						</div>
						<div className="rounded-xl border border-border/60 p-2.5">
							<dt className="text-muted-foreground">Mobile</dt>
							<dd className="mt-0.5 font-semibold">{user.mobile ?? "—"}</dd>
						</div>
						<div className="rounded-xl border border-border/60 p-2.5">
							<dt className="text-muted-foreground">Two-factor auth</dt>
							<dd className="mt-0.5 font-semibold">
								{user.twoFactorEnabled ? "On" : "Off"}
							</dd>
						</div>
						<div className="rounded-xl border border-border/60 p-2.5">
							<dt className="text-muted-foreground">Mobile verified</dt>
							<dd className="mt-0.5 font-semibold">
								{user.mobileVerifiedAt ? "Yes" : "No"}
							</dd>
						</div>
					</dl>
				</section>

				<section className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
					<div className="flex items-center gap-2">
						<ShieldCheck className="size-4 text-muted-foreground" />
						<h2 className="text-sm font-semibold">Roles & access</h2>
					</div>

					{roles.length > 0 ? (
						<div className="mt-3 flex flex-wrap gap-1.5">
							{roles.map((role) => (
								<Badge key={role.id} variant="secondary">
									{role.name}
								</Badge>
							))}
						</div>
					) : (
						<p className="mt-3 text-[11px] text-muted-foreground">
							No roles assigned.
						</p>
					)}

					<p className="mt-3 text-[11px] text-muted-foreground">
						{permissions.length}{" "}
						{permissions.length === 1 ? "permission" : "permissions"} granted
						across the portal.
					</p>
				</section>
			</div>
		</div>
	);
}

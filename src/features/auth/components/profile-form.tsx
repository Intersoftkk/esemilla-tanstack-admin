import { Link } from "@tanstack/react-router";
import { ArrowRight, MailCheck, MailWarning } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import type { User } from "#/features/auth/types/user.type";
import { initials } from "#/lib/format";

/**
 * Profile summary shown on the settings page. Rendered read-only: profile
 * editing lives behind the account API, so changes go through support until
 * a self-service endpoint is available.
 */
export function ProfileForm({ profile }: { profile: User }) {
	const emailVerified = Boolean(profile.emailVerifiedAt);
	const roles = profile.roles ?? [];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<Avatar className="size-11">
					{profile.avatar && (
						<AvatarImage src={profile.avatar} alt={profile.name} />
					)}
					<AvatarFallback className="font-semibold">
						{initials(profile.name)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0">
					<p className="truncate text-sm font-semibold">{profile.name}</p>
					<p className="truncate text-[11px] text-muted-foreground">
						{profile.email}
					</p>
				</div>

				<Badge
					variant="outline"
					className={
						emailVerified
							? "ml-auto shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
							: "ml-auto shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
					}
				>
					{emailVerified ? (
						<MailCheck className="mr-1 size-3" />
					) : (
						<MailWarning className="mr-1 size-3" />
					)}
					{emailVerified ? "Verified" : "Unverified"}
				</Badge>
			</div>

			<dl className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
				<div className="rounded-xl border border-border/60 p-2.5">
					<dt className="text-muted-foreground">Mobile</dt>
					<dd className="mt-0.5 font-semibold">{profile.mobile ?? "—"}</dd>
				</div>
				<div className="rounded-xl border border-border/60 p-2.5">
					<dt className="text-muted-foreground">Two-factor auth</dt>
					<dd className="mt-0.5 font-semibold">
						{profile.twoFactorEnabled ? "On" : "Off"}
					</dd>
				</div>
			</dl>

			{roles.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{roles.map((role) => (
						<Badge key={role.id} variant="secondary" className="text-[10px]">
							{role.name}
						</Badge>
					))}
				</div>
			)}

			<div className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 p-2.5 text-[10px] text-muted-foreground">
				<p>Need to update these details? Contact support.</p>
				<Link
					to="/profile"
					className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary hover:underline"
				>
					View profile
					<ArrowRight className="size-3" />
				</Link>
			</div>
		</div>
	);
}

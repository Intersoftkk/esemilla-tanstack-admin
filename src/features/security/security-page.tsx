// #/features/security/security-page.tsx
import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	CheckCircle2,
	KeyRound,
	Lock,
	ShieldCheck,
	Users,
} from "lucide-react";

import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	authPolicies,
	complianceItems,
	type EventSeverity,
	type SecurityTone,
	securityEvents,
	securityKpis,
	ssoProviders,
} from "#/features/security/data/security.data.ts";
import { cn } from "#/lib/utils";

const toneClasses: Record<SecurityTone, string> = {
	positive: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
	warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
	negative: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
	neutral: "bg-muted text-muted-foreground",
};

const severityClasses: Record<EventSeverity, string> = {
	info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
	warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
	critical: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

const kpiIcons = {
	mfa: KeyRound,
	sessions: Users,
	failed: Lock,
	incidents: AlertTriangle,
} as const;

/** Small coloured status pill. */
function StatusPill({ label, tone }: { label: string; tone: SecurityTone }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
				toneClasses[tone],
			)}
		>
			<span className="h-1.5 w-1.5 rounded-full bg-current" />
			{label}
		</span>
	);
}

/** Headline security numbers. */
function SecurityStats() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{securityKpis.map((kpi) => {
				const Icon = kpiIcons[kpi.id];

				return (
					<Card key={kpi.id} className="gap-3">
						<CardHeader>
							<p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
								{kpi.label}
							</p>
							<CardAction>
								<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
									<Icon className="h-4 w-4" />
								</span>
							</CardAction>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
								{kpi.value}
							</p>
							<p className="text-xs text-muted-foreground">{kpi.hint}</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

function AuthPolicyCard() {
	return (
		<Card className="col-span-12 xl:col-span-7">
			<CardHeader>
				<CardTitle>Authentication policies</CardTitle>
				<CardDescription>
					Rules applied to every platform user and owner account.
				</CardDescription>
			</CardHeader>
			<CardContent className="divide-y divide-border">
				{authPolicies.map((policy) => (
					<div
						key={policy.id}
						className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
					>
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">
								{policy.label}
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								{policy.detail}
							</p>
						</div>
						<StatusPill label={policy.state} tone={policy.tone} />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

function SsoCard() {
	return (
		<Card className="col-span-12 xl:col-span-5">
			<CardHeader>
				<CardTitle>Single sign-on</CardTitle>
				<CardDescription>
					Identity providers linked to the platform.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{ssoProviders.map((provider) => {
					const connected = provider.status === "connected";

					return (
						<div
							key={provider.id}
							className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5"
						>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-foreground">
									{provider.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{provider.protocol} · {provider.accounts}
								</p>
							</div>
							<Badge variant={connected ? "secondary" : "outline"}>
								{connected ? "Connected" : "Available"}
							</Badge>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}

function SecurityEventsCard() {
	return (
		<Card className="col-span-12 xl:col-span-8">
			<CardHeader>
				<CardTitle>Recent security events</CardTitle>
				<CardDescription>
					Sign-in, permission and impersonation activity.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-hidden rounded-lg border border-border/70">
					<table className="w-full text-left text-sm">
						<thead className="bg-muted/50 text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
							<tr>
								<th className="px-3 py-2 font-semibold">Event</th>
								<th className="px-3 py-2 font-semibold">Actor</th>
								<th className="hidden px-3 py-2 font-semibold sm:table-cell">
									IP
								</th>
								<th className="px-3 py-2 font-semibold">When</th>
								<th className="px-3 py-2 font-semibold">Severity</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{securityEvents.map((event) => (
								<tr key={event.id} className="align-top">
									<td className="px-3 py-2.5 text-foreground">
										{event.action}
									</td>
									<td className="px-3 py-2.5 text-muted-foreground">
										{event.actor}
									</td>
									<td className="hidden px-3 py-2.5 font-mono text-xs text-muted-foreground sm:table-cell">
										{event.ip}
									</td>
									<td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground tabular-nums">
										{event.time}
									</td>
									<td className="px-3 py-2.5">
										<span
											className={cn(
												"inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
												severityClasses[event.severity],
											)}
										>
											{event.severity}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}

function ComplianceCard() {
	return (
		<Card className="col-span-12 xl:col-span-4">
			<CardHeader>
				<CardTitle>Compliance</CardTitle>
				<CardDescription>Evidence and control coverage.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{complianceItems.map((item) => (
					<div key={item.id} className="space-y-1.5">
						<div className="flex items-center justify-between gap-2">
							<p className="text-sm font-medium text-foreground">
								{item.framework}
							</p>
							<span className="flex items-center gap-1 text-xs font-medium text-muted-foreground tabular-nums">
								<CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
								{item.coverage}%
							</span>
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary"
								style={{ width: `${item.coverage}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">{item.detail}</p>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

/** Platform security posture: auth policies, SSO, audit trail and compliance. */
export function SecurityPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Security"
				description="Authentication policies, SSO providers and the audit trail."
				icon={ShieldCheck}
				iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
				badge={
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
						<span className="h-1.5 w-1.5 rounded-full bg-current" />
						Posture: strong
					</span>
				}
				actions={
					<>
						<Button variant="outline" size="sm" asChild>
							<Link
								to="/users"
								search={{
									search: "",
									pageIndex: 1,
									pageSize: 10,
									created_by_ids: [],
									status: [],
								}}
							>
								Review access
							</Link>
						</Button>
						<Button size="sm" asChild>
							<Link
								to="/role-permissions"
								search={{
									search: "",
									pageIndex: 1,
									pageSize: 10,
									created_by_ids: [],
									status: [],
								}}
							>
								Manage roles
							</Link>
						</Button>
					</>
				}
			/>

			<SecurityStats />

			<div className="grid grid-cols-12 gap-4">
				<AuthPolicyCard />
				<SsoCard />
				<SecurityEventsCard />
				<ComplianceCard />
			</div>
		</div>
	);
}

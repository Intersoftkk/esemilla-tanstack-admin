// #/features/home/index.tsx
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ArrowRight,
	Check,
	GraduationCap,
	LogOut,
	ShieldCheck,
} from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { APP_CONFIG } from "#/config/app.config.ts";
import { usePermission } from "#/features/auth/hooks/use-permission";
import { signOutFn } from "#/features/auth/server/auth.functions";
import {
	accessRoles,
	consoleModules,
	deskSteps,
	platformStats,
} from "#/features/home/data/home.data.ts";
import { cn } from "#/lib/utils";

const navLinks = [
	{ label: "Modules", href: "#modules" },
	{ label: "Desk workflow", href: "#workflow" },
	{ label: "Access", href: "#access" },
];

const ticketPreview = [
	{
		id: "TCK-4821",
		school: "Oakridge Academy",
		subject: "Invoice 2041 charged twice",
		priority: "urgent",
		state: "open",
	},
	{
		id: "TCK-4820",
		school: "Bright Future School",
		subject: "Cannot export attendance report",
		priority: "high",
		state: "pending",
	},
	{
		id: "TCK-4818",
		school: "Greenfield College",
		subject: "Add a second campus to our plan",
		priority: "normal",
		state: "open",
	},
];

const priorityClasses: Record<string, string> = {
	urgent: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
	high: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
	normal: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
};

const stateClasses: Record<string, string> = {
	open: "bg-primary/10 text-primary",
	pending: "bg-muted text-muted-foreground",
};

/**
 * Landing page for the platform admin console: what the workspace contains,
 * how the support desk runs, and who can reach what.
 */
export default function HomePage() {
	const { user } = usePermission();
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();
	const signOut = useServerFn(signOutFn);

	const handleLogout = async () => {
		try {
			await signOut();
		} finally {
			queryClient.setQueryData(["auth", "session"], null);
			await router.invalidate();
			await navigate({ to: "/" });
		}
	};

	return (
		<div className="min-h-dvh bg-background">
			<header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
				<div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
					<Link
						to="/"
						className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
					>
						<span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
							<GraduationCap className="size-4.5" aria-hidden="true" />
						</span>
						<span className="flex flex-col leading-tight">
							<span className="text-base font-semibold tracking-tight">
								{APP_CONFIG.name}
							</span>
							<span className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
								Platform admin
							</span>
						</span>
					</Link>

					<nav
						className="hidden items-center gap-1 md:flex"
						aria-label="Main navigation"
					>
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								{link.label}
							</a>
						))}
						<a
							href={APP_CONFIG.links.docs}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							Runbook
						</a>
					</nav>

					<div className="ms-auto flex items-center gap-2">
						{user ? (
							<>
								<Button variant="ghost" size="sm" onClick={handleLogout}>
									<LogOut className="size-3.5" aria-hidden="true" />
									Log out
								</Button>
								<Button size="sm" asChild>
									<Link to="/dashboard">Open console</Link>
								</Button>
							</>
						) : (
							<>
								<Button variant="ghost" size="sm" asChild>
									<a href={APP_CONFIG.links.support}>Contact platform team</a>
								</Button>
								<Button size="sm" asChild>
									<Link to="/sign-in">
										Sign in
										<ArrowRight className="size-3.5" aria-hidden="true" />
									</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</header>

			<main>
				{/* Hero */}
				<section className="relative overflow-hidden">
					<div
						className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_55%),radial-gradient(ellipse_at_85%_10%,rgba(56,189,248,0.12),transparent_45%)]"
						aria-hidden="true"
					/>
					<div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:py-24">
						<div>
							<span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
								<span className="size-1.5 rounded-full bg-emerald-500" />
								Internal workspace · platform team
							</span>

							<h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.2rem] lg:leading-[1.07]">
								The console behind every Esemilla school
							</h1>
							<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
								Tenants, subscriptions, invoices and the support queue in one
								workspace — with an audit trail behind every administrative
								change.
							</p>

							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<Button size="lg" asChild>
									<Link to={user ? "/dashboard" : "/sign-in"}>
										{user ? "Open console" : "Sign in to the console"}
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<a
										href={APP_CONFIG.links.docs}
										target="_blank"
										rel="noreferrer"
									>
										Read the runbook
									</a>
								</Button>
							</div>

							<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
								<span className="inline-flex items-center gap-1.5">
									<ShieldCheck
										className="size-4 text-primary"
										aria-hidden="true"
									/>
									Role-based access
								</span>
								<span className="inline-flex items-center gap-1.5">
									<Check
										className="size-4 text-emerald-600 dark:text-emerald-400"
										aria-hidden="true"
									/>
									Full audit trail
								</span>
								<span className="inline-flex items-center gap-1.5">
									<Check
										className="size-4 text-emerald-600 dark:text-emerald-400"
										aria-hidden="true"
									/>
									Support SLAs tracked
								</span>
							</div>
						</div>

						{/* Support queue preview */}
						<div className="relative">
							<div
								className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-primary/10 via-transparent to-sky-400/10 blur-2xl"
								aria-hidden="true"
							/>
							<div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xl shadow-slate-900/5 sm:p-5">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-sm font-semibold text-foreground">
											Support queue
										</p>
										<p className="text-[11px] text-muted-foreground">
											3 tickets need attention
										</p>
									</div>
									<span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
										1 breaching SLA
									</span>
								</div>

								<ul className="mt-4 space-y-2">
									{ticketPreview.map((ticket) => (
										<li
											key={ticket.id}
											className="rounded-xl border border-border/60 bg-muted/20 p-3"
										>
											<div className="flex items-center justify-between gap-2">
												<span className="font-mono text-[11px] text-muted-foreground">
													{ticket.id}
												</span>
												<span
													className={cn(
														"rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
														priorityClasses[ticket.priority],
													)}
												>
													{ticket.priority}
												</span>
											</div>
											<p className="mt-1 truncate text-sm font-medium text-foreground">
												{ticket.subject}
											</p>
											<div className="mt-1.5 flex items-center justify-between gap-2">
												<span className="truncate text-[11px] text-muted-foreground">
													{ticket.school}
												</span>
												<span
													className={cn(
														"rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
														stateClasses[ticket.state],
													)}
												>
													{ticket.state}
												</span>
											</div>
										</li>
									))}
								</ul>

								<div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-border/70 px-3 py-2 text-[11px] text-muted-foreground">
									<span>Avg. first response</span>
									<span className="font-semibold text-foreground tabular-nums">
										1h 42m
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Platform numbers */}
				<section className="border-y border-border/60 bg-muted/30">
					<div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
						{platformStats.map((stat) => (
							<div key={stat.id}>
								<p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
									{stat.value}
								</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Modules */}
				<section
					id="modules"
					className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
				>
					<div className="max-w-2xl">
						<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							What lives in the console
						</h2>
						<p className="mt-3 text-muted-foreground">
							Eight modules cover the whole platform lifecycle — from onboarding
							a school to closing its last ticket.
						</p>
					</div>

					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{consoleModules.map((module) => (
							<div
								key={module.id}
								className="rounded-2xl border border-border/70 bg-card p-5 transition-shadow hover:shadow-md"
							>
								<span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
									<module.icon className="size-4.5" aria-hidden="true" />
								</span>
								<h3 className="mt-4 text-sm font-semibold text-foreground">
									{module.title}
								</h3>
								<p className="mt-1.5 text-sm leading-6 text-muted-foreground">
									{module.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Support workflow */}
				<section
					id="workflow"
					className="border-y border-border/60 bg-muted/30"
				>
					<div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
						<div className="max-w-2xl">
							<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
								A day on the platform desk
							</h2>
							<p className="mt-3 text-muted-foreground">
								The support queue is the front door of the platform. It is built
								so the whole team can work it without stepping on each other.
							</p>
						</div>

						<div className="mt-10 grid gap-4 md:grid-cols-3">
							{deskSteps.map((step, index) => (
								<div
									key={step.id}
									className="rounded-2xl border border-border/70 bg-card p-5"
								>
									<span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground tabular-nums">
										{index + 1}
									</span>
									<h3 className="mt-4 text-sm font-semibold text-foreground">
										{step.title}
									</h3>
									<p className="mt-1.5 text-sm leading-6 text-muted-foreground">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Access */}
				<section
					id="access"
					className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
				>
					<div className="max-w-2xl">
						<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							Three roles, one console
						</h2>
						<p className="mt-3 text-muted-foreground">
							Access is granted per module through role permissions, so support
							agents never need billing keys and finance never needs the desk.
						</p>
					</div>

					<div className="mt-10 grid gap-4 md:grid-cols-3">
						{accessRoles.map((role) => (
							<div
								key={role.id}
								className="flex flex-col rounded-2xl border border-border/70 bg-card p-5"
							>
								<div className="flex items-center justify-between gap-2">
									<h3 className="text-sm font-semibold text-foreground">
										{role.name}
									</h3>
									<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
										{role.scope}
									</span>
								</div>
								<ul className="mt-4 space-y-2">
									{role.can.map((ability) => (
										<li
											key={ability}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											<Check
												className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
												aria-hidden="true"
											/>
											{ability}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>

				{/* Closing CTA */}
				<section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
					<div className="relative overflow-hidden rounded-3xl border border-border/70 bg-slate-950 px-6 py-12 text-center sm:px-12">
						<div
							className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(ellipse_at_85%_100%,rgba(14,165,233,0.28),transparent_45%)]"
							aria-hidden="true"
						/>
						<div className="relative">
							<h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
								Sign in with your platform account
							</h2>
							<p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
								Console access is provisioned by the platform team. If you need
								a role or your permissions changed, ask in the support channel.
							</p>
							<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
								<Button size="lg" asChild>
									<Link to={user ? "/dashboard" : "/sign-in"}>
										{user ? "Open console" : "Sign in"}
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
									asChild
								>
									<a href={APP_CONFIG.links.support}>Request access</a>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-border/60">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<div className="flex items-center gap-2.5">
						<span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<GraduationCap className="size-3.5" aria-hidden="true" />
						</span>
						<span>
							{APP_CONFIG.name} Platform Admin · {APP_CONFIG.copyright}
						</span>
					</div>
					<nav
						className="flex flex-wrap items-center gap-4"
						aria-label="Footer"
					>
						<a className="hover:text-foreground" href={APP_CONFIG.links.docs}>
							Runbook
						</a>
						<a
							className="hover:text-foreground"
							href={APP_CONFIG.links.changelog}
						>
							Changelog
						</a>
						<a
							className="hover:text-foreground"
							href={APP_CONFIG.links.support}
						>
							Support
						</a>
						<Link className="hover:text-foreground" to="/sign-in">
							Sign in
						</Link>
					</nav>
				</div>
			</footer>
		</div>
	);
}

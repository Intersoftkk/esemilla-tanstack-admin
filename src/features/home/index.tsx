// #/features/home/index.tsx
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	ArrowRight,
	Check,
	GraduationCap,
	LogOut,
	Sparkles,
} from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { APP_CONFIG } from "#/config/app.config.ts";
import { usePermission } from "#/features/auth/hooks/use-permission";
import { signOutFn } from "#/features/auth/server/auth.functions";
import {
	homeFeatures,
	homeHighlights,
	homePlans,
	homeStats,
	homeSteps,
} from "#/features/home/data/home.data.ts";
import { cn } from "#/lib/utils";

const collectionBars = [46, 58, 52, 71, 64, 82, 76, 91] as const;

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Pricing", href: "#pricing" },
];

/** Marketing landing page for the platform. */
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
						<span className="text-base font-semibold tracking-tight">
							{APP_CONFIG.name}
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
							Docs
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
									<Link to="/dashboard">Open dashboard</Link>
								</Button>
							</>
						) : (
							<>
								<Button variant="ghost" size="sm" asChild>
									<Link to="/sign-in">Sign in</Link>
								</Button>
								<Button size="sm" asChild>
									<Link to="/sign-up">
										{APP_CONFIG.cta.primary}
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
					<div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:py-24">
						<div>
							<span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
								<Sparkles
									className="size-3.5 text-primary"
									aria-hidden="true"
								/>
								{APP_CONFIG.tagline}
							</span>

							<h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.35rem] lg:leading-[1.06]">
								{APP_CONFIG.headline}
							</h1>
							<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
								{APP_CONFIG.subheadline}
							</p>

							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<Button size="lg" asChild>
									<Link to={user ? "/dashboard" : "/sign-up"}>
										{user ? "Open dashboard" : APP_CONFIG.cta.primary}
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<Link to="/sign-in">{APP_CONFIG.cta.login}</Link>
								</Button>
							</div>

							<ul className="mt-8 flex flex-col gap-2">
								{homeHighlights.map((highlight) => (
									<li
										key={highlight.label}
										className="flex items-center gap-2 text-sm text-muted-foreground"
									>
										<highlight.icon
											className="size-4 text-primary"
											aria-hidden="true"
										/>
										{highlight.label}
									</li>
								))}
							</ul>
						</div>

						{/* Product preview */}
						<div className="relative">
							<div
								className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-primary/10 via-transparent to-sky-400/10 blur-2xl"
								aria-hidden="true"
							/>
							<div className="rounded-2xl border border-border/70 bg-card p-4 shadow-xl shadow-slate-900/5 sm:p-5">
								<div className="flex items-center gap-1.5">
									<span className="size-2 rounded-full bg-rose-400" />
									<span className="size-2 rounded-full bg-amber-400" />
									<span className="size-2 rounded-full bg-emerald-400" />
									<span className="ms-2 text-[11px] text-muted-foreground">
										esemilla.com/dashboard
									</span>
								</div>

								<div className="mt-4 grid grid-cols-2 gap-3">
									{[
										{ label: "Active students", value: "1,284" },
										{ label: "Fees collected", value: "92.4%" },
										{ label: "Attendance today", value: "96.1%" },
										{ label: "Open invoices", value: "38" },
									].map((kpi) => (
										<div
											key={kpi.label}
											className="rounded-xl border border-border/60 bg-muted/30 p-3"
										>
											<p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
												{kpi.label}
											</p>
											<p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
												{kpi.value}
											</p>
										</div>
									))}
								</div>

								<div className="mt-4 rounded-xl border border-border/60 p-3">
									<p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
										Fee collection by term
									</p>
									<div className="mt-3 flex h-24 items-end gap-2">
										{collectionBars.map((height) => (
											<div
												key={height}
												className="flex-1 rounded-t-md bg-primary/80"
												style={{ height: `${height}%` }}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Stats */}
				<section className="border-y border-border/60 bg-muted/30">
					<div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
						{homeStats.map((stat) => (
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

				{/* Features */}
				<section
					id="features"
					className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
				>
					<div className="max-w-2xl">
						<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							Everything a school runs on, in one place
						</h2>
						<p className="mt-3 text-muted-foreground">
							Stop stitching together spreadsheets, WhatsApp groups and a fees
							ledger. Each module below is included in the platform.
						</p>
					</div>

					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{homeFeatures.map((feature) => (
							<div
								key={feature.id}
								className="rounded-2xl border border-border/70 bg-card p-5 transition-shadow hover:shadow-md"
							>
								<span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
									<feature.icon className="size-4.5" aria-hidden="true" />
								</span>
								<h3 className="mt-4 text-sm font-semibold text-foreground">
									{feature.title}
								</h3>
								<p className="mt-1.5 text-sm leading-6 text-muted-foreground">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* How it works */}
				<section
					id="how-it-works"
					className="border-y border-border/60 bg-muted/30"
				>
					<div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
						<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							Live in three steps
						</h2>
						<div className="mt-10 grid gap-4 md:grid-cols-3">
							{homeSteps.map((step, index) => (
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

				{/* Pricing */}
				<section
					id="pricing"
					className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
				>
					<div className="max-w-2xl">
						<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
							Pricing that scales with enrolment
						</h2>
						<p className="mt-3 text-muted-foreground">
							Every plan includes the full platform — you only pay for the
							students you actually manage.
						</p>
					</div>

					<div className="mt-10 grid gap-4 lg:grid-cols-3">
						{homePlans.map((plan) => (
							<div
								key={plan.id}
								className={cn(
									"flex flex-col rounded-2xl border bg-card p-6",
									plan.featured
										? "border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
										: "border-border/70",
								)}
							>
								<div className="flex items-center justify-between gap-2">
									<h3 className="text-sm font-semibold text-foreground">
										{plan.name}
									</h3>
									{plan.featured ? (
										<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
											Most popular
										</span>
									) : null}
								</div>
								<p className="mt-4 flex items-baseline gap-1">
									<span className="text-3xl font-semibold tracking-tight tabular-nums">
										{plan.price}
									</span>
									<span className="text-xs text-muted-foreground">
										{plan.cadence}
									</span>
								</p>
								<p className="mt-2 text-sm text-muted-foreground">
									{plan.blurb}
								</p>

								<ul className="mt-5 space-y-2">
									{plan.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											<Check
												className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
												aria-hidden="true"
											/>
											{feature}
										</li>
									))}
								</ul>

								<Button
									className="mt-6 w-full"
									variant={plan.featured ? "default" : "outline"}
									asChild
								>
									<Link to={user ? "/dashboard" : "/sign-up"}>
										{plan.id === "enterprise"
											? APP_CONFIG.cta.secondary
											: APP_CONFIG.cta.primary}
									</Link>
								</Button>
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
								Ready to run your school from one platform?
							</h2>
							<p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
								Start a 30-day trial with your real classes and students. No
								card, no migration fees, cancel whenever.
							</p>
							<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
								<Button size="lg" asChild>
									<Link to={user ? "/dashboard" : "/sign-up"}>
										{user ? "Open dashboard" : APP_CONFIG.cta.primary}
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
									asChild
								>
									<a href={APP_CONFIG.links.support}>
										{APP_CONFIG.cta.secondary}
									</a>
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
							{APP_CONFIG.name} · {APP_CONFIG.copyright}
						</span>
					</div>
					<nav
						className="flex flex-wrap items-center gap-4"
						aria-label="Footer"
					>
						<a className="hover:text-foreground" href={APP_CONFIG.links.docs}>
							Docs
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

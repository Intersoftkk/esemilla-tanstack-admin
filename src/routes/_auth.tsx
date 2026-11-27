import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { APP_CONFIG } from "#/config/app.config";

export const Route = createFileRoute("/_auth")({
	ssr: true,
	beforeLoad: ({ context }) => {
		if (context.user) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: GuestLayout,
});

function GuestLayout() {
	return (
		<main className="grid min-h-dvh bg-background xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
			<section className="relative flex min-h-dvh min-w-0 flex-col px-4 py-5 sm:px-8 sm:py-8 lg:px-12">
				<div
					className="pointer-events-none absolute inset-0 overflow-hidden xl:hidden"
					aria-hidden="true"
				>
					<div className="absolute -right-24 -top-24 size-64 rounded-full bg-primary/5 blur-3xl sm:size-80" />
					<div className="absolute -bottom-28 -left-24 size-64 rounded-full bg-indigo-500/5 blur-3xl" />
				</div>

				<header className="relative z-10 mx-auto flex w-full max-w-md items-center">
					<Link
						to="/"
						className="group inline-flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
						aria-label={`${APP_CONFIG.name} home`}
					>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3">
							<GraduationCap className="size-5" aria-hidden="true" />
						</span>
						<span className="min-w-0">
							<span className="block truncate text-base font-bold tracking-tight text-foreground">
								{APP_CONFIG.name}
							</span>
							<span className="hidden text-xs text-muted-foreground sm:block">
								{APP_CONFIG.tagline}
							</span>
						</span>
					</Link>
				</header>

				<div className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center py-8 sm:py-10">
					<div className="w-full rounded-2xl border border-border/70 bg-card/95 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-8">
						<Outlet />
					</div>
				</div>

				<footer className="relative z-10 mx-auto w-full max-w-md text-center text-[11px] text-muted-foreground">
					{APP_CONFIG.copyright}
				</footer>
			</section>

			<aside className="relative hidden min-h-dvh flex-col overflow-hidden bg-slate-950 px-10 py-10 text-slate-100 xl:flex 2xl:px-14 2xl:py-12">
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(99,102,241,0.32),transparent_42%),radial-gradient(ellipse_at_90%_85%,rgba(14,165,233,0.20),transparent_38%),linear-gradient(145deg,#0f172a_0%,#111827_48%,#020617_100%)]"
					aria-hidden="true"
				/>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
					aria-hidden="true"
				/>

				<div className="relative z-10 flex flex-1 items-center justify-center py-12">
					<div className="w-full max-w-2xl">
						<div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-200 shadow-sm backdrop-blur">
							<span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
							School operations, connected
						</div>
						<h1 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-white 2xl:text-5xl">
							{APP_CONFIG.headline}
						</h1>
						<p className="mt-5 max-w-xl text-base leading-7 text-slate-300 2xl:text-lg 2xl:leading-8">
							{APP_CONFIG.subheadline}
						</p>

						<div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
							{APP_CONFIG.features.slice(0, 4).map((feature) => (
								<div
									key={feature}
									className="flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-200 shadow-sm backdrop-blur-sm"
								>
									<span
										className="size-1.5 shrink-0 rounded-full bg-indigo-300"
										aria-hidden="true"
									/>
									<span>{feature}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<footer className="relative z-10 border-t border-white/10 pt-5 text-xs text-slate-400">
					{APP_CONFIG.copyright}
				</footer>
			</aside>
		</main>
	);
}

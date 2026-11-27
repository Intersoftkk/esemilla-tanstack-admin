// src/routes/__root.tsx

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type * as React from "react";
import { NavigationProgress } from "#/components/navigation-progress.tsx";
import { Toaster } from "#/components/ui/sonner.tsx";
import { getSessionFn } from "#/features/auth/server/auth.functions.ts";
import TanStackQueryDevtools from "#/integrations/tanstack-query/devtools";
import type { RouterContext } from "#/integrations/tanstack-query/root-provider.tsx";
import { getLocale } from "#/paraglide/runtime";
import appCss from "#/styles.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async ({ context }) => {
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}

		// Cache the session in the TanStack Query cache so that
		// navigating between pages does not re-trigger this API call on
		// every route change. It is reused until it becomes stale.
		const [user] = await Promise.all([
			context.queryClient.ensureQueryData({
				queryKey: ["auth", "session"],
				queryFn: () => getSessionFn().catch(() => null),
				staleTime: 1000 * 60 * 5,
			}),
		]);

		return { user };
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "eSemilla",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	errorComponent: ({ error }) => {
		const message =
			error instanceof Error ? error.message : "An unexpected error occurred";
		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
				<h1 className="text-2xl font-bold text-destructive">
					Application Error
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">{message}</p>
			</div>
		);
	},

	notFoundComponent: () => (
		<div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
			<h1 className="text-2xl font-bold">404 - Not Found</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				The page you are looking for does not exist.
			</p>
		</div>
	),

	component: RootComponent,
	shellComponent: RootDocument,
});

function RootComponent() {
	return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()}>
			<head>
				<HeadContent />
			</head>
			<body>
				<NavigationProgress />
				{children}
				<Toaster richColors closeButton position="top-right" />
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}

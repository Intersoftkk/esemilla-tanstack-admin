import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "#/features/dashboard/dashboard-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/dashboard")({
	head: () => pageHead("Dashboard"),
	component: DashboardPage,
});

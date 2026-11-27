import { createFileRoute } from "@tanstack/react-router";
import { FeatureUsagePage } from "#/features/feature-usage/feature-usage-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/feature-usage")({
	head: () =>
		pageHead("Feature Usage", "Consumption of each plan feature per tenant."),
	component: FeatureUsagePage,
});

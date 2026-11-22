import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "#/components/coming-soon";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/plans/")({
	head: () => pageHead("Plans"),
	component: PlansPage,
});

function PlansPage() {
	return (
		<ComingSoon
			title="Plans"
			description="Subscription plan management and pricing are coming soon."
		/>
	);
}

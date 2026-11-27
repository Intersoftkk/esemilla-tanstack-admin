// #/routes/_authed/subscriptions.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { subscriptionSearchSchema } from "#/features/subscriptions/schema/subscriptions-search.schema.ts";
import SubscriptionsPage from "#/features/subscriptions/subscriptions-page.tsx";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/subscriptions/")({
	head: () => pageHead("Subscriptions"),
	validateSearch: subscriptionSearchSchema,
	component: SubscriptionsRoute,
});

/** Route component for the subscriptions page. */
function SubscriptionsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <SubscriptionsPage search={search} navigate={navigate} />;
}

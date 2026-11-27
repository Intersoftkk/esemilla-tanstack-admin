// #/routes/_authed/plans.index.tsx
import { createFileRoute } from "@tanstack/react-router";

import PlansPage from "#/features/plans";
import { planSearchSchema } from "#/features/plans/schema/plans-search.schema.ts";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/plans/")({
	head: () => pageHead("Plans"),
	validateSearch: planSearchSchema,
	component: PlansRoute,
});

/** Route component for the plans page. */
function PlansRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <PlansPage search={search} navigate={navigate} />;
}

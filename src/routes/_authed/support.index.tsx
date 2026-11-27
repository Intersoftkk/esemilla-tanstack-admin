// #/routes/_authed/support.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { supportSearchSchema } from "#/features/support/schema/support-search.schema.ts";
import SupportPage from "#/features/support/support-page.tsx";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/support/")({
	head: () => pageHead("Support"),
	validateSearch: supportSearchSchema,
	component: SupportRoute,
});

/** Route component for the support page. */
function SupportRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <SupportPage search={search} navigate={navigate} />;
}

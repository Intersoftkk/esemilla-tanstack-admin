import { createFileRoute } from "@tanstack/react-router";
import { SchoolsPage } from "#/features/schools/schools-page.tsx";
import { schoolsSearchSchema } from "#/features/schools/schema/schools-search.schema.ts";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/schools")({
	head: () => pageHead("Schools"),
	validateSearch: schoolsSearchSchema,
	component: SchoolsRoute,
});

function SchoolsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	return (
		<SchoolsPage
			searchState={search}
			onSearchChange={(patch) =>
				void navigate({
					search: (prev) => ({ ...prev, ...patch }),
					replace: true,
				})
			}
		/>
	);
}

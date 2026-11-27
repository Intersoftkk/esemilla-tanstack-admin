// #/routes/_authed/invoices.tsx
import { createFileRoute } from "@tanstack/react-router";

import InvoicesPage from "#/features/invoices/invoices-page.tsx";
import { invoiceSearchSchema } from "#/features/invoices/schema/invoices-search.schema.ts";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/invoices")({
	head: () => pageHead("Invoices"),
	validateSearch: invoiceSearchSchema,
	component: InvoicesRoute,
});

/** Route component for the invoices page. */
function InvoicesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <InvoicesPage search={search} navigate={navigate} />;
}

// #/routes/_authed/payments.index.tsx
import { createFileRoute } from "@tanstack/react-router";

import PaymentsPage from "#/features/payments/payments-page.tsx";
import { paymentSearchSchema } from "#/features/payments/schema/payments-search.schema.ts";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/payments/")({
	head: () => pageHead("Payments"),
	validateSearch: paymentSearchSchema,
	component: PaymentsRoute,
});

/** Route component for the payments page. */
function PaymentsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <PaymentsPage search={search} navigate={navigate} />;
}

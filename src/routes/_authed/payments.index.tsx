import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "#/components/coming-soon";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/payments/")({
	head: () => pageHead("Payments"),
	component: PaymentsPage,
});

function PaymentsPage() {
	return (
		<ComingSoon
			title="Payments"
			description="Payment history and failed charge reporting are coming soon."
		/>
	);
}

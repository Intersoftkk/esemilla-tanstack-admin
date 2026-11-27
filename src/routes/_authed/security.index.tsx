import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "#/features/security/security-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/security/")({
	head: () =>
		pageHead("Security", "Authentication policies, SSO and audit trail"),
	component: SecurityPage,
});

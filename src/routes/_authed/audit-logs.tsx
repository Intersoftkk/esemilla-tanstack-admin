import { createFileRoute } from "@tanstack/react-router";
import { AuditLogsPage } from "#/features/audit-logs/audit-logs-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/audit-logs")({
	head: () =>
		pageHead("Audit Log", "Every platform action and who performed it."),
	component: AuditLogsPage,
});

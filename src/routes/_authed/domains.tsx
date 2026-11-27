import { createFileRoute } from "@tanstack/react-router";
import { DomainsPage } from "#/features/domains/domains-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/domains")({
	head: () => pageHead("Domains", "Custom hostnames attached to tenants."),
	component: DomainsPage,
});

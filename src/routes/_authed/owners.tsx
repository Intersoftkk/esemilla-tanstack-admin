import { createFileRoute } from "@tanstack/react-router";
import { OwnersPage } from "#/features/owners/owners-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/owners")({
	head: () =>
		pageHead("Owners", "Central owner profiles and the tenants they hold."),
	component: OwnersPage,
});

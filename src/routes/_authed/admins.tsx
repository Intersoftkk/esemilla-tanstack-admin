import { createFileRoute } from "@tanstack/react-router";
import { AdminsPage } from "#/features/admins/admins-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/admins")({
	head: () => pageHead("Admins", "Platform team members with console access."),
	component: AdminsPage,
});

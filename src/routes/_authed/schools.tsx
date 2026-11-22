import { createFileRoute } from "@tanstack/react-router";
import { SchoolsPage } from "#/features/schools/schools-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/schools")({
	head: () => pageHead("Schools"),
	component: SchoolsPage,
});

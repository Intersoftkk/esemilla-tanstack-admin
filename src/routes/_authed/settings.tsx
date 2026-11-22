import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "#/features/settings/settings-page.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/settings")({
	head: () => pageHead("Settings"),
	component: SettingsPage,
});

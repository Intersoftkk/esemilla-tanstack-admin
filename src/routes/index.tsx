import { createFileRoute } from "@tanstack/react-router";
import { APP_CONFIG } from "#/config/app.config.ts";
import HomePage from "#/features/home";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/")({
	head: () =>
		pageHead(
			APP_CONFIG.meta.title.split(" — ")[0] ?? "Home",
			APP_CONFIG.meta.description,
		),
	component: HomePage,
});

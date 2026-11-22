import { createFileRoute } from "@tanstack/react-router";

import { NotificationPage } from "#/features/notification/notification-page";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/notification/")({
	head: () => pageHead("Notifications"),
	component: NotificationPage,
});

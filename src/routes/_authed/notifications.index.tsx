// #/routes/_authed/notifications.index.tsx
import { createFileRoute } from "@tanstack/react-router";

import NotificationsPage from "#/features/notifications/notifications-page.tsx";
import { notificationSearchSchema } from "#/features/notifications/schema/notifications-search.schema.ts";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/notifications/")({
	head: () => pageHead("Notifications"),
	validateSearch: notificationSearchSchema,
	component: NotificationsRoute,
});

/** Route component for the notifications page. */
function NotificationsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <NotificationsPage search={search} navigate={navigate} />;
}

import { createFileRoute } from "@tanstack/react-router";

import { ProfilePage } from "#/features/auth/profile";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/profile/")({
	head: () => pageHead("Profile"),
	component: ProfilePage,
});

import { createFileRoute } from "@tanstack/react-router";

import ResetPasswordPage from "#/features/auth/reset-password.tsx";
import { pageHead } from "#/lib/head";

type ResetSearch = { token?: string; email?: string };

export const Route = createFileRoute("/_auth/reset-password")({
	head: () => pageHead("Reset password"),
	validateSearch: (search: Record<string, unknown>): ResetSearch => ({
		token: typeof search.token === "string" ? search.token : undefined,
		email: typeof search.email === "string" ? search.email : undefined,
	}),
	component: ResetPasswordPage,
});

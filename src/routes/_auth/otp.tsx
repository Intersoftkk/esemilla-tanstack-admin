import { createFileRoute } from "@tanstack/react-router";

import OtpPage from "#/features/auth/otp.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_auth/otp")({
	head: () => pageHead("Verify your email"),
	validateSearch: (search: Record<string, unknown>): { email?: string } => ({
		email: typeof search.email === "string" ? search.email : undefined,
	}),
	component: OtpPage,
});

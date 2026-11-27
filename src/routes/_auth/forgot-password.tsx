import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordPage from "#/features/auth/forgot-password.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_auth/forgot-password")({
	head: () => pageHead("Forgot password"),
	component: ForgotPasswordPage,
});

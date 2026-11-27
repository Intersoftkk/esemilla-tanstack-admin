import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordPage from "#/features/auth/forgot-password.tsx";

export const Route = createFileRoute("/_auth/forgot-password")({
	component: ForgotPasswordPage,
	staticData: { breadcrumb: "Forgot Password" },
});

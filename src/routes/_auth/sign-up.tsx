import { createFileRoute } from "@tanstack/react-router";

import SignUpPage from "#/features/auth/sign-up.tsx";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_auth/sign-up")({
	ssr: "data-only",
	head: () => pageHead("Create an account"),
	component: SignUpRoute,
});

function SignUpRoute() {
	return <SignUpPage />;
}

import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "#/features/auth/sign-up.tsx";

export const Route = createFileRoute("/_auth/sign-up")({
	ssr: "data-only",
	component: SignInRoute,
});

function SignInRoute() {
	return <SignUpPage />;
}

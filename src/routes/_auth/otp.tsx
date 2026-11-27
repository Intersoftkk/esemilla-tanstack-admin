import { createFileRoute } from "@tanstack/react-router";
import OtpPage from "#/features/auth/otp.tsx";

export const Route = createFileRoute("/_auth/otp")({
	component: OtpPage,
});

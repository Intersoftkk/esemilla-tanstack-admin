import { createFileRoute } from "@tanstack/react-router";
import { SchoolOnboardingPage } from "#/features/schools/school-onboarding-page";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/schools_/new")({
	head: () => pageHead("Onboard a school"),
	component: SchoolOnboardingPage,
});

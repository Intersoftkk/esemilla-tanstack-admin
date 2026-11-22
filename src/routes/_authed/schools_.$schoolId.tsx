import { createFileRoute } from "@tanstack/react-router";
import { SchoolDetailPage } from "#/features/schools/school-detail-page";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/schools_/$schoolId")({
	head: () => pageHead("School"),
	component: SchoolDetailRoute,
});

function SchoolDetailRoute() {
	const { schoolId } = Route.useParams();
	return <SchoolDetailPage schoolId={schoolId} />;
}

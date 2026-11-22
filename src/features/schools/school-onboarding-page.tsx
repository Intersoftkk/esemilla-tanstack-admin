import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, School as SchoolIcon } from "lucide-react";

import { PageHeader } from "#/components/page-header.tsx";
import { Button } from "#/components/ui/button.tsx";
import { OnboardingWizard } from "#/features/schools/components/onboarding-wizard.tsx";

export function SchoolOnboardingPage() {
	const navigate = useNavigate();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Onboard a school"
				description="Provision a dedicated school workspace, select a plan, and configure the primary owner."
				icon={SchoolIcon}
				actions={
					<Button asChild variant="outline" size="sm">
						<Link to="/schools">
							<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
							Back to schools
						</Link>
					</Button>
				}
			/>

			<OnboardingWizard
				onCreated={(school) => {
					if (school?.id) {
						void navigate({
							to: "/schools/$schoolId",
							params: { schoolId: school.id },
						});
					} else {
						void navigate({ to: "/schools" });
					}
				}}
			/>
		</div>
	);
}

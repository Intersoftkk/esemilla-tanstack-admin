import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Building2, RefreshCw } from "lucide-react";

import { PageHeader } from "#/components/page-header.tsx";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/ui/tabs.tsx";
import { SchoolDetailDangerZone } from "#/features/schools/components/school-detail-danger-zone.tsx";
import { SchoolDetailOverview } from "#/features/schools/components/school-detail-overview.tsx";
import { SchoolDetailPlan } from "#/features/schools/components/school-detail-plan.tsx";
import { SchoolDetailSettings } from "#/features/schools/components/school-detail-settings.tsx";
import { SchoolStatusBadge } from "#/features/schools/components/school-status-badge.tsx";
import { useSchoolQuery } from "#/features/schools/queries/school.queries.ts";

export function SchoolDetailPage({ schoolId }: { schoolId: string }) {
	const navigate = useNavigate();
	const schoolQuery = useSchoolQuery(schoolId);
	const school = schoolQuery.data;

	return (
		<div className="space-y-6">
			<PageHeader
				title={school ? school.name : "School details"}
				description={
					school
						? `${school.subdomain || school.slug} · ${school.email}`
						: "Manage workspace configuration, plan limits, and status."
				}
				icon={Building2}
				badge={school ? <SchoolStatusBadge status={school.status} /> : null}
				actions={
					<div className="flex items-center gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/schools">
								<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
								All schools
							</Link>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => void schoolQuery.refetch()}
							disabled={schoolQuery.isFetching}
						>
							<RefreshCw
								className={`mr-1.5 h-3.5 w-3.5 ${schoolQuery.isFetching ? "animate-spin" : ""}`}
							/>
							Refresh
						</Button>
					</div>
				}
			/>

			{schoolQuery.isError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Unable to load school</AlertTitle>
					<AlertDescription>
						{schoolQuery.error instanceof Error
							? schoolQuery.error.message
							: "Could not retrieve school workspace details."}
					</AlertDescription>
				</Alert>
			)}

			{schoolQuery.isLoading || !school ? (
				<div className="space-y-4">
					<Skeleton className="h-10 w-80" />
					<Skeleton className="h-72 w-full" />
				</div>
			) : (
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="plan">Plan & usage</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
						<TabsTrigger value="danger">Lifecycle</TabsTrigger>
					</TabsList>

					<TabsContent value="overview">
						<SchoolDetailOverview school={school} />
					</TabsContent>

					<TabsContent value="plan">
						<SchoolDetailPlan school={school} />
					</TabsContent>

					<TabsContent value="settings">
						<SchoolDetailSettings school={school} />
					</TabsContent>

					<TabsContent value="danger">
						<SchoolDetailDangerZone
							school={school}
							onDeleted={() => void navigate({ to: "/schools" })}
						/>
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
}

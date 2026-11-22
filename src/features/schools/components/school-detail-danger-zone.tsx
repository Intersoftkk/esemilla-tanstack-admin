import {
	AlertTriangle,
	Archive,
	PauseCircle,
	PlayCircle,
	Trash2,
} from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "#/components/confirm-dialog.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import {
	useDeleteSchoolMutation,
	useUpdateSchoolStatusMutation,
} from "#/features/schools/queries/school.queries.ts";
import type {
	School,
	SchoolStatus,
} from "#/features/schools/types/school.types.ts";

interface SchoolDetailDangerZoneProps {
	school: School;
	onDeleted: () => void;
}

export function SchoolDetailDangerZone({
	school,
	onDeleted,
}: SchoolDetailDangerZoneProps) {
	const [pendingStatus, setPendingStatus] = useState<SchoolStatus | null>(null);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const statusMutation = useUpdateSchoolStatusMutation();
	const deleteMutation = useDeleteSchoolMutation();

	return (
		<div className="space-y-4">
			<Card className="border-destructive/30 shadow-xs">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base text-destructive">
						<AlertTriangle className="h-4 w-4" />
						Lifecycle & danger zone
					</CardTitle>
					<CardDescription>
						Control portal availability or permanently remove this workspace.
					</CardDescription>
				</CardHeader>

				<CardContent className="divide-y p-0">
					{school.status !== "active" && (
						<div className="flex flex-wrap items-center justify-between gap-3 p-4">
							<div>
								<p className="text-sm font-medium">Activate workspace</p>
								<p className="text-xs text-muted-foreground">
									Allow staff, students, and parents to sign in immediately.
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPendingStatus("active")}
							>
								<PlayCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
								Activate
							</Button>
						</div>
					)}

					{school.status !== "suspended" && (
						<div className="flex flex-wrap items-center justify-between gap-3 p-4">
							<div>
								<p className="text-sm font-medium">Suspend portal access</p>
								<p className="text-xs text-muted-foreground">
									Temporarily lock logins while preserving all student data.
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPendingStatus("suspended")}
							>
								<PauseCircle className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
								Suspend
							</Button>
						</div>
					)}

					{school.status !== "archived" && (
						<div className="flex flex-wrap items-center justify-between gap-3 p-4">
							<div>
								<p className="text-sm font-medium">Archive workspace</p>
								<p className="text-xs text-muted-foreground">
									Move to read-only archive and hide from active rosters.
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPendingStatus("archived")}
							>
								<Archive className="mr-1.5 h-3.5 w-3.5" />
								Archive
							</Button>
						</div>
					)}

					<div className="flex flex-wrap items-center justify-between gap-3 p-4">
						<div>
							<p className="text-sm font-medium text-destructive">
								Delete school permanently
							</p>
							<p className="text-xs text-muted-foreground">
								Removes the workspace, configuration, and hosted subdomain.
							</p>
						</div>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => setDeleteOpen(true)}
						>
							<Trash2 className="mr-1.5 h-3.5 w-3.5" />
							Delete school
						</Button>
					</div>
				</CardContent>
			</Card>

			<ConfirmDialog
				open={Boolean(pendingStatus)}
				onOpenChange={(open) => {
					if (!open) setPendingStatus(null);
				}}
				title={`Set school status to ${pendingStatus ?? ""}?`}
				desc={`This updates "${school.name}" immediately.`}
				confirmText="Confirm status change"
				destructive={
					pendingStatus === "suspended" || pendingStatus === "archived"
				}
				isLoading={statusMutation.isPending}
				handleConfirm={() => {
					if (!pendingStatus) return;
					statusMutation.mutate(
						{ id: school.id, status: pendingStatus },
						{ onSuccess: () => setPendingStatus(null) },
					);
				}}
			/>

			<ConfirmDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				title="Delete school workspace?"
				desc={`"${school.name}" and its hosted portal will be permanently deleted. This action cannot be undone.`}
				confirmText="Delete permanently"
				destructive
				isLoading={deleteMutation.isPending}
				handleConfirm={() => {
					deleteMutation.mutate(school.id, {
						onSuccess: () => {
							setDeleteOpen(false);
							onDeleted();
						},
					});
				}}
			/>
		</div>
	);
}

import { Link } from "@tanstack/react-router";
import { ExternalLink, Eye, Trash2 } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table.tsx";
import { SchoolStatusBadge } from "#/features/schools/components/school-status-badge.tsx";
import { getSchoolTypeMeta } from "#/features/schools/config/school.config.ts";
import type { School } from "#/features/schools/types/school.types.ts";
import {
	formatCompactNumber,
	formatSchoolDate,
	portalHost,
	portalUrl,
} from "#/features/schools/utils/school.utils.ts";

interface SchoolsTableProps {
	schools: School[];
	onDelete: (school: School) => void;
}

export function SchoolsTable({ schools, onDelete }: SchoolsTableProps) {
	return (
		<Card className="overflow-hidden shadow-xs">
			<CardContent className="p-0">
				<Table>
					<TableHeader className="[&_th]:h-11 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase">
						<TableRow>
							<TableHead className="pl-4">School</TableHead>
							<TableHead>Portal</TableHead>
							<TableHead>Plan</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Students</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="pr-4 text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{schools.map((school) => {
							const host = portalHost(school);
							const url = portalUrl(school);
							const typeMeta = getSchoolTypeMeta(school.type);

							return (
								<TableRow key={school.id}>
									<TableCell className="pl-4">
										<Link
											to="/schools/$schoolId"
											params={{ schoolId: school.id }}
											className="font-semibold text-foreground hover:text-primary hover:underline"
										>
											{school.name}
										</Link>
										<div className="text-[11px] text-muted-foreground">
											{typeMeta.label} ·{" "}
											{school.address.city || school.address.country || "—"}
										</div>
									</TableCell>
									<TableCell>
										{host && url ? (
											<a
												href={url}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-1 text-primary hover:underline"
											>
												{host}
												<ExternalLink className="h-3 w-3" />
											</a>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell>
										<Badge variant="secondary" className="text-[11px]">
											{school.plan?.name ?? "—"}
										</Badge>
									</TableCell>
									<TableCell>
										<SchoolStatusBadge status={school.status} />
									</TableCell>
									<TableCell className="text-right tabular-nums">
										{formatCompactNumber(school.usage.students)}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{formatSchoolDate(school.createdAt)}
									</TableCell>
									<TableCell className="pr-4 text-right">
										<div className="inline-flex items-center gap-1">
											<Button asChild variant="ghost" size="icon-sm">
												<Link
													to="/schools/$schoolId"
													params={{ schoolId: school.id }}
													title="View details"
												>
													<Eye className="h-3.5 w-3.5" />
												</Link>
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												onClick={() => onDelete(school)}
												title="Delete school"
												className="text-muted-foreground hover:text-destructive"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

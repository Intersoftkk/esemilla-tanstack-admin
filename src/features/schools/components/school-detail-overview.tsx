import {
	Check,
	Copy,
	ExternalLink,
	Globe,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { getSchoolTypeMeta } from "#/features/schools/config/school.config.ts";
import type { School } from "#/features/schools/types/schools.type.ts";
import {
	copyToClipboard,
	formatSchoolDate,
	portalHost,
	portalUrl,
	usagePercent,
	usageRows,
} from "#/features/schools/utils/school.utils.ts";

export function SchoolDetailOverview({ school }: { school: School }) {
	const [copied, setCopied] = useState(false);
	const host = portalHost(school);
	const url = portalUrl(school);
	const typeMeta = getSchoolTypeMeta(school.type);
	const rows = usageRows(school.usage, school.plan);

	const handleCopy = async () => {
		if (!url) return;
		const ok = await copyToClipboard(url);
		if (ok) {
			setCopied(true);
			toast.success("Portal URL copied");
			setTimeout(() => setCopied(false), 1800);
		}
	};

	return (
		<div className="grid gap-6 lg:grid-cols-3">
			<div className="space-y-6 lg:col-span-2">
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base">Institution overview</CardTitle>
						<CardDescription>
							{typeMeta.label} · Created {formatSchoolDate(school.createdAt)}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-xs">
						{school.description && (
							<p className="leading-relaxed text-muted-foreground">
								{school.description}
							</p>
						)}

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2 rounded-lg border bg-muted/20 p-3.5">
								<p className="font-semibold text-foreground">Contact</p>
								<p className="flex items-center gap-2 text-muted-foreground">
									<Mail className="h-3.5 w-3.5" />
									{school.email || "—"}
								</p>
								{school.phone && (
									<p className="flex items-center gap-2 text-muted-foreground">
										<Phone className="h-3.5 w-3.5" />
										{school.phone}
									</p>
								)}
								{school.website && (
									<a
										href={school.website}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-2 text-primary hover:underline"
									>
										<ExternalLink className="h-3.5 w-3.5" />
										{school.website}
									</a>
								)}
							</div>

							<div className="space-y-2 rounded-lg border bg-muted/20 p-3.5">
								<p className="font-semibold text-foreground">Address</p>
								<p className="flex items-start gap-2 text-muted-foreground">
									<MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
									<span>
										{school.address.line1}
										{school.address.line2 ? `, ${school.address.line2}` : ""}
										<br />
										{[
											school.address.city,
											school.address.state,
											school.address.postalCode,
											school.address.country,
										]
											.filter(Boolean)
											.join(", ")}
									</span>
								</p>
								<p className="text-[11px] text-muted-foreground">
									Timezone: {school.address.timezone} · Currency:{" "}
									{school.currency}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="text-base">Workspace usage</CardTitle>
						<CardDescription>
							Live consumption relative to {school.plan?.name ?? "current plan"}{" "}
							allowances
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{rows.map((row) => {
							const pct = usagePercent(row.used, row.limit);
							return (
								<div key={row.key} className="space-y-1.5 text-xs">
									<div className="flex items-center justify-between">
										<span className="font-medium">{row.label}</span>
										<span className="text-muted-foreground tabular-nums">
											{row.used} / {row.limit || "Unlimited"}
										</span>
									</div>
									<Progress value={pct} className="h-1.5" />
								</div>
							);
						})}
					</CardContent>
				</Card>
			</div>

			<div className="space-y-6">
				<Card className="shadow-xs">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Globe className="h-4 w-4 text-primary" />
							Portal access
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-xs">
						{host && url ? (
							<>
								<div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/20 p-3">
									<span className="truncate font-medium">{host}</span>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={() => void handleCopy()}
									>
										{copied ? (
											<Check className="h-3.5 w-3.5 text-emerald-500" />
										) : (
											<Copy className="h-3.5 w-3.5" />
										)}
									</Button>
								</div>
								<Button asChild size="sm" className="w-full">
									<a href={url} target="_blank" rel="noreferrer">
										Open live portal
										<ExternalLink className="ml-1.5 h-3.5 w-3.5" />
									</a>
								</Button>
							</>
						) : (
							<p className="text-muted-foreground">
								Portal hostname is not configured yet.
							</p>
						)}
					</CardContent>
				</Card>

				{school.contact && (
					<Card className="shadow-xs">
						<CardHeader>
							<CardTitle className="text-base">Primary contact</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1 text-xs">
							<p className="font-semibold">{school.contact.name || "Owner"}</p>
							<p className="text-muted-foreground">{school.contact.email}</p>
							{school.contact.phone && (
								<p className="text-muted-foreground">{school.contact.phone}</p>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

import { Badge } from "#/components/ui/badge.tsx";
import { SCHOOL_STATUS_META } from "#/features/schools/config/school.config.ts";
import type { SchoolStatus } from "#/features/schools/types/school.types.ts";
import { cn } from "#/lib/utils.ts";

export function SchoolStatusBadge({ status }: { status: SchoolStatus }) {
	const meta = SCHOOL_STATUS_META[status];

	return (
		<Badge
			variant="outline"
			className={cn(
				"inline-flex items-center gap-1.5 border font-medium",
				meta.badgeClassName,
			)}
		>
			<span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClassName)} />
			{meta.label}
		</Badge>
	);
}

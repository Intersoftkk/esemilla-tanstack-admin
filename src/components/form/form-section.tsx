import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FormSection({
	title,
	children,
	description,
	actions,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
	actions?: React.ReactNode;
}) {
	return (
		<Card className="rounded-2xl border-0 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle className="text-lg">{title}</CardTitle>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
				{actions}
			</CardHeader>

			<CardContent className="space-y-4">{children}</CardContent>
		</Card>
	);
}

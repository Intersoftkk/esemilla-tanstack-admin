import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { MonthRangePicker } from "#/components/ui/month-range-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { Separator } from "#/components/ui/separator";
import { cn } from "#/lib/utils";

type MonthRangeValue = {
	start: string; // yyyy-MM
	end: string; // yyyy-MM
};

interface DataTableMonthRangeFilterProps {
	title?: string;
	value?: MonthRangeValue;
	onChange: (next: MonthRangeValue | undefined) => void;
	className?: string;
	align?: "start" | "center" | "end";
}

export function DataTableMonthRangeFilter({
	value,
	onChange,
	className,
	align = "start",
}: DataTableMonthRangeFilterProps) {
	const start = value?.start;
	const end = value?.end;
	const hasValue = Boolean(start && end);

	const label =
		start && end
			? `${format(new Date(`${start}-01`), "MMM yyyy")} - ${format(new Date(`${end}-01`), "MMM yyyy")}`
			: "Pick a month range";

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!hasValue ? "text-muted-foreground" : "",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					<span className="truncate">{label}</span>

					{hasValue ? (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal"
							>
								Range
							</Badge>
						</>
					) : null}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" align={align}>
				<MonthRangePicker
					selectedMonthRange={
						start && end
							? {
									start: new Date(`${start}-01`),
									end: new Date(`${end}-01`),
								}
							: undefined
					}
					onMonthRangeSelect={({ start, end }: { start: Date; end: Date }) => {
						onChange({
							start: format(start, "yyyy-MM"),
							end: format(end, "yyyy-MM"),
						});
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

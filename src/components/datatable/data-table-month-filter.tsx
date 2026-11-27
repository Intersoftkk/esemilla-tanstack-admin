import { format } from "date-fns";
import { CalendarIcon, type LucideProps } from "lucide-react";
import type React from "react";
import { Button } from "#/components/ui/button";
import { MonthPicker } from "#/components/ui/month-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";

interface DataTableMonthFilterProps {
	title?: string;
	selectedMonth?: Date;
	onMonthSelect: (date: Date) => void;
	className?: string;
	placeholder?: string;
	icon?: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
}

export function DataTableMonthFilter({
	title,
	selectedMonth,
	onMonthSelect,
}: DataTableMonthFilterProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-40 justify-start text-left font-normal",
						!selectedMonth && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{selectedMonth
						? format(selectedMonth, "MMM yyyy")
						: (title ?? "Pick a month")}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<MonthPicker
					selectedMonth={selectedMonth}
					onMonthSelect={onMonthSelect}
				/>
			</PopoverContent>
		</Popover>
	);
}

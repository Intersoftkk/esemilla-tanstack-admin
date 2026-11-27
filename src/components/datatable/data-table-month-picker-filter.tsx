"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { MonthPicker } from "#/components/ui/month-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";

interface MonthPickerFilterProps {
	value?: Date;
	onChange: (date?: Date) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

/**
 * Creates a timezone-safe date for a given year and month.
 * Uses day=15 at noon to avoid any timezone shift crossing month boundaries.
 */
function createSafeMonthDate(year: number, month: number): Date {
	return new Date(year, month, 15, 12, 0, 0, 0);
}

/**
 * Normalizes an incoming date to a safe mid-month representation.
 * Uses LOCAL timezone methods (getFullYear, getMonth) to ensure
 * correct month extraction regardless of how the date was created.
 */
function normalizeDateToSafeMonth(date: Date): Date {
	return createSafeMonthDate(date.getFullYear(), date.getMonth());
}

export function DataTableMonthPickerFilter({
	value,
	onChange,
	placeholder = "Pick a month",
	className,
	disabled = false,
}: MonthPickerFilterProps) {
	// Normalize incoming date to safe mid-month representation
	const safeValue = value ? normalizeDateToSafeMonth(value) : undefined;

	const displayText = safeValue ? format(safeValue, "MMM yyyy") : placeholder;
	const hasValue = !!safeValue;

	const handleMonthSelect = (date?: Date) => {
		if (!date) {
			onChange(undefined);
			return;
		}
		// Return a normalized, timezone-safe date
		onChange(normalizeDateToSafeMonth(date));
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"justify-start text-left font-normal",
						!hasValue && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{displayText}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<MonthPicker
					selectedMonth={safeValue}
					onMonthSelect={handleMonthSelect}
				/>
			</PopoverContent>
		</Popover>
	);
}

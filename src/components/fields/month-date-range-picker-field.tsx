"use client";

import { format, isValid } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";
import { type DateRange, DayPicker } from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MonthDateRangeValue {
	start?: Date;
	end?: Date;
}

interface MonthDateRangePickerFieldProps {
	value?: MonthDateRangeValue;
	onChange: (range: MonthDateRangeValue) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;

	/**
	 * Optional fixed month lock.
	 * If passed, selection is restricted to this month only.
	 */
	month?: Date;

	/**
	 * Optional calendar bounds.
	 */
	fromMonth?: Date;
	toMonth?: Date;

	/**
	 * Show clear action.
	 * Default: true
	 */
	clearable?: boolean;
}
function createSafeLocalDate(year: number, month: number, day: number): Date {
	return new Date(year, month, day, 12, 0, 0, 0);
}

function normalizeToSafeLocalDay(date?: Date): Date | undefined {
	if (!date || !isValid(date)) return undefined;
	return createSafeLocalDate(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
}

function normalizeToSafeMonth(date?: Date): Date | undefined {
	if (!date || !isValid(date)) return undefined;
	return createSafeLocalDate(date.getFullYear(), date.getMonth(), 15);
}

function isSameMonth(a?: Date, b?: Date): boolean {
	if (!a || !b) return false;
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function toCalendarRange(value?: MonthDateRangeValue): DateRange | undefined {
	const start = normalizeToSafeLocalDay(value?.start);
	const end = normalizeToSafeLocalDay(value?.end);

	if (!start && !end) return undefined;
	return { from: start, to: end };
}

function formatDisplay(
	value?: MonthDateRangeValue,
	placeholder = "Pick a date range",
): string {
	const start = normalizeToSafeLocalDay(value?.start);
	const end = normalizeToSafeLocalDay(value?.end);

	if (start && end) {
		if (isSameMonth(start, end)) {
			return `${format(start, "dd")} - ${format(end, "dd MMM yyyy")}`;
		}
		return `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
	}

	return placeholder;
}

/**
 * Safe serializer for API payloads.
 * Use instead of toISOString() for date-only values.
 */
export function serializeMonthDateRange(value?: MonthDateRangeValue): {
	start?: string;
	end?: string;
} {
	const start = normalizeToSafeLocalDay(value?.start);
	const end = normalizeToSafeLocalDay(value?.end);

	return {
		start: start ? format(start, "yyyy-MM-dd") : undefined,
		end: end ? format(end, "yyyy-MM-dd") : undefined,
	};
}

export function MonthDateRangePickerField({
	value,
	onChange,
	placeholder = "Pick a date range",
	className,
	disabled = false,
	month,
	fromMonth,
	toMonth,
	clearable = true,
}: MonthDateRangePickerFieldProps) {
	const [open, setOpen] = React.useState(false);

	const safeValue = React.useMemo(
		() => ({
			start: normalizeToSafeLocalDay(value?.start),
			end: normalizeToSafeLocalDay(value?.end),
		}),
		[value],
	);

	const lockedMonth = React.useMemo(() => normalizeToSafeMonth(month), [month]);

	const selectedRange = React.useMemo(
		() => toCalendarRange(safeValue),
		[safeValue],
	);

	const defaultMonth = React.useMemo(() => {
		if (lockedMonth) return lockedMonth;
		if (safeValue.start) return normalizeToSafeMonth(safeValue.start);
		return normalizeToSafeMonth(new Date());
	}, [lockedMonth, safeValue.start]);

	const handleSelect = React.useCallback(
		(range?: DateRange) => {
			if (!range?.from && !range?.to) {
				onChange({});
				return;
			}

			const start = normalizeToSafeLocalDay(range?.from);
			const end = normalizeToSafeLocalDay(range?.to);

			if (start && end && !isSameMonth(start, end)) {
				onChange({ start, end: undefined });
				return;
			}

			onChange({ start, end });

			if (start && end) {
				setOpen(false);
			}
		},
		[onChange],
	);

	const handleClear = React.useCallback(() => {
		onChange({});
	}, [onChange]);

	const isDateDisabled = React.useCallback(
		(date: Date) => {
			const safeDate = normalizeToSafeLocalDay(date);
			if (!safeDate) return true;

			if (lockedMonth && !isSameMonth(safeDate, lockedMonth)) {
				return true;
			}

			return !!(
				safeValue.start &&
				!safeValue.end &&
				!isSameMonth(safeDate, safeValue.start)
			);
		},
		[lockedMonth, safeValue.start, safeValue.end],
	);

	const hasValue = !!(safeValue.start || safeValue.end);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal",
						!hasValue && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
					<span className="truncate">
						{formatDisplay(safeValue, placeholder)}
					</span>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" align="start">
				<div className="rounded-md">
					<DayPicker
						mode="range"
						selected={selectedRange}
						onSelect={handleSelect}
						disabled={isDateDisabled}
						defaultMonth={defaultMonth}
						month={lockedMonth}
						hideNavigation={!!lockedMonth}
						startMonth={fromMonth}
						endMonth={toMonth}
						showOutsideDays={false}
						classNames={{
							months: "flex flex-col sm:flex-row gap-2",
							month: "flex flex-col gap-4",
							month_caption:
								"flex justify-center pt-1 relative items-center w-full",
							caption_label: "text-sm font-medium",
							nav: "flex items-center gap-1",
							button_previous: cn(
								buttonVariants({ variant: "outline" }),
								"absolute left-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
							),
							button_next: cn(
								buttonVariants({ variant: "outline" }),
								"absolute right-1 top-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
							),
							month_grid: "w-full border-collapse space-y-1",
							weekdays: "flex",
							weekday:
								"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
							week: "flex w-full mt-2",
							day: cn(
								"relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
								"[&:has([aria-selected])]:bg-accent",
								"[&:has([aria-selected].day-range-end)]:rounded-r-md",
								"[&:has([aria-selected].day-range-start)]:rounded-l-md",
								"first:[&:has([aria-selected])]:rounded-l-md",
								"last:[&:has([aria-selected])]:rounded-r-md",
							),
							day_button: cn(
								buttonVariants({ variant: "ghost" }),
								"h-9 w-9 p-0 font-normal aria-selected:opacity-100",
							),
							range_start: "day-range-start rounded-l-md",
							range_end: "day-range-end rounded-r-md",
							selected:
								"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
							today: "bg-accent text-accent-foreground",
							outside:
								"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
							disabled: "text-muted-foreground opacity-50",
							range_middle:
								"aria-selected:bg-accent aria-selected:text-accent-foreground",
							hidden: "invisible",
						}}
						components={{
							Chevron: ({ orientation }) =>
								orientation === "left" ? (
									<ChevronLeft className="h-4 w-4" />
								) : (
									<ChevronRight className="h-4 w-4" />
								),
						}}
					/>

					{clearable && hasValue && (
						<div className="border-t p-2">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleClear}
								className="w-full justify-center text-muted-foreground"
							>
								<X className="mr-1.5 h-3.5 w-3.5" />
								Clear range
							</Button>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

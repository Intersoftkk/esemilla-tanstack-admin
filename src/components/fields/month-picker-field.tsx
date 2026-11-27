"use client";

import { format, isValid, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { MonthPicker } from "@/components/ui/month-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TIMEZONE-SAFE UTILITIES                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

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

/**
 * Parse a YYYY-MM string to a timezone-safe Date object.
 * Returns undefined if parsing fails.
 */
function parseMonthString(value: string | null | undefined): Date | undefined {
	if (!value || typeof value !== "string") return undefined;

	// Try to parse YYYY-MM format
	const match = value.match(/^(\d{4})-(\d{2})$/);
	if (match) {
		const year = parseInt(match[1], 10);
		const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed

		if (year >= 1900 && year <= 2100 && month >= 0 && month <= 11) {
			return createSafeMonthDate(year, month);
		}
	}

	// Fallback: try date-fns parsing
	const parsed = parse(`${value}-15`, "yyyy-MM-dd", new Date());
	if (isValid(parsed)) {
		return normalizeDateToSafeMonth(parsed);
	}

	return undefined;
}

/**
 * Format a Date to YYYY-MM string (timezone-safe).
 * Uses local timezone methods to extract year and month.
 */
function formatToMonthString(date: Date | null | undefined): string | null {
	if (!date || !isValid(date)) return null;

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");

	return `${year}-${month}`;
}

/**
 * Format a Date for display (e.g., "Jan 2024").
 * Uses a timezone-safe normalized date.
 */
function formatForDisplay(date: Date | null | undefined): string | null {
	if (!date || !isValid(date)) return null;

	// Normalize to safe mid-month date before formatting
	const safeDate = normalizeDateToSafeMonth(date);
	return format(safeDate, "MMM yyyy");
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  COMPONENT TYPES                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

interface MonthPickerFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	name: TName;
	label: string;
	description?: string;
	placeholder?: string;
	control: Control<TFieldValues>;
	required?: boolean;
	disabled?: boolean;
	clearable?: boolean;
	minDate?: Date;
	maxDate?: Date;
	className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  COMPONENT                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

export function MonthPickerField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	name,
	label,
	description,
	placeholder = "Pick a month",
	control,
	required = false,
	disabled = false,
	clearable = true,
	minDate,
	maxDate,
	className,
}: MonthPickerFieldProps<TFieldValues, TName>) {
	const [open, setOpen] = useState(false);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				// Parse the string value to a timezone-safe Date
				const selectedDate = parseMonthString(
					field.value as string | null | undefined,
				);

				// Normalize for display
				const safeSelectedDate = selectedDate
					? normalizeDateToSafeMonth(selectedDate)
					: undefined;

				const displayValue = formatForDisplay(safeSelectedDate);

				const handleSelect = (date: Date | undefined) => {
					if (date) {
						// Normalize the date and format to string
						const normalizedDate = normalizeDateToSafeMonth(date);
						const monthString = formatToMonthString(normalizedDate);
						field.onChange(monthString);
					} else {
						field.onChange(null);
					}
					setOpen(false);
				};

				const handleClear = (e: React.MouseEvent) => {
					e.stopPropagation();
					e.preventDefault();
					field.onChange(null);
				};

				return (
					<Field
						data-invalid={fieldState.invalid ? "true" : undefined}
						className={className}
					>
						<FieldLabel>
							{label}
							{required && <span className="text-destructive ml-1">*</span>}
						</FieldLabel>

						{description && <FieldDescription>{description}</FieldDescription>}

						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="outline"
									disabled={disabled}
									className={cn(
										"w-full justify-start text-left font-normal",
										!field.value && "text-muted-foreground",
										fieldState.invalid &&
											"border-destructive focus-visible:ring-destructive",
									)}
									aria-invalid={fieldState.invalid}
									aria-describedby={
										fieldState.error ? `${name}-error` : undefined
									}
								>
									<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
									<span className="flex-1 truncate">
										{displayValue || placeholder}
									</span>

									{/* Clear button */}
									{clearable && field.value && !disabled && (
										<X
											className="ml-2 h-4 w-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
											onClick={handleClear}
											aria-label="Clear selection"
										/>
									)}
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-auto p-0" align="start">
								<MonthPicker
									selectedMonth={safeSelectedDate}
									onMonthSelect={handleSelect}
									minDate={minDate}
									maxDate={maxDate}
								/>
							</PopoverContent>
						</Popover>

						{fieldState.error && (
							<FieldError id={`${name}-error`}>
								{fieldState.error.message}
							</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}

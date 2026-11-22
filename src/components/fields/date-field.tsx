"use client";

import { format, isValid, parse, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateFieldProps {
	name: string;
	label: string | ReactNode;
	description?: string;
	placeholder?: string;
	control: Control<any>;
	required?: boolean;
	disabled?: boolean;
}

export function DateField({
	name,
	label,
	description,
	placeholder = "Pick a date",
	control,
	required = false,
	disabled = false,
}: DateFieldProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const raw = field.value;

				// Accept Date | string | null/undefined
				let valueAsDate: Date | undefined;

				if (raw instanceof Date) {
					valueAsDate = isValid(raw) ? raw : undefined;
				} else if (typeof raw === "string") {
					const s = raw.trim();

					// treat empty / "null" / "undefined" as no value
					if (!s || s === "null" || s === "undefined") {
						valueAsDate = undefined;
					} else {
						const parsed = parse(s, "yyyy-MM-dd", new Date());
						valueAsDate = isValid(parsed) ? parsed : undefined;
					}
				} else {
					valueAsDate = undefined;
				}

				const displayValue = valueAsDate
					? format(valueAsDate, "PPP")
					: placeholder;

				return (
					<Field data-invalid={fieldState.invalid ? "true" : undefined}>
						<FieldLabel>
							{label}
							{required && <span className="text-destructive ml-1">*</span>}
						</FieldLabel>

						{description && <FieldDescription>{description}</FieldDescription>}

						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!valueAsDate && "text-muted-foreground",
									)}
									disabled={disabled}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{displayValue}
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={valueAsDate}
									onSelect={(date) => {
										if (!date) {
											field.onChange(null); // or ""
											return;
										}
										const normalizedDate = startOfDay(date);
										field.onChange(format(normalizedDate, "yyyy-MM-dd"));
										setOpen(false);
									}}
									disabled={disabled}
									captionLayout="dropdown"
									startMonth={new Date(1950, 0)}
									endMonth={new Date(new Date().getFullYear() + 10, 11)}
								/>
							</PopoverContent>
						</Popover>

						{fieldState.error && (
							<FieldError>{fieldState.error.message}</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}

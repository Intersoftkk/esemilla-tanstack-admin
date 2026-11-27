"use client";

import { HelpCircle } from "lucide-react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioOption {
	value: string;
	label: string;
	description?: string;
}

interface RadioFieldProps<TFormValues extends FieldValues = FieldValues> {
	name: Path<TFormValues>;
	label?: string;
	description?: string;
	options: RadioOption[];
	control: Control<TFormValues>;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	orientation?: "horizontal" | "vertical";
}

export function RadioField<TFormValues extends FieldValues>({
	name,
	label,
	description,
	options,
	control,
	required = false,
	disabled = false,
	className,
	orientation = "horizontal",
}: RadioFieldProps<TFormValues>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const hasError = !!fieldState.error?.message;

				return (
					<Field
						data-invalid={hasError ? "true" : undefined}
						className={cn("w-full", className)}
					>
						{label && (
							<FieldLabel>
								{label}
								{required && <span className="text-destructive ml-1">*</span>}
							</FieldLabel>
						)}

						{description && <FieldDescription>{description}</FieldDescription>}

						<RadioGroup
							onValueChange={field.onChange}
							value={field.value}
							disabled={disabled}
							className={cn(
								"flex gap-4",
								orientation === "vertical" && "flex-col",
								orientation === "horizontal" && "flex-wrap",
							)}
						>
							{options.map((opt) => (
								<div key={opt.value} className="flex items-start gap-2">
									<RadioGroupItem
										value={opt.value}
										id={`${name}-${opt.value}`}
										disabled={disabled}
										className="mt-0.5"
									/>
									<label
										htmlFor={`${name}-${opt.value}`}
										className={cn(
											"flex-1 cursor-pointer text-sm leading-tight",
											disabled && "cursor-not-allowed opacity-60",
										)}
									>
										<span className="font-medium">{opt.label}</span>
										{opt.description && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
												{opt.description}
												<HelpCircle className="h-3 w-3" aria-hidden="true" />
											</div>
										)}
									</label>
								</div>
							))}
						</RadioGroup>

						{fieldState.error && (
							<FieldError>{fieldState.error.message}</FieldError>
						)}
					</Field>
				);
			}}
		/>
	);
}

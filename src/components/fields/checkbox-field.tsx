"use client";

import type { ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps<T extends FieldValues, TOutput = T> {
	name: FieldPath<T>;
	label: string;
	description?: ReactNode;
	control: Control<T, any, TOutput>;
	disabled?: boolean;
	required?: boolean;
	className?: string;
}

export function CheckboxField<T extends FieldValues, TOutput = T>({
	name,
	label,
	description,
	control,
	disabled = false,
	required = false,
	className,
}: CheckboxFieldProps<T, TOutput>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const id = `chk-${name}`;

				return (
					<div
						className={cn(
							"flex items-start gap-3 py-3 px-4 border rounded-md border-input bg-background",
							className,
						)}
					>
						<Checkbox
							id={id}
							checked={field.value === true}
							onCheckedChange={field.onChange}
							disabled={disabled}
							className="mt-0.75"
						/>

						<div className="grid gap-1">
							<FieldLabel
								htmlFor={id}
								className={cn(
									"cursor-pointer text-sm font-medium leading-none",
									required &&
										"after:content-['*'] after:ml-1 after:text-red-600",
								)}
							>
								{label}
							</FieldLabel>

							{description && (
								<FieldDescription className="text-sm text-muted-foreground">
									{description}
								</FieldDescription>
							)}

							{fieldState.error && (
								<FieldError className="text-sm text-destructive">
									{fieldState.error.message}
								</FieldError>
							)}
						</div>
					</div>
				);
			}}
		/>
	);
}

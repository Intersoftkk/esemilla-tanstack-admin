"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import TimePicker from "@/components/ui/time-picker";

interface TimeFieldProps {
	name: string;
	label: string;
	description?: string;
	placeholder?: string;
	control: Control<any>;
	required?: boolean;
	disabled?: boolean;
}

export function TimePickerField({
	name,
	label,
	description,
	placeholder = "Select time",
	control,
	required = false,
	disabled = false,
}: TimeFieldProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid ? "true" : undefined}>
					<FieldLabel>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</FieldLabel>

					{description && <FieldDescription>{description}</FieldDescription>}

					<TimePicker
						{...field}
						placeholder={placeholder}
						disabled={disabled}
						value={field.value ?? ""}
						onChange={field.onChange}
						aria-invalid={fieldState.invalid}
					/>

					{fieldState.error && (
						<FieldError>{fieldState.error.message}</FieldError>
					)}
				</Field>
			)}
		/>
	);
}

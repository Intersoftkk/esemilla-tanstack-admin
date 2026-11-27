"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { Option } from "#/types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DynamicSelectFieldProps {
	name: string;
	label: string;
	control: Control<any>;
	options: Array<Option>;
	placeholder?: string;
	emptyMessage?: string;
	required?: boolean;
	disabled?: boolean;
}

export function DynamicSelectField({
	name,
	label,
	control,
	options = [],
	placeholder = "Select an option",
	emptyMessage = "No options available",
	required = false,
	disabled = false,
}: DynamicSelectFieldProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid ? "true" : undefined}>
					<FieldLabel>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</FieldLabel>

					<Select
						value={field.value ? String(field.value) : undefined}
						onValueChange={field.onChange}
						disabled={disabled}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>

						<SelectContent>
							{options.length > 0 ? (
								options.map((option) => {
									const optValue = String(option.value);
									return (
										<SelectItem key={optValue} value={optValue}>
											{option.label}
										</SelectItem>
									);
								})
							) : (
								<div className="px-4 py-2 text-sm text-muted-foreground text-center">
									{emptyMessage}
								</div>
							)}
						</SelectContent>
					</Select>

					{fieldState.error && (
						<FieldError>{fieldState.error.message}</FieldError>
					)}
				</Field>
			)}
		/>
	);
}

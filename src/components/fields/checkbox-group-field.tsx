"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import type { Option } from "@/types";

interface CheckboxGroupFieldProps {
	name: string;
	label: string;
	description?: string;
	options: Array<Option>;
	control: Control<any>;
}

export function CheckboxGroupField({
	name,
	label,
	description,
	options,
	control,
}: CheckboxGroupFieldProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<div className="space-y-4">
					<div className="mb-4">
						<FieldLabel className="text-base">{label}</FieldLabel>
						{description && <FieldDescription>{description}</FieldDescription>}
					</div>

					<div className="space-y-3">
						{options.map((option) => (
							<div
								key={option.value}
								className="flex flex-row items-center space-x-3 cursor-pointer"
							>
								<Checkbox
									aria-label={option.label}
									checked={field.value?.includes(option.value) ?? false}
									onCheckedChange={(checked) => {
										const current = field.value || [];
										if (checked) {
											field.onChange([...current, option.value]);
										} else {
											field.onChange(
												current.filter((v: string) => v !== option.value),
											);
										}
									}}
								/>
								<span className="text-sm font-normal">{option.label}</span>
							</div>
						))}
					</div>

					{fieldState.error && (
						<FieldError>{fieldState.error.message}</FieldError>
					)}
				</div>
			)}
		/>
	);
}

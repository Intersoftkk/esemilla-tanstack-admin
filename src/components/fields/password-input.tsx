"use client";

import { Eye, EyeOff, type LucideProps } from "lucide-react";
import React, { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordFieldProps<T extends FieldValues, TOutput>
	extends React.InputHTMLAttributes<HTMLInputElement> {
	name: FieldPath<T>;
	label?: string;
	description?: string;
	control: Control<T, any, TOutput>;
	required?: boolean;
	clearable?: boolean;
	leftIcon?: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
}

export function PasswordInput<T extends FieldValues, TOutput = T>({
	name,
	label,
	description,
	control,
	required = false,
	disabled = false,
	className,
	clearable = false,
	leftIcon: LeftIcon,
	...props
}: PasswordFieldProps<T, TOutput>) {
	const [show, setShow] = useState(false);
	const inputId = React.useId(); // Generates a unique ID for accessibility

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field
					data-invalid={fieldState.invalid ? "true" : undefined}
					className={cn("space-y-2", className)} // Added standard spacing
				>
					{label && (
						<FieldLabel htmlFor={inputId}>
							{label}
							{required && (
								<span className="ml-1 text-destructive font-medium">*</span>
							)}
						</FieldLabel>
					)}

					<div className="relative flex items-center group">
						{/* Left Icon Logic */}
						{LeftIcon && (
							<div className="absolute left-3 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-foreground">
								<LeftIcon size={18} strokeWidth={2} />
							</div>
						)}
						<Input
							{...props}
							{...field}
							id={inputId}
							type={show ? "text" : "password"}
							disabled={disabled}
							value={field.value ?? ""}
							aria-invalid={fieldState.invalid}
							className={cn(
								"bg-background w-full transition-all",
								LeftIcon && "pl-10",
								clearable && field.value && "pr-10",
							)}
						/>

						<button
							type="button"
							onClick={() => setShow((v) => !v)}
							disabled={disabled}
							tabIndex={-1}
							className={cn(
								"absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground transition-colors",
								"hover:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
								"rounded-r-md", // Matches input border radius
							)}
							aria-label={show ? "Hide password" : "Show password"}
						>
							{show ? (
								<EyeOff className="h-4 w-4" aria-hidden="true" />
							) : (
								<Eye className="h-4 w-4" aria-hidden="true" />
							)}
						</button>
					</div>

					{description && !fieldState.error && (
						<FieldDescription>{description}</FieldDescription>
					)}

					{fieldState.error && (
						<FieldError>{fieldState.error.message}</FieldError>
					)}
				</Field>
			)}
		/>
	);
}

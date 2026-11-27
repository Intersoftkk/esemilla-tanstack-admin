"use client";

import type * as React from "react";
import { useId } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface TargetTypeOption<TValue extends string = string> {
	value: TValue;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface TargetTypeFieldProps<TValue extends string = string> {
	value: TValue;
	onChange: (value: TValue) => void;
	options: Array<TargetTypeOption<TValue>>;
	label?: string;
	disabled?: boolean;
}

/**
 * Segmented selector used to switch the permission matrix between target
 * kinds (e.g. roles vs. users). Controlled — the parent owns the value.
 * Backed by native radio inputs so it stays keyboard and screen-reader
 * friendly while looking like a segmented control.
 */
export function TargetTypeField<TValue extends string = string>({
	value,
	onChange,
	options,
	label,
	disabled = false,
}: TargetTypeFieldProps<TValue>) {
	const groupName = useId();

	return (
		<Field className="w-full">
			{label && <FieldLabel>{label}</FieldLabel>}

			<fieldset
				aria-label={label ?? "Target type"}
				className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-1"
			>
				{options.map((option) => {
					const selected = option.value === value;
					const Icon = option.icon;

					return (
						<label
							key={option.value}
							className={cn(
								"flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition",
								disabled && "cursor-not-allowed opacity-50",
								selected
									? "bg-card text-foreground shadow-xs ring-1 ring-border"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<input
								type="radio"
								name={groupName}
								value={option.value}
								checked={selected}
								disabled={disabled}
								onChange={() => onChange(option.value)}
								className="sr-only"
							/>
							<Icon className="size-3.5" />
							{option.label}
						</label>
					);
				})}
			</fieldset>
		</Field>
	);
}

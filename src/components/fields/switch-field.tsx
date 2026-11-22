"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface SwitchFieldProps {
    name: string;
    label: string;
    description?: string;
    control: Control<any>;
    disabled?: boolean;
    className?: string;
}

export function SwitchField({
                                name,
                                label,
                                description,
                                control,
                                disabled = false,
                                className,
                            }: SwitchFieldProps) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const hasError = !!fieldState.error?.message;

                return (
                    <div className={cn("space-y-1.5", className)}>
                        <div
                            className={cn(
                                "flex items-center justify-between gap-4 rounded-lg border px-3 py-2",
                                disabled && "opacity-60"
                            )}
                        >
                            {/* clickable label */}
                            <label
                                className={cn(
                                    "min-w-0 cursor-pointer select-none",
                                    disabled && "cursor-not-allowed"
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (disabled) return;
                                    field.onChange(!field.value);
                                }}
                            >
                                <FieldLabel className="leading-5">{label}</FieldLabel>
                                {description ? (
                                    <FieldDescription className="mt-0.5">
                                        {description}
                                    </FieldDescription>
                                ) : null}
                            </label>

                            <Switch
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                disabled={disabled}
                                aria-invalid={hasError}
                            />
                        </div>

                        {hasError ? (
                            <p className="text-xs text-destructive">
                                {fieldState.error?.message}
                            </p>
                        ) : null}
                    </div>
                );
            }}
        />
    );
}

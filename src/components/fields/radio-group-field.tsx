'use client'

import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import type { Option } from '@/types'

interface RadioGroupFieldProps {
    name: string
    label: string
    options: Option[]
    control: Control<any>
    className?: string
}

export function RadioGroupField({
                                    name,
                                    label,
                                    options,
                                    control,
                                    className,
                                }: RadioGroupFieldProps) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <div className={cn('space-y-3', className)}>
                    <FieldLabel>{label}</FieldLabel>
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value != null ? String(field.value) : undefined}
                        className="flex flex-wrap gap-4"
                    >
                        {options.map((option) => {
                            const value = String(option.value ?? option.id ?? option.name ?? '')
                            const optionLabel = option.label ?? option.name ?? value

                            return (
                                <div key={value} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={value}
                                        id={`${name}-${value}`}
                                        disabled={option.disabled}
                                    />
                                    <label
                                        htmlFor={`${name}-${value}`}
                                        className={cn(
                                            'font-normal capitalize cursor-pointer',
                                            option.disabled && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {optionLabel}
                                    </label>
                                </div>
                            )
                        })}
                    </RadioGroup>
                    {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                    )}
                </div>
            )}
        />
    )
}
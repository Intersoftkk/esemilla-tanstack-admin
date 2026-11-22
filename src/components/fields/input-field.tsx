'use client'

import React from 'react'
import type {Control, FieldPath, FieldValues} from 'react-hook-form';
import {Controller} from 'react-hook-form'
import type {LucideProps} from 'lucide-react';
import {X} from 'lucide-react'
import {Field, FieldDescription, FieldError, FieldLabel,} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'

interface InputFieldProps<T extends FieldValues, TOutput> extends React.InputHTMLAttributes<HTMLInputElement> {
    name: FieldPath<T>
    label?: string
    description?: string
    control: Control<T, any, TOutput>
    required?: boolean
    disabled?: boolean
    clearable?: boolean
    leftIcon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
}

export function InputField<T extends FieldValues, TOutput = T>({
                               name,
                               label,
                               description,
                               control,
                               required = false,
                               disabled = false,
                               clearable = false,
                               className,
                               leftIcon: LeftIcon,
                               ...props
                           }: InputFieldProps<T, TOutput>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <Field
                    data-invalid={fieldState.invalid ? 'true' : undefined}
                    className={cn('w-full', className)}
                >
                    {label && (
                        <FieldLabel htmlFor={name}>
                            {label}
                            {required && <span className="ml-1 text-destructive">*</span>}
                        </FieldLabel>
                    )}

                    {description && <FieldDescription>{description}</FieldDescription>}

                    <div className="relative flex items-center group">
                        {/* Left Icon Logic */}
                        {LeftIcon && (
                            <div
                                className="absolute left-3 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-foreground">
                                <LeftIcon size={18} strokeWidth={2}/>
                            </div>
                        )}

                        <Input
                            {...props}
                            {...field}
                            id={name}
                            disabled={disabled}
                            value={field.value ?? ''}
                            aria-invalid={fieldState.invalid}
                            className={cn(
                                'bg-background w-full transition-all',
                                LeftIcon && 'pl-10',
                                clearable && field.value && 'pr-10',
                            )}
                        />

                        {/* Clearable Button Logic */}
                        {clearable && field.value && !disabled && (
                            <button
                                type="button"
                                onClick={() => field.onChange('')}
                                className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                aria-label="Clear input"
                            >
                                <X size={14}/>
                            </button>
                        )}
                    </div>

                    {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}

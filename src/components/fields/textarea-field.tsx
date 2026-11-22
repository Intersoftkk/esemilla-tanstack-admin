'use client'

import type {Control, FieldPath, FieldValues} from 'react-hook-form'
import {Controller} from 'react-hook-form'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field'
import {Textarea} from '@/components/ui/textarea'
import {cn} from '@/lib/utils'
import React from 'react'

interface TextareaFieldProps<T extends FieldValues, TOutput>
    extends React.InputHTMLAttributes<HTMLInputElement> {
    name: FieldPath<T>
    label: string
    description?: string
    placeholder?: string
    control: Control<T, any, TOutput>
    required?: boolean
    disabled?: boolean
    rows?: number
}

export function TextareaField<T extends FieldValues, TOutput = T>({
                                  name,
                                  label,
                                  description,
                                  placeholder = '',
                                  control,
                                  required = false,
                                  disabled = false,
                                  className,
                                  rows = 4,
                              }: TextareaFieldProps<T, TOutput>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => (
                <Field
                    data-invalid={fieldState.invalid ? 'true' : undefined}
                    className={cn(
                        'w-full min-w-0 space-y-1.5',
                        className,
                    )}
                >
                    <FieldLabel
                        htmlFor={name}
                        className="flex flex-wrap items-center gap-0.5 break-words"
                    >
                        <span className="min-w-0 break-words">
                            {label}
                        </span>

                        {required && (
                            <span className="shrink-0 text-destructive">
                                *
                            </span>
                        )}
                    </FieldLabel>

                    {description && (
                        <FieldDescription className="break-words">
                            {description}
                        </FieldDescription>
                    )}

                    <Textarea
                        {...field}
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows}
                        value={field.value ?? ''}
                        aria-invalid={fieldState.invalid}
                        className={cn(
                            'w-full min-w-0 max-w-full resize-y',
                            'break-words whitespace-pre-wrap',
                            'overflow-x-hidden',
                        )}
                    />

                    {fieldState.error && (
                        <FieldError className="break-words">
                            {fieldState.error.message}
                        </FieldError>
                    )}
                </Field>
            )}
        />
    )
}
'use client'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Option } from '#/types'

interface SelectFieldProps {
  name?: string
  label?: string
  description?: string
  options: Array<Option>
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  isLoading?: boolean
  disabled?: boolean
  isInvalid?: boolean
  errors?: unknown[]
  className?: string
}

function firstErrorMessage(errors: unknown[] | undefined): string | undefined {
  const first = errors?.[0]
  if (typeof first === 'string') return first
  if (
    typeof first === 'object' &&
    first !== null &&
    'message' in first &&
    typeof first.message === 'string'
  ) {
    return first.message
  }
  return undefined
}

/**
 * Controlled select field. The parent owns the value (and any form wiring),
 * so this works with TanStack Form render props as well as plain state.
 */
export function SelectField({
  name,
  label,
  description,
  options,
  placeholder = 'Select an option...',
  value,
  onChange,
  required = false,
  isLoading = false,
  disabled = false,
  isInvalid = false,
  errors,
  className,
}: SelectFieldProps) {
  const errorMessage = firstErrorMessage(errors)
  const invalid = isInvalid || Boolean(errorMessage)

  return (
    <Field
      data-invalid={invalid ? 'true' : undefined}
      className={cn('w-full', className)}
    >
      {label && (
        <FieldLabel htmlFor={name}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </FieldLabel>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}

      <Select
        name={name}
        value={value}
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id={name} className="w-full bg-background">
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {placeholder && <SelectLabel>{placeholder}</SelectLabel>}

            {options.map((opt, index) => {
              // Fallback logic for various ID/Value formats
              const optValue = (opt.value ?? opt.id ?? '').toString()
              const optLabel = opt.label ?? opt.name ?? optValue

              return (
                <SelectItem
                  key={`${optValue}-${index}`}
                  value={optValue}
                  disabled={opt.disabled}
                >
                  {optLabel}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {invalid && errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  )
}

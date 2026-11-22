'use client'

import React from 'react'
import type {Control} from 'react-hook-form';
import {Controller} from 'react-hook-form'
import {Check, ChevronsUpDown} from 'lucide-react'
import {cn} from '#/lib/utils'

import {Field, FieldDescription, FieldError, FieldLabel,} from '#/components/ui/field'
import {Button} from '#/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '#/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger,} from '#/components/ui/popover'
import type {Option} from "#/types";

interface SearchableSelectFieldProps {
    name: string
    label: string
    description?: string
    options: Array<Option>
    placeholder?: string
    control: Control<any>
    required?: boolean
    disabled?: boolean
    isLoading?: boolean
    onChange?: (value: string) => void
}

export function SearchableSelectField({
                                          name,
                                          label,
                                          description,
                                          options,
                                          placeholder = 'Select an option...',
                                          control,
                                          required = false,
                                          disabled = false,
                                          isLoading = false,
                                          onChange,
                                      }: SearchableSelectFieldProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => {
                const selectedOption = options.find((opt) => opt.value === field.value)
                const displayValue = selectedOption?.label || placeholder

                return (
                    <Field data-invalid={fieldState.invalid ? 'true' : undefined}>
                        <FieldLabel>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FieldLabel>

                        {description && <FieldDescription>{description}</FieldDescription>}

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled={disabled || isLoading}
                                    className="w-full justify-between"
                                >
                  <span className="truncate text-left">
                    {isLoading ? 'Loading...' : displayValue}
                  </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-[--radix-popover-trigger-width] p-0"
                                align="start"
                                sideOffset={8}
                            >
                                <Command>
                                    <CommandInput
                                        placeholder={`Search ${label.toLowerCase()}...`}
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>

                                        <CommandGroup>
                                            {options.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={String(option.value)}
                                                    onSelect={(value) => {
                                                        field.onChange(value)
                                                        onChange?.(value)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            field.value === option.value
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                    {option.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>

                                        {field.value && (
                                            <>
                                                <CommandSeparator/>
                                                <CommandGroup>
                                                    <CommandItem
                                                        onSelect={() => {
                                                            field.onChange('')
                                                            onChange?.('')
                                                            setOpen(false)
                                                        }}
                                                        className="justify-center text-center text-sm text-muted-foreground"
                                                    >
                                                        Clear selection
                                                    </CommandItem>
                                                </CommandGroup>
                                            </>
                                        )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )
            }}
        />
    )
}

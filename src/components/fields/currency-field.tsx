'use client'

import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as countryInfo from 'country-js'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface CountryFieldProps {
    name: string
    label: string
    description?: string
    placeholder?: string
    control: Control<any>
    required?: boolean
    isLoading?: boolean
    disabled?: boolean
}

function getFlagEmoji(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) return ''
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}

function toTitleCase(str: string): string {
    if (!str) return ''
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function CountryField({
                                 name,
                                 label,
                                 description,
                                 placeholder = 'Select country...',
                                 control,
                                 required = false,
                                 isLoading = false,
                                 disabled = false,
                             }: CountryFieldProps) {
    const [open, setOpen] = React.useState(false)

    const sortedCountries = React.useMemo(() => {
        try {
            const countries = countryInfo.getAll() || []
            return countries
                .map((c: countryInfo.Country) => {
                    const titleName = toTitleCase(c.name)
                    const flag = getFlagEmoji(c.code)
                    return {
                        value: c.code,
                        label: flag ? `${flag}  ${titleName}` : titleName,
                        name: titleName,
                        code: c.code,
                        capital: c.capital ? toTitleCase(c.capital) : '',
                        phone: c.phone ? `+${c.phone.replace(/^\+/, '')}` : '',
                    }
                })
                .sort((a, b) => a.name.localeCompare(b.name))
        } catch {
            return []
        }
    }, [])

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const selected = sortedCountries.find(
                    (opt) => opt.value === field.value
                )

                const displayValue = selected?.label || placeholder
                const hasValue = !!field.value

                const clearValue = () => {
                    field.onChange('')
                    setOpen(false)
                }

                return (
                    <Field data-invalid={fieldState.invalid ? 'true' : undefined}>
                        <FieldLabel>
                            {label}
                            {required && (
                                <span className="text-destructive ml-1">*</span>
                            )}
                        </FieldLabel>

                        {description && (
                            <FieldDescription>{description}</FieldDescription>
                        )}

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled={disabled || isLoading}
                                    className="w-full justify-between font-normal"
                                >
                                    <span className="truncate text-left">
                                        {isLoading ? 'Loading...' : displayValue}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search country..."
                                        disabled={disabled || isLoading}
                                    />

                                    <CommandList>
                                        <CommandEmpty>No country found.</CommandEmpty>

                                        <CommandGroup>
                                            {sortedCountries.map((option) => {
                                                const isSelected =
                                                    field.value === option.value

                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={`${option.name} ${option.value} ${option.capital} ${option.phone}`}
                                                        onSelect={() => {
                                                            field.onChange(option.value)
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <span>{option.label}</span>
                                                        <Check
                                                            className={cn(
                                                                'ml-auto h-4 w-4',
                                                                isSelected
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                    </CommandItem>
                                                )
                                            })}
                                        </CommandGroup>
                                    </CommandList>

                                    {hasValue && (
                                        <>
                                            <CommandSeparator />
                                            <CommandGroup>
                                                <CommandItem
                                                    value="__clear__"
                                                    onSelect={clearValue}
                                                    className="justify-center text-center text-destructive cursor-pointer"
                                                >
                                                    Clear selected country
                                                </CommandItem>
                                            </CommandGroup>
                                        </>
                                    )}
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
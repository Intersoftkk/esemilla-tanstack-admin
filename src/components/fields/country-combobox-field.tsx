'use client'

import { useState, useMemo } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as countryInfo from 'country-js'
import {
    Check,
    ChevronsUpDown,
    Globe,
    Loader2,
    Search,
    X,
} from 'lucide-react'

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

export interface CountryComboboxFieldProps<T extends FieldValues = FieldValues, TOutput = T> {
    name: FieldPath<T>
    label: string
    description?: string
    placeholder?: string
    control: Control<T, any, TOutput>
    required?: boolean
    isLoading?: boolean
    disabled?: boolean
}

export interface FormattedCountry {
    code: string
    name: string
    formattedName: string
    flag: string
    capital: string
    phoneCode: string
    currencyCode: string
    currencySymbol: string
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

export function CountryComboboxField<T extends FieldValues = FieldValues, TOutput = T>({
                                         name,
                                         label,
                                         description,
                                         placeholder = 'Select country...',
                                         control,
                                         required = false,
                                         isLoading = false,
                                         disabled = false,
                                     }: CountryComboboxFieldProps<T, TOutput>) {
    const [open, setOpen] = useState(false)

    const countries = useMemo<FormattedCountry[]>(() => {
        try {
            const list = countryInfo.getAll()
            if (!Array.isArray(list)) return []

            return list
                .map((item: countryInfo.Country) => ({
                    code: item.code,
                    name: item.name,
                    formattedName: toTitleCase(item.name),
                    flag: getFlagEmoji(item.code),
                    capital: item.capital ? toTitleCase(item.capital) : '',
                    phoneCode: item.phone ? `+${item.phone.replace(/^\+/, '')}` : '',
                    currencyCode: item.currency?.currencyCode || '',
                    currencySymbol: item.currency?.currencySymbol || '',
                }))
                .sort((a, b) => a.formattedName.localeCompare(b.formattedName))
        } catch {
            return []
        }
    }, [])

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const selectedCountry = countries.find(
                    (c) => c.code.toUpperCase() === String(field.value ?? '').toUpperCase()
                )

                const handleSelect = (countryCode: string) => {
                    field.onChange(countryCode)
                    setOpen(false)
                }

                const handleClear = () => {
                    field.onChange('')
                    setOpen(false)
                }

                return (
                    <Field data-invalid={fieldState.invalid ? 'true' : undefined}>
                        {label && (
                            <FieldLabel>
                                {label}
                                {required && (
                                    <span className="ml-1 text-destructive">*</span>
                                )}
                            </FieldLabel>
                        )}

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
                                    className={cn(
                                        'w-full justify-between font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading countries...
                                        </span>
                                    ) : selectedCountry ? (
                                        <SelectedDisplay country={selectedCountry} />
                                    ) : (
                                        <span className="truncate">{placeholder}</span>
                                    )}

                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-(--radix-popover-trigger-width) p-0"
                                align="start"
                            >
                                <Command>
                                    <div className="flex w-full items-center border-b px-3">
                                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                        <CommandInput
                                            placeholder={`Search ${label.toLowerCase()}...`}
                                            className="h-9 w-full border-0 bg-transparent focus:ring-0"
                                        />
                                    </div>

                                    <CommandList className="max-h-64">
                                        {/* Loading State */}
                                        {isLoading && (
                                            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading countries...
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {!isLoading && (
                                            <CommandEmpty>
                                                <div className="flex flex-col items-center gap-1.5 py-2">
                                                    <Globe className="h-5 w-5 text-muted-foreground/50" />
                                                    <span className="text-xs">No countries found</span>
                                                </div>
                                            </CommandEmpty>
                                        )}

                                        {/* Country List */}
                                        {!isLoading && countries.length > 0 && (
                                            <CommandGroup>
                                                {countries.map((country) => (
                                                    <CountryItem
                                                        key={country.code}
                                                        country={country}
                                                        isSelected={
                                                            country.code.toUpperCase() ===
                                                            String(field.value ?? '').toUpperCase()
                                                        }
                                                        onSelect={() => handleSelect(country.code)}
                                                    />
                                                ))}
                                            </CommandGroup>
                                        )}
                                    </CommandList>

                                    {/* Clear Selection */}
                                    {field.value && !isLoading && (
                                        <>
                                            <CommandSeparator />
                                            <CommandGroup>
                                                <CommandItem
                                                    value="__clear_selection__"
                                                    onSelect={handleClear}
                                                    className="justify-center text-center text-destructive cursor-pointer"
                                                >
                                                    <X className="mr-1.5 h-3.5 w-3.5" />
                                                    Clear selection
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

function SelectedDisplay({ country }: { country: FormattedCountry }) {
    return (
        <span className="flex items-center gap-2 truncate">
            {country.flag ? (
                <span className="shrink-0 text-base leading-none">{country.flag}</span>
            ) : (
                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}

            <span className="truncate font-medium">{country.formattedName}</span>

            {country.code && (
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {country.code}
                </span>
            )}
        </span>
    )
}

function CountryItem({
                         country,
                         isSelected,
                         onSelect,
                     }: {
    country: FormattedCountry
    isSelected: boolean
    onSelect: () => void
}) {

    const subtitleParts: string[] = []
    if (country.phoneCode) subtitleParts.push(country.phoneCode)
    if (country.currencyCode) subtitleParts.push(country.currencyCode)
    if (country.capital) subtitleParts.push(country.capital)
    const subtitle = subtitleParts.join(' · ')

    const searchValue = `${country.formattedName} ${country.name} ${country.code} ${country.capital} ${country.phoneCode} ${country.currencyCode}`

    return (
        <CommandItem
            value={searchValue}
            onSelect={onSelect}
            className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer"
        >
            {/* Flag Emoji */}
            <span className="shrink-0 text-base leading-none">
                {country.flag || <Globe className="h-4 w-4 text-muted-foreground/50" />}
            </span>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'truncate text-sm',
                            isSelected ? 'font-semibold' : 'font-medium'
                        )}
                    >
                        {country.formattedName}
                    </span>

                    {country.code && (
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {country.code}
                        </span>
                    )}
                </div>

                {subtitle && (
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Check mark */}
            <Check
                className={cn(
                    'h-4 w-4 shrink-0',
                    isSelected ? 'opacity-100' : 'opacity-0'
                )}
            />
        </CommandItem>
    )
}
'use client'

import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import * as countryInfo from 'country-js'
import { Check, ChevronsUpDown, Phone } from 'lucide-react'
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

// ============================================================================
// TYPES & HELPERS
// ============================================================================

export interface PhoneCodeOption {
    iso2: string
    code: string // "+1", "+91", etc.
    name: string
    flag: string
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

function normalizeDialCode(code?: string | null): string {
    if (!code) return ''
    const digits = String(code).replace(/\D/g, '')
    return digits ? `+${digits}` : ''
}

function getPhoneCodeOptions(): PhoneCodeOption[] {
    try {
        const countries = countryInfo.getAll() || []
        const optionsMap = new Map<string, PhoneCodeOption>()

        countries.forEach((c: countryInfo.Country) => {
            if (!c.phone || !c.code) return
            const dial = normalizeDialCode(c.phone)
            const titleName = toTitleCase(c.name)

            if (!optionsMap.has(c.code)) {
                optionsMap.set(c.code, {
                    iso2: c.code,
                    code: dial,
                    name: titleName,
                    flag: getFlagEmoji(c.code),
                })
            }
        })

        return Array.from(optionsMap.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        )
    } catch {
        return []
    }
}

// ============================================================================
// OPTION ROW SUB-COMPONENT
// ============================================================================

function PhoneCodeOptionRow({
                                option,
                                isSelected,
                                onSelect,
                            }: {
    option: PhoneCodeOption
    isSelected: boolean
    onSelect: () => void
}) {
    return (
        <CommandItem
            value={`${option.name} ${option.code} ${option.iso2}`}
            onSelect={onSelect}
            className="flex cursor-pointer items-center gap-2.5"
        >
            <span className="shrink-0 text-base leading-none">{option.flag}</span>
            <span className="min-w-0 flex-1 truncate text-sm">{option.name}</span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {option.code}
            </span>
            <Check
                className={cn(
                    'h-3.5 w-3.5 shrink-0',
                    isSelected ? 'text-primary opacity-100' : 'opacity-0'
                )}
            />
        </CommandItem>
    )
}

// ============================================================================
// COMPONENT
// ============================================================================

interface PhoneCodeFieldProps {
    name: string
    label: string
    description?: string
    placeholder?: string
    control: Control<any>
    required?: boolean
    disabled?: boolean
}

export function PhoneCodeField({
                                   name,
                                   label,
                                   description,
                                   placeholder = 'Code',
                                   control,
                                   required = false,
                                   disabled = false,
                               }: PhoneCodeFieldProps) {
    const [open, setOpen] = React.useState(false)

    const allOptions = React.useMemo(() => getPhoneCodeOptions(), [])

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const selected = allOptions.find(
                    (opt) => opt.code === normalizeDialCode(field.value)
                )

                const hasValue = !!field.value

                const handleSelect = (opt: PhoneCodeOption) => {
                    field.onChange(opt.code)
                    setOpen(false)
                }

                const handleClear = () => {
                    field.onChange('')
                    setOpen(false)
                }

                return (
                    <Field data-invalid={fieldState.invalid ? 'true' : undefined}>
                        <FieldLabel>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
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
                                    disabled={disabled}
                                    className={cn(
                                        'w-full justify-between font-normal',
                                        !hasValue && 'text-muted-foreground'
                                    )}
                                >
                                    {selected ? (
                                        <span className="flex items-center gap-2 truncate">
                                            <span>{selected.flag}</span>
                                            <span className="font-mono text-sm">{selected.code}</span>
                                            <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                                                {selected.name}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5 opacity-50" />
                                            {placeholder}
                                        </span>
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="p-0 w-[320px]"
                                align="start"
                                side="bottom"
                            >
                                <Command>
                                    <CommandInput placeholder="Search country or code…" />

                                    <CommandList className="max-h-70">
                                        <CommandEmpty>
                                            <div className="flex flex-col items-center gap-1.5 py-4 text-muted-foreground">
                                                <Phone className="h-5 w-5 opacity-40" />
                                                <p className="text-xs">No country found</p>
                                            </div>
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {allOptions.map((opt) => (
                                                <PhoneCodeOptionRow
                                                    key={`${opt.iso2}-${opt.code}`}
                                                    option={opt}
                                                    isSelected={field.value === opt.code}
                                                    onSelect={() => handleSelect(opt)}
                                                />
                                            ))}
                                        </CommandGroup>
                                    </CommandList>

                                    {hasValue && (
                                        <>
                                            <CommandSeparator />
                                            <CommandGroup>
                                                <CommandItem
                                                    value="__clear__"
                                                    onSelect={handleClear}
                                                    className="justify-center text-center text-destructive text-xs cursor-pointer"
                                                >
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

export default PhoneCodeField
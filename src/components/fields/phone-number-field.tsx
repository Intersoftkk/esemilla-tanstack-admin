'use client'

import React from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { useController } from 'react-hook-form'
import * as countryInfo from 'country-js'
import { Check, ChevronsUpDown, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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

export interface PhoneCodeOption {
    iso2: string
    code: string
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

function digitsOnly(val?: string | null): string {
    return val ? String(val).replace(/\D/g, '') : ''
}

function normalizeDialCode(code?: string | null): string {
    if (!code) return ''
    const digits = digitsOnly(code)
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

function detectFromInternational(input: string, options: PhoneCodeOption[]) {
    const raw = input.trim()
    if (!/^(?:\+|00)/.test(raw)) return null

    const digits = digitsOnly(raw)
    if (!digits) return null

    const sorted = [...options].sort((a, b) => digitsOnly(b.code).length - digitsOnly(a.code).length)
    const match = sorted.find((opt) => digits.startsWith(digitsOnly(opt.code)))

    if (match) {
        const codeDigits = digitsOnly(match.code)
        return {
            iso2: match.iso2,
            dialCode: match.code,
            name: match.name,
            phoneNumber: digits.slice(codeDigits.length),
        }
    }

    return null
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

interface PhoneNumberFieldProps<T extends FieldValues = FieldValues> {
    control: Control<T>
    dialCodeName: Path<T>
    phoneName: Path<T>
    label: string
    description?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    className?: string
    searchPlaceholder?: string
    dropdownWidth?: string
    autoDetectCountry?: boolean
    onCountryDetected?: (payload: { iso2: string; dialCode: string; name?: string }) => void
}

export function PhoneNumberField<T extends FieldValues = FieldValues>({
                                                                          control,
                                                                          dialCodeName,
                                                                          phoneName,
                                                                          label,
                                                                          description,
                                                                          placeholder = 'Enter phone number',
                                                                          required = false,
                                                                          disabled = false,
                                                                          className,
                                                                          searchPlaceholder = 'Search country or code…',
                                                                          dropdownWidth = '320px',
                                                                          autoDetectCountry = true,
                                                                          onCountryDetected,
                                                                      }: PhoneNumberFieldProps<T>) {
    const [open, setOpen] = React.useState(false)

    const dialCodeController = useController({ control, name: dialCodeName })
    const phoneController = useController({ control, name: phoneName })

    const dialCodeField = dialCodeController.field
    const dialCodeState = dialCodeController.fieldState
    const phoneField = phoneController.field
    const phoneState = phoneController.fieldState

    const allOptions = React.useMemo(() => getPhoneCodeOptions(), [])

    const selected = allOptions.find(
        (opt) => opt.code === normalizeDialCode(dialCodeField.value)
    )

    const hasError = Boolean(dialCodeState.error || phoneState.error)
    const errorMessage = dialCodeState.error?.message ?? phoneState.error?.message

    const applyDetectedCountry = React.useCallback(
        (detected: { iso2: string; dialCode: string; name: string; phoneNumber: string }) => {
            const changed = normalizeDialCode(dialCodeField.value) !== detected.dialCode

            dialCodeField.onChange(detected.dialCode)
            phoneField.onChange(detected.phoneNumber)

            if (changed) {
                onCountryDetected?.({
                    iso2: detected.iso2,
                    dialCode: detected.dialCode,
                    name: detected.name,
                })
            }
        },
        [dialCodeField, phoneField, onCountryDetected]
    )

    const handleSelectCountry = (option: PhoneCodeOption) => {
        dialCodeField.onChange(option.code)

        const digits = digitsOnly(phoneField.value)
        const cc = digitsOnly(option.code)

        if (cc && digits.startsWith(cc) && digits.length > cc.length) {
            phoneField.onChange(digits.slice(cc.length))
        }

        setOpen(false)
    }

    const handleClearDialCode = () => {
        dialCodeField.onChange('')
        setOpen(false)
    }

    const handleClearPhone = () => {
        phoneField.onChange('')
    }

    const handlePhoneChange = (raw: string) => {
        if (/^(?:\+|00)/.test(raw.trim()) && autoDetectCountry) {
            const detected = detectFromInternational(raw, allOptions)
            if (detected) {
                applyDetectedCountry(detected)
                return
            }
        }
        phoneField.onChange(digitsOnly(raw))
    }

    const handlePhonePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const text = event.clipboardData.getData('text')
        if (autoDetectCountry) {
            const detected = detectFromInternational(text, allOptions)
            if (detected) {
                event.preventDefault()
                applyDetectedCountry(detected)
            }
        }
    }

    return (
        <Field data-invalid={hasError ? 'true' : undefined} className={className}>
            <FieldLabel>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </FieldLabel>

            {description && <FieldDescription>{description}</FieldDescription>}

            <div className="flex w-full items-stretch">
                {/* Dial Code Picker */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            role="combobox"
                            aria-expanded={open}
                            disabled={disabled}
                            className={cn(
                                'inline-flex h-10 shrink-0 items-center justify-center gap-2',
                                'rounded-l-md rounded-r-none border border-input bg-background px-3 text-sm shadow-xs',
                                'transition-colors hover:bg-accent hover:text-accent-foreground',
                                'focus-visible:z-10 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                                hasError && 'border-destructive'
                            )}
                        >
                            {selected ? (
                                <>
                                    <span>{selected.flag}</span>
                                    <span className="font-mono text-sm leading-none">
                                        {selected.code}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Phone className="h-4 w-4 opacity-50" />
                                    <span className="text-sm leading-none">Code</span>
                                </>
                            )}
                            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="p-0"
                        style={{ width: dropdownWidth }}
                        align="start"
                        side="bottom"
                    >
                        <Command>
                            <CommandInput placeholder={searchPlaceholder} />

                            <CommandList className="max-h-70">
                                <CommandEmpty>
                                    <div className="flex flex-col items-center gap-1.5 py-4 text-muted-foreground">
                                        <Phone className="h-5 w-5 opacity-40" />
                                        <p className="text-xs">No country found</p>
                                    </div>
                                </CommandEmpty>

                                <CommandGroup>
                                    {allOptions.map((option) => (
                                        <PhoneCodeOptionRow
                                            key={`${option.iso2}-${option.code}`}
                                            option={option}
                                            isSelected={dialCodeField.value === option.code}
                                            onSelect={() => handleSelectCountry(option)}
                                        />
                                    ))}
                                </CommandGroup>
                            </CommandList>

                            {dialCodeField.value && (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        <CommandItem
                                            value="__clear__"
                                            onSelect={handleClearDialCode}
                                            className="justify-center text-center text-destructive cursor-pointer"
                                        >
                                            Clear selected value
                                        </CommandItem>
                                    </CommandGroup>
                                </>
                            )}
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* National Phone Input */}
                <div className="relative -ml-px min-w-0 flex-1">
                    <Input
                        ref={phoneField.ref}
                        name={phoneField.name}
                        value={phoneField.value ?? ''}
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        onBlur={phoneField.onBlur}
                        onPaste={handlePhonePaste}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        disabled={disabled}
                        placeholder={placeholder}
                        aria-invalid={hasError ? true : undefined}
                        className={cn(
                            'h-10 rounded-l-none rounded-r-md border-input bg-background pr-8 shadow-xs',
                            'focus-visible:z-10',
                            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                            hasError && 'border-destructive'
                        )}
                    />

                    {phoneField.value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClearPhone}
                            className="absolute right-2 top-1/2 z-20 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                            tabIndex={-1}
                            aria-label="Clear phone number"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Field>
    )
}

export default PhoneNumberField
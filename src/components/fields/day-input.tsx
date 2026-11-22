'use client'

import React from 'react'
import type {Control} from 'react-hook-form';
import {Controller} from 'react-hook-form'
import {Check} from 'lucide-react'
import {cn} from '@/lib/utils'

import {Field, FieldDescription, FieldError, FieldLabel,} from '@/components/ui/field'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'

const weekdays: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
}

interface DayFieldProps {
    name: string
    control: Control<any>
    label?: string
    description?: string
    placeholder?: string
    required?: boolean
    multiple?: boolean
    disabled?: boolean

    [key: string]: any
}

export function DayField({
                             name,
                             control,
                             label,
                             description,
                             placeholder = 'Select day(s)',
                             required = false,
                             multiple = false,
                             disabled = false,
                             ...props
                         }: DayFieldProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Controller
            control={control}
            name={name}
            render={({field, fieldState}) => {
                const selectedValues: Set<string> = multiple
                    ? new Set(Array.isArray(field.value) ? field.value : [])
                    : field.value
                        ? new Set([field.value])
                        : new Set()

                const handleSelect = (key: string) => {
                    if (multiple) {
                        const newSet = new Set(selectedValues)
                        if (newSet.has(key)) {
                            newSet.delete(key)
                        } else {
                            newSet.add(key)
                        }
                        field.onChange(Array.from(newSet))
                    } else {
                        field.onChange(field.value === key ? '' : key)
                        setOpen(false)
                    }
                }

                const handleSelectAll = () =>
                    multiple && field.onChange(Object.keys(weekdays))
                const handleDeselectAll = () => multiple && field.onChange([])

                const displayContent =
                    selectedValues.size === 0 ? (
                        <span className="text-muted-foreground">{placeholder}</span>
                    ) : multiple ? (
                        <div className="flex flex-wrap gap-1">
                            {[...selectedValues].map((day) => (
                                <Badge
                                    key={day}
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal"
                                >
                                    {weekdays[day]}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        weekdays[[...selectedValues][0]]
                    )

                return (
                    <Field
                        data-invalid={fieldState.invalid ? 'true' : undefined}
                        {...props}
                    >
                        {label && (
                            <FieldLabel>
                                {label}
                                {required && <span className="text-destructive ml-1">*</span>}
                            </FieldLabel>
                        )}

                        {description && <FieldDescription>{description}</FieldDescription>}

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={disabled}
                                    className="h-auto min-h-9 w-full justify-start text-left font-normal"
                                >
                                    {displayContent}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandInput placeholder={placeholder}/>
                                    <CommandList>
                                        <CommandEmpty>No days found.</CommandEmpty>

                                        <CommandGroup>
                                            {Object.entries(weekdays).map(([key, dayLabel]) => (
                                                <CommandItem
                                                    key={key}
                                                    value={key}
                                                    onSelect={() => handleSelect(key)}
                                                    disabled={disabled}
                                                >
                                                    {dayLabel}
                                                    <Check
                                                        className={cn(
                                                            'ml-auto h-4 w-4',
                                                            selectedValues.has(key)
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>

                                        {multiple && (
                                            <>
                                                <CommandSeparator/>
                                                <CommandGroup>
                                                    <CommandItem
                                                        onSelect={handleSelectAll}
                                                        className="justify-center text-center"
                                                    >
                                                        Select All
                                                    </CommandItem>
                                                    {selectedValues.size > 0 && (
                                                        <>
                                                            <CommandSeparator/>
                                                            <CommandItem
                                                                onSelect={handleDeselectAll}
                                                                className="justify-center text-center"
                                                            >
                                                                Deselect All
                                                            </CommandItem>
                                                        </>
                                                    )}
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

'use client'

import {format} from 'date-fns'
import {CalendarIcon} from 'lucide-react'
import {cn} from '@/lib/utils'

import {Button} from '@/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import {MonthRangePicker} from '@/components/ui/month-range-picker'

interface MonthRangePickerFieldProps {
    value?: { start?: Date; end?: Date }
    onChange: (range: { start?: Date; end?: Date }) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function MonthRangePickerField({
                                          value,
                                          onChange,
                                          placeholder = 'Pick a month range',
                                          className,
                                          disabled = false,
                                      }: MonthRangePickerFieldProps) {
    const displayText =
        value?.start && value?.end
            ? `${format(value.start, 'MMM yyyy')} - ${format(value.end, 'MMM yyyy')}`
            : placeholder

    const hasValue = value?.start && value?.end

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'justify-start text-left font-normal',
                        !hasValue && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {hasValue ? displayText : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <MonthRangePicker
                    selectedMonthRange={
                        value?.start && value?.end
                            ? {start: value.start, end: value.end}
                            : undefined
                    }
                    onMonthRangeSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    )
}

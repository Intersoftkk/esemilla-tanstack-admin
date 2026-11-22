import {format, isValid, startOfDay} from 'date-fns'
import {CalendarIcon} from 'lucide-react'
import React from 'react'
import {cn} from '#/lib/utils'
import {Button} from '#/components/ui/button'
import {Calendar} from '#/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger,} from '#/components/ui/popover'

interface DatePickerProps {
    value: Date | string | undefined
    onChange: (date: string | undefined) => void
    placeholder?: string
    fromYear?: number
    toYear?: number
    disabled?: boolean
}

export function DatePicker({
                               value,
                               onChange,
                               placeholder = 'Pick a date',
                               disabled = false,
                           }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    const selectedDate = React.useMemo(() => {
        if (!value) return undefined
        const d = typeof value === 'string' ? new Date(value) : value
        return isValid(d) ? d : undefined
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {selectedDate ? (
                        format(selectedDate, 'PPP')
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectedDate}
                    onSelect={(selected: Date | undefined) => {
                        if (selected && isValid(selected)) {
                            const normalizedDate = startOfDay(selected)
                            onChange(format(normalizedDate, 'yyyy-MM-dd'))
                        } else {
                            onChange(undefined)
                        }
                        setOpen(false)
                    }}
                    disabled={disabled}
                    className="bg-white [&_select]:border [&_select]:border-gray-300 [&_select]:p-1"
                />
            </PopoverContent>
        </Popover>
    )
}

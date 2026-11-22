import {format, isValid, parse, set} from 'date-fns'
import {ClockIcon} from 'lucide-react'
import React from 'react'
import {cn} from '#/lib/utils'
import {Button} from '#/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger} from '#/components/ui/popover'

interface ClockPickerProps {
    value: string | undefined // Expected format: HH:mm:ss (e.g., "14:07:30")
    onChange: (time: string | undefined) => void
    placeholder?: string
    disabled?: boolean
}

export default function ClockPicker({
                                        value,
                                        onChange,
                                        placeholder = 'Pick a time',
                                        disabled = false,
                                    }: ClockPickerProps) {
    const [open, setOpen] = React.useState(false)

    // Parse the input value (HH:mm:ss) into a Date object with error handling
    const parseTime = (value: string | undefined): Date | undefined => {
        if (!value) return undefined
        try {
            const parsed = parse(value, 'HH:mm:ss', new Date())
            return isValid(parsed) ? parsed : undefined
        } catch (error) {
            console.warn(`Invalid time format for value: ${value}`)
            return undefined
        }
    }

    const selectedTime = parseTime(value)

    // Generate hour, minute, second options (24-hour format)
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) // 00–23
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
    const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

    // Handle time selection
    const handleTimeChange = (hour: string, minute: string, second: string) => {
        const newTime = set(new Date(), {
            hours: parseInt(hour),
            minutes: parseInt(minute),
            seconds: parseInt(second),
        })
        if (isValid(newTime)) {
            onChange(format(newTime, 'HH:mm:ss'))
        } else {
            onChange(undefined)
        }
    }

    const selectBase =
        'h-9 rounded-md border px-2 text-sm outline-none transition-colors ' +
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
        'disabled:cursor-not-allowed disabled:opacity-50 ' +
        // light
        'border-input bg-background text-foreground ' +
        // dark
        'dark:border-input dark:bg-background dark:text-foreground'

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedTime && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {selectedTime ? format(selectedTime, 'HH:mm:ss') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>

            {/* dark mode for popover */}
            <PopoverContent
                className={cn(
                    'w-auto p-4',
                    'bg-popover text-popover-foreground border border-border shadow-md',
                    'dark:bg-popover dark:text-popover-foreground dark:border-border',
                )}
                align="start"
            >
                <div className="flex space-x-2">
                    {/* Hour */}
                    <select
                        className={selectBase}
                        value={selectedTime ? format(selectedTime, 'HH') : ''}
                        onChange={(e) =>
                            handleTimeChange(
                                e.target.value,
                                selectedTime ? format(selectedTime, 'mm') : '00',
                                selectedTime ? format(selectedTime, 'ss') : '00',
                            )
                        }
                        disabled={disabled}
                    >
                        <option value="" disabled>
                            Hour
                        </option>
                        {hours.map((hour) => (
                            <option key={hour} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>

                    {/* Minute */}
                    <select
                        className={selectBase}
                        value={selectedTime ? format(selectedTime, 'mm') : ''}
                        onChange={(e) =>
                            handleTimeChange(
                                selectedTime ? format(selectedTime, 'HH') : '00',
                                e.target.value,
                                selectedTime ? format(selectedTime, 'ss') : '00',
                            )
                        }
                        disabled={disabled}
                    >
                        <option value="" disabled>
                            Minute
                        </option>
                        {minutes.map((minute) => (
                            <option key={minute} value={minute}>
                                {minute}
                            </option>
                        ))}
                    </select>

                    {/* Second */}
                    <select
                        className={selectBase}
                        value={selectedTime ? format(selectedTime, 'ss') : ''}
                        onChange={(e) =>
                            handleTimeChange(
                                selectedTime ? format(selectedTime, 'HH') : '00',
                                selectedTime ? format(selectedTime, 'mm') : '00',
                                e.target.value,
                            )
                        }
                        disabled={disabled}
                    >
                        <option value="" disabled>
                            Second
                        </option>
                        {seconds.map((second) => (
                            <option key={second} value={second}>
                                {second}
                            </option>
                        ))}
                    </select>
                </div>
            </PopoverContent>
        </Popover>
    )
}

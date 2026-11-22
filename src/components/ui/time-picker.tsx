import {format, isValid, parse, set} from 'date-fns'
import {ClockIcon} from 'lucide-react'
import React from 'react'
import {cn} from '#/lib/utils'
import {Button} from '#/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger} from '#/components/ui/popover'

interface TimePickerProps {
    value: string | undefined
    onChange: (time: string | undefined) => void
    placeholder?: string
    disabled?: boolean
}

export default function TimePicker({
                                       value,
                                       onChange,
                                       placeholder = 'Pick a time',
                                       disabled = false,
                                   }: TimePickerProps) {
    const [open, setOpen] = React.useState(false)

    const parseTime = (value: string | undefined): Date | undefined => {
        if (!value) return undefined
        const parsed = parse(value, 'HH:mm:ss', new Date())
        return isValid(parsed) ? parsed : undefined
    }

    const selectedTime = parseTime(value)

    const hours = Array.from({ length: 12 }, (_, i) =>
        (i || 12).toString().padStart(2, '0'),
    )
    const minutes = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, '0'),
    )
    const periods = ['AM', 'PM']

    const handleTimeChange = (hour: string, minute: string, period: string) => {
        let adjustedHour = parseInt(hour)

        if (period === 'PM' && adjustedHour !== 12) adjustedHour += 12
        if (period === 'AM' && adjustedHour === 12) adjustedHour = 0

        const newTime = set(new Date(), {
            hours: adjustedHour,
            minutes: parseInt(minute),
            seconds: 0,
        })

        onChange(isValid(newTime) ? format(newTime, 'HH:mm:ss') : undefined)
    }

    const selectClass = cn(
        'h-9 rounded-md border bg-background px-2 text-sm',
        'border-border text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
    )

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
                    {selectedTime ? (
                        format(selectedTime, 'hh:mm a')
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-auto space-y-2 bg-popover text-popover-foreground border-border"
            >
                <div className="flex gap-2">
                    {/* Hour */}
                    <select
                        className={selectClass}
                        value={selectedTime ? format(selectedTime, 'hh') : ''}
                        onChange={(e) =>
                            handleTimeChange(
                                e.target.value,
                                selectedTime ? format(selectedTime, 'mm') : '00',
                                selectedTime ? format(selectedTime, 'a') : 'AM',
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
                        className={selectClass}
                        value={selectedTime ? format(selectedTime, 'mm') : ''}
                        onChange={(e) =>
                            handleTimeChange(
                                selectedTime ? format(selectedTime, 'hh') : '12',
                                e.target.value,
                                selectedTime ? format(selectedTime, 'a') : 'AM',
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

                    {/* AM/PM */}
                    <select
                        className={selectClass}
                        value={selectedTime ? format(selectedTime, 'a') : ''}
                        onChange={(e) =>
                            handleTimeChange(
                                selectedTime ? format(selectedTime, 'hh') : '12',
                                selectedTime ? format(selectedTime, 'mm') : '00',
                                e.target.value,
                            )
                        }
                        disabled={disabled}
                    >
                        <option value="" disabled>
                            Period
                        </option>
                        {periods.map((period) => (
                            <option key={period} value={period}>
                                {period}
                            </option>
                        ))}
                    </select>
                </div>
            </PopoverContent>
        </Popover>
    )
}

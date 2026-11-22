// src/components/fields/rating-input.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ratingLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Developing',
    3: 'Meets Expectations',
    4: 'Exceeds Expectations',
    5: 'Outstanding',
}

const ratingColors: Record<number, string> = {
    1: 'text-red-600',
    2: 'text-orange-600',
    3: 'text-yellow-600',
    4: 'text-green-600',
    5: 'text-emerald-600',
}

interface RatingInputProps {
    value?: number
    onChange?: (value: number) => void
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    showLabel?: boolean
    maxRating?: number
    className?: string
}

export function RatingInput({
                                value,
                                onChange,
                                size = 'md',
                                disabled = false,
                                showLabel = true,
                                maxRating = 5,
                                className,
                            }: RatingInputProps) {
    const [selected, setSelected] = useState<number>(value || 0)
    const [hovered, setHovered] = useState<number>(0)

    const sizeClasses = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
    }

    const handleSelect = (rating: number) => {
        if (disabled) return
        setSelected(rating)
        onChange?.(rating)
    }

    const displayRating = hovered || selected

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                    {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
                        <Tooltip key={rating}>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant={selected === rating ? 'default' : 'outline'}
                                    className={cn(
                                        'rounded-full transition-all',
                                        sizeClasses[size],
                                        hovered === rating && selected !== rating && 'border-primary',
                                        disabled && 'opacity-50 cursor-not-allowed'
                                    )}
                                    onClick={() => handleSelect(rating)}
                                    onMouseEnter={() => !disabled && setHovered(rating)}
                                    onMouseLeave={() => setHovered(0)}
                                    disabled={disabled}
                                >
                                    {rating}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{ratingLabels[rating]}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
            {showLabel && displayRating > 0 && (
                <p className={cn('text-sm font-medium', ratingColors[displayRating])}>
                    {ratingLabels[displayRating]}
                </p>
            )}
        </div>
    )
}

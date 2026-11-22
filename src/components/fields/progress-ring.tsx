// src/components/fields/progress-ring.tsx

'use client'

import { cn } from '@/lib/utils.ts'

interface ProgressRingProps {
    progress: number
    size?: number
    strokeWidth?: number
    className?: string
    showPercentage?: boolean
}

export function ProgressRing({
                                 progress,
                                 size = 60,
                                 strokeWidth = 6,
                                 className,
                                 showPercentage = true,
                             }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (progress / 100) * circumference

    const getColor = () => {
        if (progress >= 80) return 'text-green-500'
        if (progress >= 50) return 'text-blue-500'
        if (progress >= 25) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <div className={cn('relative', className)} style={{ width: size, height: size }}>
            <svg className="rotate-[-90deg]" width={size} height={size}>
                <circle
                    className="text-muted/30"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn('transition-all duration-500', getColor())}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                </div>
            )}
        </div>
    )
}

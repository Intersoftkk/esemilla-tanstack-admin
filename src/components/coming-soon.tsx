'use client'

import React from 'react'
import { cn } from '#/lib/utils'
import { Clock, Sparkles,  Bell } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {BackButton} from "#/components/back-button.tsx";

interface ComingSoonProps {
    /** Page/feature title */
    title?: string
    /** Description text */
    description?: string
    /** Icon to display */
    icon?: React.ComponentType<{ className?: string }>
    /** Expected release (optional) */
    expectedRelease?: string
    /** Show back button */
    showBackButton?: boolean
    /** Show notify button */
    showNotifyButton?: boolean
    /** Custom action */
    action?: React.ReactNode
    /** Additional className */
    className?: string
}

export function ComingSoon({
                               title = 'Coming Soon',
                               description = 'This feature is currently under development and will be available in a future update.',
                               icon: Icon = Sparkles,
                               expectedRelease,
                               showBackButton = true,
                               showNotifyButton = false,
                               action,
                               className,
                           }: ComingSoonProps) {

    return (
        <div className={cn(
            'flex min-h-[60vh] flex-col items-center justify-center px-4',
            className,
        )}>
            <div className="w-full max-w-md text-center">

                {/* Icon container */}
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30 animate-[spin_15s_linear_infinite_reverse]" />

                    {/* Center icon */}
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-7 w-7 text-primary" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Expected release badge */}
                {expectedRelease && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                        <Clock className="h-3 w-3" />
                        Expected: {expectedRelease}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    {showBackButton && (
                        <BackButton/>
                    )}

                    {showNotifyButton && (
                        <Button variant="default" className="gap-2">
                            <Bell className="h-4 w-4" />
                            Notify Me
                        </Button>
                    )}

                    {action}
                </div>

            </div>
        </div>
    )
}
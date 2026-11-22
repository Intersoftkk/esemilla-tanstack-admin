"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "#/components/ui/button"
import {cn} from "#/lib/utils";

interface BackButtonProps {
    label?: string
    className?: string
    fallbackHref?: string
}

export function BackButton({
                               label = "Back",
                               className,
                               fallbackHref,
                           }: BackButtonProps) {
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back()
        } else if (fallbackHref) {
            window.location.href = fallbackHref
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleBack}
            aria-label="Go back"
            className={cn(
                "cursor-pointer",
                "transition-colors",
                "hover:bg-accent/80",
                "active:bg-accent",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {label}
        </Button>
    )
}

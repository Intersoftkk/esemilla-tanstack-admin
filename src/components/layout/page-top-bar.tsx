import type * as React from "react"
import { cn } from "#/lib/utils"

export function PageTopBar({
                               className,
                               children,
                           }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mb-6 flex flex-col gap-4", className)}>
            {children}
        </div>
    )
}

export function PageTopBarHeader({
                                     className,
                                     children,
                                 }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex items-center justify-between gap-3", className)}>
            {children}
        </div>
    )
}

export function PageTopBarLeft({
                                   className,
                                   children,
                               }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex items-center gap-2 min-w-0", className)}>
            {children}
        </div>
    )
}

export function PageTopBarCenter({
                                     className,
                                     children,
                                 }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex-1 min-w-0", className)}>
            {children}
        </div>
    )
}

export function PageTopBarRight({
                                    className,
                                    children,
                                }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {children}
        </div>
    )
}

export function PageTopBarTitleBlock({
                                         className,
                                         children,
                                     }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("flex flex-col gap-1 min-w-0", className)}>
            {children}
        </div>
    )
}

export function PageTopBarTitle({
                                    className,
                                    children,
                                }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "text-2xl font-bold tracking-tight sm:text-3xl truncate",
                className
            )}
        >
            {children}
        </h1>
    )
}

export function PageTopBarSubtitle({
                                       className,
                                       children,
                                   }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
    )
}

export function PageTopBarMeta({
                                   className,
                                   children,
                               }: React.HTMLAttributes<HTMLDivElement>) {
    if (!children) return null
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {children}
        </div>
    )
}

export function PageTopBarBottom({
                                     className,
                                     children,
                                 }: React.HTMLAttributes<HTMLDivElement>) {
    if (!children) return null
    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-between gap-3",
                className
            )}
        >
            {children}
        </div>
    )
}

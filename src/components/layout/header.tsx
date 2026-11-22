import React, { useState, useEffect } from 'react'
import { cn } from '#/lib/utils'
import { Separator } from '#/components/ui/separator'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { RouterBreadcrumb } from "#/components/layout/router-breadcrumb";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    fixed?: boolean
}

export const Header = ({
                           className,
                           fixed,
                           children,
                           ...props
                       }: HeaderProps) => {
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const onScroll = () => {
            setOffset(window.scrollY)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={cn(
                'flex h-16 items-center gap-3 p-4 sm:gap-4 transition-all duration-300 border-b',
                // Base positioning
                fixed && 'sticky top-0 z-50 w-full',

                // Dynamic styles applied ONLY on scroll
                offset > 10
                    ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'
                    : '',

                className,
            )}
            {...props}
        >
            <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
            <Separator orientation="vertical" className="h-6" />
            <RouterBreadcrumb />
            {children}
        </header>
    )
}

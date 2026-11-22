import type { LucideIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

interface PageHeaderProps {
    title:            string | React.ReactNode
    description?:     string
    icon?:            LucideIcon
    iconClassName?:   string
    iconBgClassName?: string
    badge?:           React.ReactNode
    actions?:         React.ReactNode
    className?:       string
    size?:            'sm' | 'md'
}

export function PageHeader({
                               title,
                               description,
                               icon: Icon,
                               iconClassName,
                               iconBgClassName,
                               badge,
                               actions,
                               className,
                               size = 'md',
                           }: PageHeaderProps) {
    const isCompact = size === 'sm'

    return (
        <div
            className={cn(
                'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                className
            )}
        >
            {/* Left */}
            <div className="flex items-center gap-2.5 min-w-0">
                {Icon && (
                    <div
                        className={cn(
                            'flex shrink-0 items-center justify-center rounded-lg',
                            isCompact ? 'h-8 w-8' : 'h-9 w-9',
                            iconBgClassName ?? 'bg-primary/10'
                        )}
                    >
                        <Icon
                            className={cn(
                                isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4',
                                iconClassName ?? 'text-primary'
                            )}
                        />
                    </div>
                )}

                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1
                            className={cn(
                                'font-semibold truncate',
                                isCompact ? 'text-base' : 'text-lg'
                            )}
                        >
                            {title}
                        </h1>

                        {/* e.g. <Badge>Beta</Badge> or record count */}
                        {badge}
                    </div>

                    {description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Right */}
            {actions && (
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {actions}
                </div>
            )}
        </div>
    )
}
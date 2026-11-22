import * as React from "react";
import { Link } from "@tanstack/react-router";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

type LinkButtonProps = React.ComponentPropsWithoutRef<typeof Link> &
    VariantProps<typeof buttonVariants> & {
    disabled?: boolean;
};

export const LinkButton = React.forwardRef<
    HTMLAnchorElement,
    LinkButtonProps
>(
    (
        {
            variant,
            size,
            className,
            disabled = false,
            children,
            onClick,
            ...props
        },
        ref,
    ) => (
        <Link
            ref={ref}
            {...props}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                if (disabled) {
                    e.preventDefault();
                    return;
                }

                onClick?.(e);
            }}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(
                buttonVariants({ variant, size }),
                disabled && "pointer-events-none opacity-50",
                className,
            )}
        >
            {children}
        </Link>
    ),
);

LinkButton.displayName = "LinkButton";